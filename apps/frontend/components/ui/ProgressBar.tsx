import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'blue' | 'green' | 'amber' | 'red';
  showLabel?: boolean;
  height?: 'sm' | 'md';
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

export function ProgressBar({ value, color = 'blue', showLabel = false, height = 'md' }: ProgressBarProps) {
  const heightClass = height === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-gray-200 ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-gray-500">{Math.round(value)}%</span>
      )}
    </div>
  );
}
