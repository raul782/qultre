import { describe, it, expect, beforeEach } from 'vitest';
import { WaitlistSchema, useWaitlistStore } from '../store/useWaitlistStore';

describe('Qultre Waitlist Validation & State Store', () => {
  
  describe('Zod Validation Schema', () => {
    it('should pass validation with valid name, email, and language', () => {
      const validData = {
        name: 'Raul Rodriguez',
        email: 'raul@qultre.com',
        language: 'es',
        preferredCity: 'lisbon'
      };
      const result = WaitlistSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation when name is too short', () => {
      const invalidData = {
        name: 'R',
        email: 'raul@qultre.com',
        language: 'es'
      };
      const result = WaitlistSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should fail validation when email is invalid', () => {
      const invalidData = {
        name: 'Raul',
        email: 'not-an-email',
        language: 'en'
      };
      const result = WaitlistSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should fail validation when language is not en or es', () => {
      const invalidData = {
        name: 'Raul',
        email: 'raul@qultre.com',
        language: 'fr' // French is not in WaitlistSchema z.enum
      };
      const result = WaitlistSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Zustand useWaitlistStore', () => {
    beforeEach(() => {
      // Reset store state before each test
      useWaitlistStore.setState({
        isSubmitted: false,
        isSubmitting: false,
        selectedCity: 'madrid',
        selectedCategory: 'finance'
      });
    });

    it('should update submitting state', () => {
      expect(useWaitlistStore.getState().isSubmitting).toBe(false);
      useWaitlistStore.getState().setSubmitting(true);
      expect(useWaitlistStore.getState().isSubmitting).toBe(true);
    });

    it('should update submitted state', () => {
      expect(useWaitlistStore.getState().isSubmitted).toBe(false);
      useWaitlistStore.getState().setSubmitted(true);
      expect(useWaitlistStore.getState().isSubmitted).toBe(true);
    });

    it('should update selected city state', () => {
      expect(useWaitlistStore.getState().selectedCity).toBe('madrid');
      useWaitlistStore.getState().setSelectedCity('lisbon');
      expect(useWaitlistStore.getState().selectedCity).toBe('lisbon');
    });

    it('should update selected category state', () => {
      expect(useWaitlistStore.getState().selectedCategory).toBe('finance');
      useWaitlistStore.getState().setSelectedCategory('weather');
      expect(useWaitlistStore.getState().selectedCategory).toBe('weather');
    });
  });

});
