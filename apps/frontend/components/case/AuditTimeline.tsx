import React from 'react';
import { AuditLog } from '@/types';
import { Card } from '@/components/ui/Card';

interface AuditTimelineProps {
  logs: AuditLog[];
}

const actionColors: Record<string, string> = {
  SUBMITTED: 'bg-blue-500',
  PREDICTED: 'bg-purple-500',
  REVIEWED: 'bg-amber-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  OVERRIDDEN: 'bg-orange-500',
};

export function AuditTimeline({ logs }: AuditTimelineProps) {
  if (!logs || logs.length === 0) {
    return (
      <Card title="Audit Timeline">
        <p className="text-sm text-gray-500">No audit events yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Audit Timeline">
      <div className="relative">
        <div className="absolute left-3 top-0 h-full w-px bg-gray-200" />
        <ul className="space-y-4">
          {logs.map((log, i) => (
            <li key={log.id ?? i} className="relative pl-8">
              <div
                className={`absolute left-0 top-1 h-6 w-6 rounded-full ${actionColors[log.action] ?? 'bg-gray-400'} flex items-center justify-center`}
              >
                <span className="text-xs text-white font-bold">{log.action.charAt(0)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{log.action}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">by {log.actor}</div>
                {log.note && (
                  <p className="mt-1 rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">{log.note}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
