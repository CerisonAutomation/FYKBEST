import { z } from 'zod'

// Password complexity requirements:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Email validation schema
export const emailSchema = z.string().email('Please enter a valid email address')

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name must not exceed 100 characters')
  .regex(/^[A-Za-z\s'-]+$/, 'Name can only contain letters, spaces, apostrophes, and hyphens')

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Signup validation schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  role: z.enum(['seeker', 'provider', 'admin', 'moderator']).optional().default('seeker'),
})

// Update profile validation schema
export const updateProfileSchema = z.object({
  display_name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  about_me: z.string().max(1000).optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  sexual_orientation: z.string().optional(),
  pronouns: z.string().optional(),
  languages: z.array(z.string()).optional(),
  seeking_gender: z.string().optional(),
  relationship_status: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  interests: z.array(z.string()).optional(),
  looking_for: z.array(z.string()).optional(),
  tribes: z.array(z.string()).optional(),
  height_cm: z.number().min(100).max(250).optional(),
  weight_kg: z.number().min(30).max(300).optional(),
  body_type: z.string().optional(),
  ethnicity: z.string().optional(),
  fitness_level: z.string().optional(),
  hourly_rate: z.number().min(0).optional(),
})

// Create party validation schema
export const createPartySchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  location: z.string().min(2).max(100),
  date: z.string(),
  time: z.string(),
  duration_hours: z.number().min(1).max(24),
  max_participants: z.number().min(2).max(100),
  entry_fee: z.number().min(0),
  tags: z.array(z.string()).optional(),
})

// Booking validation schema
export const createBookingSchema = z.object({
  provider_id: z.string(),
  booking_date: z.string(),
  start_time: z.string(),
  duration_hours: z.number().min(1).max(24),
  total_price: z.number().min(0),
  location: z.string().optional(),
  notes: z.string().max(500).optional(),
})

// Message validation schema
export const createMessageSchema = z.object({
  conversation_id: z.string(),
  content: z.string().min(1).max(1000),
  message_type: z
    .enum(['text', 'image', 'video', 'audio', 'location', 'system', 'quickshare'])
    .default('text'),
  attachment_url: z.string().optional(),
})
