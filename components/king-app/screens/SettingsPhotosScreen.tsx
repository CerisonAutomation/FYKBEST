'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Eye, Loader2, Lock, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'

// Generate stable photo IDs to prevent hydration mismatch
const generateStablePhotoId = (index: number) => {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substr(2, 9)
  return `photo-${timestamp}-${randomSuffix}`
}

// Optimized photo array operations with memoization
const usePhotoOperations = (photos: string[]) => {
  return useMemo(() => ({
    addPhoto: (newPhoto: string) => {
      const updatedPhotos = [...photos, newPhoto]
      return updatedPhotos
    },
    removePhoto: (index: number) => {
      const updatedPhotos = photos.filter((_, i) => i !== index)
      return updatedPhotos
    },
    reorderPhotos: (fromIndex: number, toIndex: number) => {
      const newPhotos = [...photos]
      const [movedPhoto] = newPhotos.splice(fromIndex, 1)
      newPhotos.splice(toIndex, 0, movedPhoto)
      return newPhotos
    }
  }), [photos])
}

export function SettingsPhotosScreen() {
  const vibrate = useVibrate()
  const { user, setUser, setStage } = useAppStore()
  const [uploading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>(user?.photos || [])

  const [isClient, setIsClient] = useState(false)
  const photoOps = usePhotoOperations(photos)

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleUpload = async () => {
    if (!user?.id || !isClient) return

    setLoading(true)
    vibrate([40, 20])

    try {
      // Generate stable photo ID to prevent hydration mismatch
      const newPhotoId = generateStablePhotoId(photos.length)
      const newPhoto = `https://images.unsplash.com/photo-${newPhotoId}?w=800&q=80`

      const updatedPhotos = photoOps.addPhoto(newPhoto)

      const { error } = await (supabase as any)
        .from('profiles')
        .update({ photos: updatedPhotos })
        .eq('user_id', user?.id)

      if (error) {
        console.error('Failed to upload photo:', error)
        // Show user-friendly error message
        alert('Failed to upload photo. Please try again.')
        throw error
      }

      setPhotos(updatedPhotos)
      setUser({ ...user!, photos: updatedPhotos })
    } catch (err) {
      console.error('Upload error:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!user?.id || !isClient) return
    vibrate([10, 50])

    try {
      const updatedPhotos = photoOps.removePhoto(index)

      const { error } = await (supabase as any)
        .from('profiles')
        .update({ photos: updatedPhotos })
        .eq('user_id', user?.id)

      if (error) {
        console.error('Failed to delete photo:', error)
        alert('Failed to delete photo. Please try again.')
        throw error
      }

      setPhotos(updatedPhotos)
      setUser({ ...user!, photos: updatedPhotos })
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete photo. Please try again.')
      throw err
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-black min-h-screen"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStage('settings')}
            className="p-2 hover:bg-slate-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-black text-white uppercase tracking-widest">MY ALBUM</h1>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 tracking-tighter">
          {photos.length}/12 SLOTS
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div
                key={photo}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="aspect-[3/4] relative group rounded-xl overflow-hidden border border-slate-800"
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 bg-red-600 rounded-full shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-amber-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-sm">
                    PRIMARY
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Button */}
          {photos.length < 12 && (
            <motion.button
              onClick={handleUpload}
              disabled={uploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="aspect-[3/4] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-amber-600/50 hover:bg-slate-900/30 transition-all group"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                    <Plus className="w-5 h-5 text-slate-500 group-hover:text-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-amber-500">
                    ADD PHOTO
                  </span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Security Info */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Eye className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Visibility Controls
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Only verified members can view your full album. Public visitors only see your
                primary photo blurred.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-4 border-t border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Private Vault
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Premium members can mark specific photos as "Private," requiring a permission
                request to view.
              </p>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
