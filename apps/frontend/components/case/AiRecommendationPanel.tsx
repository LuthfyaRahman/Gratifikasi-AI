import React from 'react';
import { AiResult } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface AiRecommendationPanelProps {
  aiResult?: AiResult;
  aiLabel?: string;
  aiConfidence?: number;
  aiSource?: string;
}

export function AiRecommendationPanel({ aiResult, aiLabel, aiConfidence, aiSource }: AiRecommendationPanelProps) {
  const label = aiResult?.label ?? aiLabel ?? 'N/A';
  const confidence = aiResult?.confidence ?? aiConfidence ?? 0;
  const source = aiResult?.source ?? aiSource ?? 'N/A';
  const pct = Math.round(confidence * 100);
  const color = pct >= 80 ? 'green' : pct >= 60 ? 'amber' : 'red';

  return (
    <Card title="AI Recommendation">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Predicted Label</span>
          <Badge
            label={label}
            variant={label === 'Milik Negara' ? 'danger' : 'success'}
            className="text-sm px-3 py-1"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Confidence</span>
            <span className="text-sm font-bold text-gray-900">{pct}%</span>
          </div>
          <ProgressBar value={pct} color={color} height="md" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Source</span>
            <div className="font-medium text-gray-900 capitalize">{source}</div>
          </div>
          {aiResult?.model_version && (
            <div>
              <span className="text-gray-500">Model Version</span>
              <div className="font-medium text-gray-900">{aiResult.model_version}</div>
            </div>
          )}
          {aiResult?.model_run_id && (
            <div>
              <span className="text-gray-500">Run ID</span>
              <div className="font-mono text-xs text-gray-700">{aiResult.model_run_id}</div>
            </div>
          )}
          {aiResult?.timestamp && (
            <div>
              <span className="text-gray-500">Timestamp</span>
              <div className="font-medium text-gray-900">
                {new Date(aiResult.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
