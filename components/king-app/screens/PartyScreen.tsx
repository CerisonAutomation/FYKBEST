'use client'

import { useAuth } from '@/lib/auth/hooks'
import { useAppStore } from '@/lib/store'
import { useParties } from '@/lib/supabase/useParties' // New hook
import { motion } from 'framer-motion'
import { Coffee, Dumbbell, Film, Plus, Users, Utensils, Wine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PartyCard } from '../components/PartyCard'

// ... (EVENT_TYPES and EventTypeIcon remain same)
const EVENT_TYPES = [
  { id: 'gym', icon: <Dumbbell className="w-5 h-5" />, label: 'Gym' },
  { id: 'cinema', icon: <Film className="w-5 h-5" />, label: 'Cinema' },
  { id: 'meetup', icon: <Users className="w-5 h-5" />, label: 'Meetup' },
  { id: 'drinks', icon: <Wine className="w-5 h-5" />, label: 'Drinks' },
  { id: 'food', icon: <Utensils className="w-5 h-5" />, label: 'Food' },
  { id: 'coffee', icon: <Coffee className="w-5 h-5" />, label: 'Coffee' },
]

interface EventTypeIconProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function EventTypeIcon({ icon, label, active, onClick }: EventTypeIconProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all min-w-[72px]
        ${
          active
            ? 'bg-amber-900/20 border border-amber-600/50 text-amber-500'
            : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-900'
        }
      `}
    >
      <div
        className={`
        w-10 h-10 rounded-xl flex items-center justify-center
        ${active ? 'bg-amber-600/20' : 'bg-slate-800'}
      `}
      >
        {icon}
      </div>
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  )
}

export function PartyScreen() {
  const { setStage, parties, setSelectedParty } = useAppStore() // Use parties from store
  useParties() // Invoke hook to fetch real data

  const [_tab, _setTab] = useState<'discover' | 'attending' | 'hosting'>('discover')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleViewEvent = (party: any) => {
    setSelectedParty(party)
    setStage('event-detail')
  }

  const displayParties = parties.filter((p) => {
    if (selectedType && p.type !== selectedType) return false
    return true // Add tab filtering logic here if needed
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-black min-h-screen"
    >
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-black text-white italic tracking-tighter">EVENTS & CHILL</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStage('create-party')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg text-xs font-bold text-white shadow-lg shadow-amber-900/20"
            >
              <Plus className="w-4 h-4" />
              HOST
            </button>
          </div>
        </div>
        {/* ... Tab buttons ... */}
      </header>

      {/* ... Filter icons ... */}
      <div className="overflow-x-auto scrollbar-hide px-4 py-4 border-b border-slate-900/50">
        <div className="flex gap-2 w-max">
          {EVENT_TYPES.map((type) => (
            <EventTypeIcon
              key={type.id}
              icon={type.icon}
              label={type.label}
              active={selectedType === type.id}
              onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
            />
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 pb-24">
        {displayParties.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            No events found. Be the first to host!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayParties.map((party, i) => (
              <motion.div
                key={party.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <PartyCard party={party} onClick={() => handleViewEvent(party)} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  )
}
