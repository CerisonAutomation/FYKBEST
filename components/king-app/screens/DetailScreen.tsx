'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Lock as LockIcon,
  MapPin,
  MessageCircle,
  Shield,
  Star,
} from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { ReportModal } from '../modals/ReportModal'

// Generate stable IDs to prevent hydration mismatch
const generateStableId = (prefix: string, seed: number) => {
  return `${prefix}-${seed}-${Date.now().toString(36)}`
}

// Memoized favorite check to prevent performance issues
const useIsFavorite = (matchId: string, favorites: string[]) => {
  return useMemo(() => favorites.includes(matchId), [matchId, favorites])
}

export function DetailScreen() {
  const vibrate = useVibrate()
  const {
    selectedMatch,
    setSelectedMatch,
    setStage,
    currentPhotoIndex,
    setCurrentPhotoIndex,
    subscribed,
    favorites,
    toggleFavorite,
    setActiveChat,
    addBooking,
    user,
  } = useAppStore()

  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!selectedMatch || !isClient) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-slate-500">No profile selected</p>
      </div>
    )
  }

  // Optimized favorite check with memoization
  const isFavorite = useIsFavorite(selectedMatch.id, favorites)

  const handleBack = () => {
    vibrate([10])
    setSelectedMatch(null)
    setStage('browse')
  }

  const handleMessage = () => {
    vibrate([20])
    setActiveChat(selectedMatch.id)
    setStage('messages')
  }

  const handleBook = () => {
    vibrate([30])
    addBooking({
      id: Math.random().toString(36).substring(7),
      matchId: selectedMatch.id,
      matchName: selectedMatch.name,
      matchPhoto: selectedMatch.photos?.[0] || '',
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      time: '8:00 PM',
      hours: 2,
      price: 299,
      status: 'pending',
      reminder: false,
    } as any)
    setStage('bookings')
  }

  const handleToggleFavorite = () => {
    vibrate([10])
    toggleFavorite(selectedMatch.id)
  }

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    vibrate([5])
    setCurrentPhotoIndex((currentPhotoIndex + 1) % selectedMatch.photos.length)
  }

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    vibrate([5])
    setCurrentPhotoIndex(
      (currentPhotoIndex - 1 + selectedMatch.photos.length) % selectedMatch.photos.length
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full space-y-6 sm:space-y-8 pb-24 sm:pb-32"
    >
      {/* Hero Image Section */}
      <div className="relative aspect-[4/5] sm:aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhotoIndex}
            src={selectedMatch.photos[currentPhotoIndex]}
            alt={selectedMatch.name}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={prevPhoto}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextPhoto}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Photo Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {selectedMatch.photos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentPhotoIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="px-1 sm:px-2 space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black">{selectedMatch.name}</h1>
            {selectedMatch.verified && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-full">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-400">VERIFIED</span>
              </div>
            )}
          </div>
          <p className="text-3xl sm:text-4xl text-amber-400 font-black">
            ${selectedMatch.rate}
            <span className="text-sm sm:text-base text-slate-400 font-normal">/hr</span>
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 text-slate-400 text-xs sm:text-sm font-light">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {selectedMatch.city}
            </span>
            <span className="flex items-center gap-1.5">🎂 {selectedMatch.age} years</span>
            <span className="flex items-center gap-1.5">📏 {selectedMatch.distance}km away</span>
          </div>
        </div>

        {/* Online Status */}
        {selectedMatch.online && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-green-400 font-bold text-sm"
          >
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span>ONLINE NOW</span>
          </motion.div>
        )}

        {/* About Card */}
        <div className="bg-gradient-to-r from-slate-900/60 to-slate-950/40 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
          <div>
            <p className="text-xs font-black text-amber-500 tracking-wider mb-2 sm:mb-3 uppercase">
              About
            </p>
            <p className="text-slate-300 text-sm leading-relaxed font-light">{selectedMatch.bio}</p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">
              Albums
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '1', title: 'Summer Vibes', items: 12, private: false },
                { id: '2', title: 'Workouts', items: 5, private: true },
              ].map((album) => (
                <div
                  key={album.id}
                  className="relative group aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
                >
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center">
                    {album.private ? (
                      <>
                        <LockIcon className="w-5 h-5 text-amber-500 mb-2" />
                        <p className="text-[10px] font-bold text-white uppercase">{album.title}</p>
                        <button className="mt-2 text-[8px] font-black text-amber-500 underline uppercase tracking-tighter">
                          Request Access
                        </button>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-slate-400 mb-2" />
                        <p className="text-[10px] font-bold text-white uppercase">{album.title}</p>
                        <p className="text-[8px] text-slate-500 uppercase">{album.items} Photos</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto pt-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={handleMessage}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              MESSAGE
            </motion.button>

            <motion.button
              onClick={handleBook}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 sm:py-4 bg-white text-black font-black rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-lg text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              BOOK NOW
            </motion.button>
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              handleToggleFavorite()
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3.5 sm:py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              isFavorite
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
          </motion.button>

          <motion.button
            onClick={() => setIsReportOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-red-500 hover:text-red-400 transition text-[10px] font-black flex items-center justify-center gap-2 uppercase tracking-widest opacity-50 hover:opacity-100"
          >
            <AlertTriangle className="w-3 h-3" />
            Report Profile
          </motion.button>

          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-600 transition text-slate-300 font-bold text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </motion.button>
        </div>
      </div>
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetUserId={selectedMatch.id}
      />
    </motion.div>
  )
}
