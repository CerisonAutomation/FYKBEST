'use client'

import { MapPin } from 'lucide-react'
import Image from 'next/image'

export function PartyCard({ party, onClick }: { party: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-amber-600/50 transition-colors group"
      role="article"
      aria-label={`Party card for ${party.title}`}
    >
      <div className="h-32 bg-slate-800 relative overflow-hidden">
        <Image
          src={party.image}
          alt={party.title}
          fill
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white border border-white/10">
          {party.date}
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-amber-400 font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-amber-500/20">
            {party.type?.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white mb-1 truncate">{party.title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <MapPin className="w-3 h-3" />
          {party.location}
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <div className="flex -space-x-2" aria-label="Attendees">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-900"
              />
            ))}
          </div>
          <span className="text-xs text-amber-500 font-semibold">{party.attendees} attending</span>
        </div>
      </div>
    </div>
  )
}
