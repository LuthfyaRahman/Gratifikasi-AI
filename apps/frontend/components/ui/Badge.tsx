import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {label}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, BadgeVariant> = {
    PENDING: 'warning',
    WAITING_APPROVAL: 'info',
    APPROVED: 'success',
    REJECTED: 'danger',
    NEEDS_REVIEW: 'warning',
  };
  return <Badge label={status.replace('_', ' ')} variant={map[status] ?? 'neutral'} />;
}

export function confidenceBadge(confidence: number) {
  const pct = Math.round(confidence * 100);
  const variant: BadgeVariant = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'danger';
  return <Badge label={`${pct}%`} variant={variant} />;
}
