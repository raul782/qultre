import { create } from 'zustand';
import { z } from 'zod';

export const WaitlistSchema = z.object({
  name: z.string().min(2, { message: "Name is too short / El nombre es demasiado corto" }),
  email: z.string().email({ message: "Invalid email address / Dirección de correo inválida" }),
  language: z.enum(['en', 'es']),
  preferredCity: z.string().optional()
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;

interface WaitlistState {
  isSubmitted: boolean;
  isSubmitting: boolean;
  selectedCity: string;
  selectedCategory: 'finance' | 'tourism' | 'demographics' | 'weather';
  setSubmitting: (loading: boolean) => void;
  setSubmitted: (success: boolean) => void;
  setSelectedCity: (cityId: string) => void;
  setSelectedCategory: (category: 'finance' | 'tourism' | 'demographics' | 'weather') => void;
}

export const useWaitlistStore = create<WaitlistState>((set) => ({
  isSubmitted: false,
  isSubmitting: false,
  selectedCity: 'madrid',
  selectedCategory: 'finance',
  setSubmitting: (loading) => set({ isSubmitting: loading }),
  setSubmitted: (success) => set({ isSubmitted: success }),
  setSelectedCity: (cityId) => set({ selectedCity: cityId }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
