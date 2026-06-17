import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { withProviders } from './Providers';
import { WaitlistSchema, useWaitlistStore, type WaitlistInput } from '@store/useWaitlistStore';

function WaitlistForm() {
  const { t, i18n } = useTranslation();
  const selectedCity = useWaitlistStore((state) => state.selectedCity);
  const isSubmitted = useWaitlistStore((state) => state.isSubmitted);
  const isSubmitting = useWaitlistStore((state) => state.isSubmitting);
  const setSubmitted = useWaitlistStore((state) => state.setSubmitted);
  const setSubmitting = useWaitlistStore((state) => state.setSubmitting);

  const [apiError, setApiError] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<WaitlistInput>({
    resolver: zodResolver(WaitlistSchema),
    defaultValues: {
      language: i18n.language === 'es' ? 'es' : 'en',
      preferredCity: selectedCity
    }
  });

  // Prefill city & language on updates
  React.useEffect(() => {
    reset((formValues) => ({
      ...formValues,
      preferredCity: selectedCity,
      language: i18n.language === 'es' ? 'es' : 'en'
    }));
  }, [selectedCity, i18n.language, reset]);

  const mutation = useMutation({
    mutationFn: async (values: WaitlistInput) => {
      setSubmitting(true);
      setApiError(null);
      
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit waitlist');
      }

      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setSubmitting(false);
      reset();
    },
    onError: (error: Error) => {
      setApiError(error.message || t('waitlist.error'));
      setSubmitting(false);
    }
  });

  const onSubmit = (data: WaitlistInput) => {
    mutation.mutate(data);
  };

  // Parallax tilt calculator
  const handleMouseMove = (e: React.MouseEvent<HTMLFormElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    setTilt({
      x: -(y / (box.height / 2)) * 8, // Max 8 degrees tilt on X
      y: (x / (box.width / 2)) * 8   // Max 8 degrees tilt on Y
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (isSubmitted) {
    return (
      <div className="p-8 text-center glass rounded-3xl border border-primary-500/30 max-w-md mx-auto shadow-2xl bg-white/80 dark:bg-slate-950/80 animate-fade-in transition-all">
        <div className="w-16 h-16 bg-gradient-to-tr from-accent-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3">
          {t('waitlist.success')}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          You have successfully secured your beta vector for {selectedCity.toUpperCase()}. We will keep you updated.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out, background-color 0.3s, border-color 0.3s'
        }}
        className="space-y-5 p-8 glass rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl bg-white/70 dark:bg-slate-950/70"
      >
        <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          {t('waitlist.title')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {t('waitlist.subtitle')}
        </p>

        <input type="hidden" {...register('language')} />
        <input type="hidden" {...register('preferredCity')} />

        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('waitlist.form.name')}
          </label>
          <input
            {...register('name')}
            type="text"
            className="w-full bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="e.g. Gemini Explorer"
          />
          {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('waitlist.form.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="e.g. explorer@qultre.app"
          />
          {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative group overflow-hidden px-6 py-4 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('waitlist.form.submitting')}
                </>
              ) : (
                t('waitlist.form.button')
              )}
            </span>
          </button>
        </div>

        {apiError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] mt-4 animate-fade-in">
            {apiError}
          </div>
        )}
      </form>
    </div>
  );
}

export default withProviders(WaitlistForm);
