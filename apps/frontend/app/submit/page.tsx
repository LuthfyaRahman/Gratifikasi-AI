'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { submitRecord } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

const submitSchema = z.object({
  text: z.string().min(10, 'Description must be at least 10 characters'),
  value_estimation: z.string().min(1, 'Value is required').refine(
    (v) => !isNaN(Number(v)) && Number(v) >= 0,
    { message: 'Value must be a positive number' }
  ),
  relationship: z.string().min(1, 'Relationship is required'),
  context: z.string().min(1, 'Context is required'),
  country: z.string().min(1, 'Country is required'),
  regulatory_framework: z.string().optional(),
});

type SubmitForm = z.infer<typeof submitSchema>;

const relationshipOptions = ['vendor', 'client', 'partner', 'family', 'other'];
const contextOptions = ['tender', 'seminar', 'post-project', 'internal', 'private'];

export default function SubmitPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitForm>({ resolver: zodResolver(submitSchema) });

  async function onSubmit(data: SubmitForm) {
    setSubmitting(true);
    try {
      const record = await submitRecord({
        ...data,
        value_estimation: Number(data.value_estimation),
      });
      addToast('Report submitted successfully!', 'success');
      reset();
      router.push(`/case/${record.id}`);
    } catch {
      addToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Submit Gratification Report">
      <div className="mx-auto max-w-2xl">
        <Card title="New Gratification Report">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('text')}
                rows={5}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Describe the gratification in detail..."
              />
              {errors.text && <p className="mt-1 text-xs text-red-600">{errors.text.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimated Value (IDR) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('value_estimation')}
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 500000"
              />
              {errors.value_estimation && (
                <p className="mt-1 text-xs text-red-600">{errors.value_estimation.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('relationship')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {relationshipOptions.map((o) => (
                    <option key={o} value={o} className="capitalize">
                      {o}
                    </option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className="mt-1 text-xs text-red-600">{errors.relationship.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Context <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('context')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {contextOptions.map((o) => (
                    <option key={o} value={o} className="capitalize">
                      {o.replace('-', ' ')}
                    </option>
                  ))}
                </select>
                {errors.context && (
                  <p className="mt-1 text-xs text-red-600">{errors.context.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('country')}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Indonesia"
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Regulatory Framework
                </label>
                <input
                  {...register('regulatory_framework')}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. KPK Regulation"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => reset()}>
                Clear
              </Button>
              <Button type="submit" loading={submitting}>
                Submit Report
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
