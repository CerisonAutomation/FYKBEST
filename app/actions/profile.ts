/**
 * Profile Server Actions
 *
 * Demonstrates:
 * - Server Functions with "use server" directive
 * - Form submissions with Server Actions
 * - Revalidation after mutations
 * - Error handling patterns
 * - Cookie manipulation
 * - File upload validation and security
 *
 * @see https://nextjs.org/docs/app/getting-started/updating-data
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface ProfileData {
  display_name: string
  bio?: string
  location?: string
  website?: string | null
}

// File upload security configuration
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES_PER_UPLOAD = 10

/**
 * Validate file for security
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Check for empty files
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' }
  }

  // Validate filename (prevent path traversal)
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  if (sanitizedName.length === 0 || sanitizedName.length > 255) {
    return { valid: false, error: 'Invalid filename' }
  }

  return { valid: true }
}

/**
 * Sanitize filename for storage
 */
function sanitizeFileName(fileName: string): string {
  // Remove path components and special characters
  const baseName = fileName
    .replace(/^.*[\\/]/, '') // Remove path
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .substring(0, 100) // Limit length

  // Add timestamp and random string for uniqueness
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = baseName.split('.').pop() || 'jpg'
  const name = baseName.split('.').slice(0, -1).join('.') || 'image'

  return `${name}_${timestamp}_${random}.${extension}`
}

/**
 * Update Profile Action
 *
 * Called from forms to update the current user's profile.
 * Automatically receives FormData when used with form action.
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Parse form data
  const rawData: ProfileData = {
    display_name: formData.get('display_name') as string,
    bio: (formData.get('bio') as string) || undefined,
    location: (formData.get('location') as string) || undefined,
    website: (formData.get('website') as string) || null,
  }

  // Validate
  if (!rawData.display_name || rawData.display_name.length < 1) {
    return { error: 'Display name is required' }
  }

  if (rawData.display_name.length > 50) {
    return { error: 'Display name must be less than 50 characters' }
  }

  if (rawData.bio && rawData.bio.length > 500) {
    return { error: 'Bio must be less than 500 characters' }
  }

  if (rawData.website) {
    try {
      new URL(rawData.website)
    } catch {
      return { error: 'Invalid website URL' }
    }
  }

  // Update profile
  // @ts-ignore - Table not in generated types yet
  const { data: profile, error } = await (supabase.from('profiles') as any)
    .update(rawData)
    .eq('user_id', user.id)
    .select('username')
    .single()

  if (error) {
    return { error: 'Failed to update profile', details: error.message }
  }

  // Revalidate cache
  revalidateTag(`profile-${user.id}`)
  revalidateTag('profiles')
  revalidatePath(`/profile/${(profile as { username: string }).username}`)
  revalidatePath('/browse')

  return { success: true, profile }
}

/**
 * Toggle Follow Action
 *
 * Demonstrates:
 * - Server Action with JSON body (not form)
 * - Conditional mutation (follow/unfollow)
 */
