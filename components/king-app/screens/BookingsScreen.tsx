'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Calendar, CalendarDays, Check, Clock, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function BookingsScreen() {
  const vibrate = useVibrate()
  const { bookings, setStage, updateBooking } = useAppStore()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleCancel = async (id: string) => {
    vibrate([50, 20])
    if (!confirm('Are you sure you want to cancel this booking?')) return

    setIsProcessing(id)
    try {
      const { error } = await (supabase.from('bookings') as any)
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error
      updateBooking(id, { status: 'cancelled' })
    } catch (err) {
      console.error(err)
      alert('Failed to cancel booking.')
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Bookings</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your upcoming and past appointments
        </p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 dark:bg-green-900'
                      : booking.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-red-100 dark:bg-red-900'
                  }`}
                >
                  <Calendar
                    className={`w-5 h-5 ${
                      booking.status === 'confirmed'
                        ? 'text-green-600 dark:text-green-400'
                        : booking.status === 'pending'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Booking #{booking.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CalendarDays className="w-4 h-4" />
                <span>Date: {new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Time: {booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-4 h-4" />
                <span>Status: {booking.status}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Duration: {booking.hours}h</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Rescheduling features coming soon!')}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold text-sm hover:bg-slate-700 transition border border-slate-700"
              >
                RESCHEDULE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing === booking.id || booking.status === 'cancelled'}
                onClick={() => handleCancel(booking.id)}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-bold text-sm hover:bg-red-600/30 transition border border-red-600/30 disabled:opacity-50"
              >
                {isProcessing === booking.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'CANCEL'
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
