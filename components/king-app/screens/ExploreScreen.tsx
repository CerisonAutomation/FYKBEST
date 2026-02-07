'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import type { Match } from '@/types/app'
import { motion } from 'framer-motion'
import { MapPin, MessageCircle } from 'lucide-react'

export function ExploreScreen() {
  const vibrate = useVibrate()
  const { matches, setSelectedMatch, setStage, setCurrentPhotoIndex } = useAppStore()

  const handleViewProfile = (match: Match) => {
    vibrate([25, 12])
    setSelectedMatch(match)
    setCurrentPhotoIndex(0)
    setStage('detail')
  }

  const handleLocationSort = () => {
    vibrate([20, 10])
    // Simulate getting location and sorting
    // In a real app with Geo coords, we'd recalc distance.
    // Here we just re-order matches to show "nearest" first (mock shuffle or sort)
    const _sorted = [...matches].sort(
      (a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
    )
    // Updating store matches might jitter UI, so let's just show a toast or feedback
    alert('Location updated: Showing nearest members.')
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">EXPLORE</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-light tracking-wide">
            NEARBY MEMBERS • LIVE MAP
          </p>
        </div>
        <motion.button
          onClick={handleLocationSort}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-600/50 transition flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          LOCATION
        </motion.button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {matches.slice(0, 16).map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => handleViewProfile(match)}
            className="group cursor-pointer h-full flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-600/20 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-800">
              <img
                src={match.photos[0]}
                alt={match.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Distance Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {match.distance}km
              </div>

              {/* Online Status */}
              {match.online && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <h3 className="text-base sm:text-xl font-black text-white truncate">
                    {match.name}
                  </h3>
                  <span className="text-sm sm:text-lg font-bold text-slate-300">{match.age}</span>
                </div>
                <p className="text-amber-400 font-black text-sm sm:text-lg mb-0.5">
                  ${match.rate}
                  <span className="text-[10px] sm:text-xs text-slate-400 font-normal">/hr</span>
                </p>
                <p className="text-slate-400 text-xs font-light mb-2 sm:mb-3">{match.city}</p>
                <p className="text-slate-300 text-xs leading-relaxed font-light line-clamp-2 mb-2 sm:mb-3">
                  {match.bio}
                </p>
              </div>

              {/* CTA */}
              <div className="space-y-2 pt-2 sm:pt-3 border-t border-slate-800">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProfile(match)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg sm:rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-amber-600/20 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  VIEW & MESSAGE
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
