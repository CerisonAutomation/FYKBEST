'use client'

import type { Match } from '@/types/app'
import { motion } from 'framer-motion'
import { AlertTriangle, Heart, MapPin, MessageCircle, Shield, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { ReportModal } from '../modals/ReportModal'

interface ProfileCardProps {
  match: Match
  index: number
  subscribed: boolean
  isFavorite: boolean
  onView: () => void
  onToggleFavorite: () => void
  onSubscribe: () => void
}

export function ProfileCard({
  match,
  index,
  subscribed,
  isFavorite,
  onView,
  onToggleFavorite,
  onSubscribe,
}: ProfileCardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.03 }}
        onClick={onView}
        className="group cursor-pointer h-full flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-600/20 hover:-translate-y-1"
        role="article"
        aria-label={`Profile card for ${match.name}, ${match.age} years old`}
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-800">
          {subscribed ? (
            <>
              <Image
                src={match.photos[0] || '/placeholder.png'}
                alt={`${match.name}'s profile picture`}
                fill
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < 4}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-black flex items-center justify-center">
              <div className="text-center space-y-2 p-4">
                <div className="text-3xl sm:text-4xl">🔒</div>
                <p className="text-slate-400 font-bold text-[10px] sm:text-xs">PHOTOS LOCKED</p>
              </div>
            </div>
          )}

          {/* Report Action */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsReportOpen(true)
            }}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-red-600/80 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Report profile"
          >
            <AlertTriangle className="w-3 h-3 text-white" />
          </button>

          {/* Unlock Overlay */}
          {!subscribed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSubscribe()
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm hover:bg-black/40 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Unlock photos"
            >
              <div className="text-center">
                <p className="text-amber-400 font-black text-xs sm:text-sm mb-1 sm:mb-2">
                  UNLOCK PHOTOS
                </p>
                <span className="text-[10px] sm:text-xs text-amber-300 font-bold">
                  TAP TO SUBSCRIBE
                </span>
              </div>
            </button>
          )}

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1.5 sm:gap-2">
            {match.verified && (
              <span
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-1"
                role="status"
                aria-label="Verified profile"
              >
                <Shield className="w-3 h-3" />
                <span className="hidden sm:inline">VERIFIED</span>
              </span>
            )}
            {match.online && (
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"
                role="status"
                aria-label="Online now"
              />
            )}
          </div>

          {/* Liked Badge */}
          {match.likedYou && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <span className="text-base sm:text-lg animate-bounce">❤️</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <h3 className="text-base sm:text-xl font-black text-white truncate">{match.name}</h3>
              <span className="text-sm sm:text-lg font-bold text-slate-300">{match.age}</span>
            </div>
            <p className="text-amber-400 font-black text-sm sm:text-lg mb-0.5">
              ${match.rate}
              <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/hr</span>
            </p>
            <p className="text-slate-400 text-[10px] sm:text-xs font-light flex items-center gap-1 mb-2 sm:mb-3">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{match.city}</span>
              <span>•</span>
              <span>{match.distance}km</span>
            </p>

            {/* Interests */}
            <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-2 sm:mb-3">
              {match.interests.slice(0, 2).map((interest, i) => (
                <span
                  key={i}
                  className="bg-slate-800 text-slate-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full border border-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Stats & CTA */}
          <div className="space-y-2 pt-2 sm:pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" />
                <span className="font-semibold">{match.reviews}</span>
              </div>
              <span className="text-green-400 font-bold">{match.compatibility}%</span>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onView()
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg sm:rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 text-xs sm:text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              VIEW PROFILE
            </motion.button>
          </div>
        </div>
      </motion.div>
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetUserId={match.id}
      />
    </>
  )
}
