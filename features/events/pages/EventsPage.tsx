'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  LayoutGrid,
  List,
  Lock,
  Map as MapIcon,
  MapPin,
  Plus,
  Shield,
} from 'lucide-react'
import React, { useState } from 'react'
import { useEvents } from '../hooks/useEvents'

export function EventsPage() {
  const [tab, setTab] = useState<'plan' | 'party'>('plan')
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid')
  const { data, isLoading } = useEvents(tab)
  const vibrate = useVibrate()
  const { setStage } = useAppStore()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter italic">
            EVENTS
          </h2>
          <div className="flex gap-4 border-b border-slate-800">
            <button
              onClick={() => {
                vibrate([10])
                setTab('plan')
              }}
              className={`pb-2 text-sm font-black transition-all relative ${tab === 'plan' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              PLANS
              {tab === 'plan' && (
                <motion.div
                  layoutId="tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                />
              )}
            </button>
            <button
              onClick={() => {
                vibrate([10])
                setTab('party')
              }}
              className={`pb-2 text-sm font-black transition-all relative ${tab === 'party' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              PARTIES
              {tab === 'party' && (
                <motion.div
                  layoutId="tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'grid', icon: LayoutGrid },
              { id: 'list', icon: List },
              { id: 'map', icon: MapIcon },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  vibrate([5])
                  setView(v.id as any)
                }}
                className={`p-2 rounded-lg transition-all ${view === v.id ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <v.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <motion.button
            onClick={() => {
              vibrate([20, 10])
              setStage('create-party')
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black rounded-xl shadow-lg shadow-amber-900/20 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> HOST {tab.toUpperCase()}
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${tab}-${view}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={
            view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
          }
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"
                />
              ))
            : data?.pages
                .flat()
                .map((event) => <EventItem key={event.id} event={event} view={view} />)}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function EventItem({ event, view }: { event: any; view: string }) {
  const vibrate = useVibrate()
  const { setSelectedParty, setStage } = useAppStore()

  if (view === 'list') {
    return (
      <div
        onClick={() => {
          vibrate([10])
          setSelectedParty(event)
          setStage('event-detail')
        }}
        className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-amber-600/30 transition-colors cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={event.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt=""
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate uppercase tracking-tight">{event.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-500 uppercase">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {event.location}
            </span>
          </div>
        </div>
        <button className="px-4 py-2 bg-slate-800 text-amber-500 rounded-lg text-xs font-black group-hover:bg-amber-600 group-hover:text-white transition-all">
          VIEW
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => {
        vibrate([10])
        setSelectedParty(event)
        setStage('event-detail')
      }}
      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-amber-600/50 transition-all duration-500 group flex flex-col"
    >
      <div className="h-40 bg-slate-800 relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          {event.quiet_mode && (
            <div className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> QUIET
            </div>
          )}
          <div className="bg-amber-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
            {event.type}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-black text-white text-lg leading-tight uppercase truncate">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> {event.date} @ {event.time}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2 font-light leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black">
              ?
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
              {event.attendees} GUESTS
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 italic">
            {event.addressPrecise ? <Shield className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {event.addressPrecise ? 'LOCATION REVEALED' : event.location}
          </div>
        </div>
      </div>
    </div>
  )
}
