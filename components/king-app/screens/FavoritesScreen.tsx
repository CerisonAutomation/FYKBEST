'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import type { Match } from '@/types/app'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, MapPin, Star, Trash2 } from 'lucide-react'

export function FavoritesScreen() {
  const vibrate = useVibrate()
  const {
    matches,
    favorites,
    toggleFavorite,
    setSelectedMatch,
    setStage,
    setCurrentPhotoIndex,
    subscribed,
  } = useAppStore()

  const favoriteMatches = matches.filter((m) => favorites.includes(m.id))

  const handleViewProfile = (match: Match) => {
    vibrate([25, 12])
    setSelectedMatch(match)
    setCurrentPhotoIndex(0)
    setStage('detail')
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">SAVED</h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-light tracking-wide">
          YOUR FAVORITE PROFILES • {favoriteMatches.length} SAVED
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteMatches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 sm:py-16 bg-slate-900/20 border border-slate-800 rounded-2xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Heart className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-lg sm:text-xl font-light text-slate-400 mb-2">No saved profiles yet</p>
          <p className="text-sm text-slate-600 mb-6">Tap the heart icon on profiles to save them</p>
          <motion.button
            onClick={() => {
              vibrate([20, 10])
              setStage('browse')
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-amber-600/20 text-amber-400 font-bold rounded-xl border border-amber-600/40 hover:bg-amber-600/30 transition"
          >
            DISCOVER PROFILES
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
        >
          <AnimatePresence>
            {favoriteMatches.map((match, index) => (
              <motion.div
                key={match.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleViewProfile(match)}
                className="group cursor-pointer h-full flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-800">
                  {subscribed ? (
                    <>
                      <img
                        src={match.photos[0]}
                        alt={match.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-black flex items-center justify-center">
                      <div className="text-center space-y-2 p-4">
                        <div className="text-3xl sm:text-4xl">🔒</div>
                        <p className="text-slate-400 font-bold text-[10px] sm:text-xs">
                          SUBSCRIBE TO VIEW
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Online Status */}
                  {match.online && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg" />
                  )}

                  {/* Favorite Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xl sm:text-2xl">❤️</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      vibrate([20, 10])
                      toggleFavorite(match.id)
                    }}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-red-600/80 transition group/btn"
                  >
                    <Trash2 className="w-4 h-4 text-white group-hover/btn:text-white" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
                  <div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <h3 className="text-base sm:text-xl font-black text-white truncate">
                        {match.name}
                      </h3>
                      <span className="text-sm sm:text-lg font-bold text-slate-300">
                        {match.age}
                      </span>
                    </div>
                    <p className="text-amber-400 font-black text-sm sm:text-lg mb-0.5">
                      ${match.rate}
                      <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/hr</span>
                    </p>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-light flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{match.city}</span>
                    </p>
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
                        handleViewProfile(match)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg sm:rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/20 text-xs sm:text-sm"
                    >
                      VIEW PROFILE
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
