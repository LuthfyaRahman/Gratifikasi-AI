'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { statusBadge } from '@/components/ui/Badge';
import { AiRecommendationPanel } from '@/components/case/AiRecommendationPanel';
import { SimilarCasesPanel } from '@/components/case/SimilarCasesPanel';
import { ExplainabilityPanel } from '@/components/case/ExplainabilityPanel';
import { AuditTimeline } from '@/components/case/AuditTimeline';
import { getRecord, approveRecord, getAuditLog } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UserRole, GratifikasiRecord, AuditLog } from '@/types';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [record, setRecord] = useState<GratifikasiRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [rec, logs] = await Promise.all([getRecord(id), getAuditLog(id)]);
        setRecord(rec);
        setAuditLogs(Array.isArray(logs) ? logs : []);
      } catch {
        addToast('Failed to load case details.', 'error');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, addToast]);

  async function handleDecision(label: string) {
    if (!record) return;
    setActionLoading(true);
    try {
      const updated = await approveRecord(record.id, { final_label: label, note });
      setRecord(updated);
      addToast(`Case ${label === 'APPROVED' ? 'approved' : 'rejected'} successfully.`, 'success');
      setShowNoteInput(false);
      setNote('');
      const logs = await getAuditLog(record.id);
      setAuditLogs(Array.isArray(logs) ? logs : []);
    } catch {
      addToast('Action failed. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  const canAct =
    user &&
    [UserRole.COMPLIANCE_OFFICER, UserRole.SUPERVISOR, UserRole.ADMIN].includes(user.role) &&
    record?.status === 'WAITING_APPROVAL';

  if (loading) {
    return (
      <DashboardLayout title="Case Detail">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!record) {
    return (
      <DashboardLayout title="Case Detail">
        <p className="text-sm text-red-600">Case not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Case #${record.id}`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Info */}
          <Card title="Case Information">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Status:</span>
                {statusBadge(record.status)}
                {record.final_label && (
                  <span className="text-sm font-medium text-gray-700">
                    Final: {record.final_label}
                  </span>
                )}
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="mt-1 rounded-md bg-gray-50 p-3 text-sm text-gray-900 whitespace-pre-wrap">
                  {record.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Estimated Value</span>
                  <div className="font-medium text-gray-900">
                    IDR {record.value_estimation?.toLocaleString('id-ID')}
                  </div>
                </div>
                {record.relationship && (
                  <div>
                    <span className="text-gray-500">Relationship</span>
                    <div className="font-medium text-gray-900 capitalize">{record.relationship}</div>
                  </div>
                )}
                {record.context && (
                  <div>
                    <span className="text-gray-500">Context</span>
                    <div className="font-medium text-gray-900 capitalize">{record.context.replace('-', ' ')}</div>
                  </div>
                )}
                {record.country && (
                  <div>
                    <span className="text-gray-500">Country</span>
                    <div className="font-medium text-gray-900">{record.country}</div>
                  </div>
                )}
                {record.regulatory_framework && (
                  <div>
                    <span className="text-gray-500">Regulatory Framework</span>
                    <div className="font-medium text-gray-900">{record.regulatory_framework}</div>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Submitted</span>
                  <div className="font-medium text-gray-900">
                    {new Date(record.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Panel */}
          {canAct && (
            <Card title="Actions">
              <div className="space-y-4">
                {showNoteInput && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Note</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Add a note (optional)"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="success"
                    loading={actionLoading}
                    onClick={() => handleDecision('Bukan Milik Negara')}
                  >
                    ✓ Approve (Bukan Milik Negara)
                  </Button>
                  <Button
                    variant="danger"
                    loading={actionLoading}
                    onClick={() => handleDecision('Milik Negara')}
                  >
                    ✕ Reject (Milik Negara)
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowNoteInput(!showNoteInput)}
                  >
                    {showNoteInput ? 'Hide Note' : 'Add Note'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Explainability */}
          {record.ai_result?.probabilities && (
            <ExplainabilityPanel probabilities={record.ai_result.probabilities} />
          )}

          {/* Similar Cases */}
          <SimilarCasesPanel cases={record.ai_result?.similar_cases ?? []} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AiRecommendationPanel
            aiResult={record.ai_result}
            aiLabel={record.ai_label}
            aiConfidence={record.ai_confidence}
            aiSource={record.ai_source}
          />
          <AuditTimeline logs={auditLogs} />
        </div>
      </div>
    </DashboardLayout>
  );
}
