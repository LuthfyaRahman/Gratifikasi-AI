'use client';

import React, { useState } from 'react';
import { SimilarCase } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SimilarCasesPanelProps {
  cases: SimilarCase[];
}

export function SimilarCasesPanel({ cases }: SimilarCasesPanelProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!cases || cases.length === 0) {
    return (
      <Card title="Similar Cases">
        <p className="text-sm text-gray-500">No similar cases found.</p>
      </Card>
    );
  }

  return (
    <Card title="Similar Cases">
      <div className="space-y-3">
        {cases.slice(0, 5).map((c) => {
          const isExpanded = expandedId === c.id;
          const pct = Math.round(c.similarity_score * 100);
          return (
            <div key={c.id} className="rounded-md border border-gray-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">#{c.id}</span>
                  <Badge
                    label={c.final_label}
                    variant={c.final_label === 'Milik Negara' ? 'danger' : 'success'}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">{pct}% match</span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="text-xs text-gray-500 underline hover:text-gray-700"
                  >
                    {isExpanded ? 'collapse' : 'expand'}
                  </button>
                </div>
              </div>
              {isExpanded && (
                <p className="mt-2 text-sm text-gray-700">{c.preview}</p>
              )}
              {!isExpanded && (
                <p className="mt-1 truncate text-xs text-gray-500">{c.preview}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
