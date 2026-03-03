'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';

interface ExplainabilityPanelProps {
  probabilities?: { [key: string]: number };
  tokens?: { token: string; weight: number }[];
}

export function ExplainabilityPanel({ probabilities, tokens }: ExplainabilityPanelProps) {
  const chartData = probabilities
    ? Object.entries(probabilities).map(([name, value]) => ({
        name,
        value: Math.round(value * 100),
      }))
    : [];

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706'];

  return (
    <Card title="Explainability">
      {chartData.length > 0 ? (
        <div>
          <p className="mb-3 text-sm text-gray-500">Prediction probability distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={130} />
              <Tooltip formatter={(value) => [`${value}%`, 'Probability']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No probability data available.</p>
      )}

      {tokens && tokens.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Key Tokens</p>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t, i) => (
              <span
                key={i}
                className="rounded px-2 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: `rgba(37, 99, 235, ${Math.min(1, t.weight)})` }}
              >
                {t.token}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
