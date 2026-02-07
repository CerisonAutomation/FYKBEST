import { z } from 'zod'

// Environment variables validation schema
// Some fields are optional during build but required at runtime
const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-development-build'

export const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Stripe - optional during build
  STRIPE_SECRET_KEY: isBuildPhase ? z.string().optional() : z.string().min(1),
  STRIPE_WEBHOOK_SECRET: isBuildPhase ? z.string().optional() : z.string().min(1),

  // Security - optional during build
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXTAUTH_SECRET: isBuildPhase ? z.string().optional() : z.string().min(1),

  // Redis for rate limiting (optional, fallback to memory)
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
})

// Validate environment variables
export const validateEnv = () => {
  try {
    const validatedEnv = envSchema.parse(process.env)
    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (issue) => `[${issue.path.join('.')}]: ${issue.message}`
      )
      console.error('Environment variables validation failed:', errorMessages)

      // Don't throw during build time to allow static generation
      if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
        throw new Error('Invalid environment variables')
      }
    }

    return process.env as any
  }
}

// Export validated environment variables
export const env = validateEnv()