export async function toggleFollow(profileId: string, isFollowing: boolean) {
  // Validate input
  if (!profileId || typeof profileId !== 'string') {
    return { error: 'Invalid profile ID' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Prevent self-follow
  if (profileId === user.id) {
    return { error: 'Cannot follow yourself' }
  }

  if (isFollowing) {
    // Unfollow
    // @ts-ignore - Table not in generated types yet
    const { error } = await (supabase.from('follows') as any)
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', profileId)

    if (error) return { error: error.message }
  } else {
    // Follow
    // @ts-ignore - Table not in generated types yet
    const { error } = await (supabase.from('follows') as any).insert({
      follower_id: user.id,
      following_id: profileId,
    })

    if (error) return { error: error.message }
  }

  // Revalidate
  revalidateTag(`profile-${profileId}`)

  return { success: true, following: !isFollowing }
}

/**
 * Upload Photo Action
 *
 * Demonstrates:
 * - Server Action with file upload
 * - File validation and security
 * - Cookie manipulation
 */
export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const file = formData.get('photo') as File

  if (!file) {
    return { error: 'No file provided' }
  }

  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    return { error: validation.error }
  }

  // Sanitize filename
  const sanitizedFileName = sanitizeFileName(file.name)
  const fileName = `${user.id}/${sanitizedFileName}`

  // Check user upload quota (prevent abuse)
  // @ts-ignore - Table not in generated types yet
  const { data: existingPhotos, error: countError } = await supabase.storage
    .from('photos')
    .list(user.id)

  if (!countError && existingPhotos && existingPhotos.length >= MAX_FILES_PER_UPLOAD) {
    return {
      error: `Upload limit reached. Maximum ${MAX_FILES_PER_UPLOAD} photos allowed. Please delete some photos first.`,
    }
  }

  try {
    // Upload to storage
    // @ts-ignore - Bucket not in generated types yet
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return { error: uploadError.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('photos').getPublicUrl(fileName)

    // Create photo record
    // @ts-ignore - Table not in generated types yet
    const { error: dbError } = await (supabase.from('photos') as any).insert({
      user_id: user.id,
      url: publicUrl,
      filename: fileName,
      original_name: file.name,
      size: file.size,
      mime_type: file.type,
      uploaded_at: new Date().toISOString(),
    })

    if (dbError) {
      // Rollback: delete uploaded file
      await supabase.storage.from('photos').remove([fileName])
      return { error: dbError.message }
    }

    // Set success message cookie
    const cookieStore = await cookies()
    cookieStore.set('upload_success', 'true', {
      maxAge: 5,
      path: '/',
    })

    // Revalidate
    revalidateTag(`profile-${user.id}`)
    revalidatePath(`/profile/[username]`, 'page')

    return { success: true, url: publicUrl }
  } catch (error: any) {
    console.error('Upload error:', error)
    return { error: 'Upload failed. Please try again.' }
  }
}

/**
 * Upload Multiple Photos Action
 */
export async function uploadMultiplePhotos(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const files = formData.getAll('photos') as File[]

  if (!files.length) {
    return { error: 'No files provided' }
  }

  if (files.length > 5) {
    return { error: 'Maximum 5 files per upload' }
  }

  const results = []
  const errors = []

  for (const file of files) {
    // Validate each file
    const validation = validateFile(file)
    if (!validation.valid) {
      errors.push({ file: file.name, error: validation.error })
      continue
    }

    const sanitizedFileName = sanitizeFileName(file.name)
    const fileName = `${user.id}/${sanitizedFileName}`

    try {
      // @ts-ignore - Bucket not in generated types yet
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        errors.push({ file: file.name, error: uploadError.message })
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('photos').getPublicUrl(fileName)

      // @ts-ignore - Table not in generated types yet
      await (supabase.from('photos') as any).insert({
        user_id: user.id,
        url: publicUrl,
        filename: fileName,
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
        uploaded_at: new Date().toISOString(),
      })

      results.push({ file: file.name, url: publicUrl, success: true })
    } catch (error: any) {
      errors.push({ file: file.name, error: error.message })
    }
  }

  // Revalidate
  if (results.length > 0) {
    revalidateTag(`profile-${user.id}`)
    revalidatePath(`/profile/[username]`, 'page')
  }

  return {
    success: errors.length === 0,
    uploaded: results.length,
    failed: errors.length,
    results,
    errors,
  }
}

/**
 * Delete Photo Action
 */
export async function deletePhoto(photoId: string) {
  if (!photoId) {
    return { error: 'Photo ID required' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get photo record
  // @ts-ignore - Table not in generated types yet
  const { data: photo, error: fetchError } = await (supabase.from('photos') as any)
    .select('*')
    .eq('id', photoId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !photo) {
    return { error: 'Photo not found' }
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage.from('photos').remove([photo.filename])

  if (storageError) {
    console.error('Storage delete error:', storageError)
  }

  // Delete record
  // @ts-ignore - Table not in generated types yet
  const { error: deleteError } = await (supabase.from('photos') as any)
    .delete()
    .eq('id', photoId)
    .eq('user_id', user.id)

  if (deleteError) {
    return { error: 'Failed to delete photo' }
  }

  revalidateTag(`profile-${user.id}`)

  return { success: true }
}

/**
 * Delete Account Action
 *
 * Demonstrates:
 * - Destructive action with confirmation
 * - Redirect after action
 * - Data cleanup
 */
export async function deleteAccount(confirmation: string) {
  if (confirmation !== 'DELETE') {
    return { error: 'Confirmation required. Type DELETE to confirm.' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Soft delete - mark as deleted
  // @ts-ignore - Table not in generated types yet
  const { error } = await (supabase.from('profiles') as any)
    .update({
      deleted_at: new Date().toISOString(),
      is_public: false,
      username: `deleted_${user.id.substring(0, 8)}`, // Free up username
    })
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Sign out
  await supabase.auth.signOut()

  // Revalidate
  revalidateTag('profiles')

  // Redirect to home
  redirect('/')
}
