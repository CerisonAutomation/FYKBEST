import { generateCsrfToken } from '@/lib/security/csrf'
import {
  loginSchema,
  passwordSchema,
  signupSchema,
  updateProfileSchema,
} from '@/lib/validators/auth'
import { validateEnv } from '@/lib/validators/env'
import { describe, expect, it } from 'vitest'

describe('Security Validation Tests', () => {
  describe('Environment Variables Validation', () => {
    it('should validate environment variables', async () => {
      const validatedEnv = validateEnv()
      expect(validatedEnv).toBeDefined()
      expect(typeof validatedEnv).toBe('object')
    })

    it('should have required Supabase variables', async () => {
      const validatedEnv = validateEnv()
      expect(validatedEnv.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
      expect(typeof validatedEnv.NEXT_PUBLIC_SUPABASE_URL).toBe('string')
      expect(validatedEnv.NEXT_PUBLIC_SUPABASE_URL).not.toBe('')

      expect(validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
      expect(typeof validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('string')
      expect(validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).not.toBe('')
    })

    it('should validate NODE_ENV', async () => {
      const validatedEnv = validateEnv()
      expect(['development', 'test', 'production']).toContain(validatedEnv.NODE_ENV)
    })
  })

  describe('Password Complexity Validation', () => {
    it('should reject passwords shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Short1!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('at least 8 characters')
      }
    })

    it('should reject passwords without uppercase letters', () => {
      const result = passwordSchema.safeParse('password1!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('uppercase')
      }
    })

    it('should reject passwords without lowercase letters', () => {
      const result = passwordSchema.safeParse('PASSWORD1!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('lowercase')
      }
    })

    it('should reject passwords without numbers', () => {
      const result = passwordSchema.safeParse('Password!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('number')
      }
    })

    it('should reject passwords without special characters', () => {
      const result = passwordSchema.safeParse('Password1')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('special')
      }
    })

    it('should accept valid complex passwords', () => {
      const result = passwordSchema.safeParse('StrongPass1!')
      expect(result.success).toBe(true)
    })
  })

  describe('Input Validation Schemas', () => {
    describe('Login Schema', () => {
      it('should validate valid login data', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
          password: 'StrongPass1!',
        })
        expect(result.success).toBe(true)
      })

      it('should reject invalid email format', () => {
        const result = loginSchema.safeParse({
          email: 'invalid-email',
          password: 'StrongPass1!',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('valid email')
        }
      })

      it('should reject missing password', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('Required')
        }
      })
    })

    describe('Signup Schema', () => {
      it('should validate valid signup data', () => {
        const result = signupSchema.safeParse({
          email: 'test@example.com',
          password: 'StrongPass1!',
          name: 'John Doe',
          role: 'seeker',
        })
        expect(result.success).toBe(true)
      })

      it('should reject invalid name', () => {
        const result = signupSchema.safeParse({
          email: 'test@example.com',
          password: 'StrongPass1!',
          name: 'X', // Too short
          role: 'seeker',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0]?.message).toContain('at least 2 characters')
        }
      })

      it('should reject invalid role', () => {
        const result = signupSchema.safeParse({
          email: 'test@example.com',
          password: 'StrongPass1!',
          name: 'John Doe',
          role: 'invalid-role',
        })
        expect(result.success).toBe(false)
      })
    })

    describe('Profile Update Schema', () => {
      it('should validate valid profile data', () => {
        const result = updateProfileSchema.safeParse({
          display_name: 'John Doe',
          bio: 'I am a developer',
          city: 'New York',
          height_cm: 180,
          weight_kg: 75,
        })
        expect(result.success).toBe(true)
      })

      it('should reject invalid height', () => {
        const result = updateProfileSchema.safeParse({
          height_cm: 90, // Too short
        })
        expect(result.success).toBe(false)
      })

      it('should reject invalid weight', () => {
        const result = updateProfileSchema.safeParse({
          weight_kg: 25, // Too light
        })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('CSRF Protection', () => {
    it('should generate valid CSRF tokens', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()

      expect(token1).toBeDefined()
      expect(token2).toBeDefined()
      expect(typeof token1).toBe('string')
      expect(token1.length).toBeGreaterThan(10)
      expect(token1).not.toEqual(token2) // Tokens should be unique
    })
  })
})
