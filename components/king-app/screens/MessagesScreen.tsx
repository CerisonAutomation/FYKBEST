'use client'

import { useScrollToBottom, useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import type { Message } from '@/types/app'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, MessageCircle, Search, Send, X, Zap } from 'lucide-react'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'

const quickReplySuggestions = [
  'That sounds great!',
  "I'd love to meet you",
  'When are you available?',
  'Let me know more details',
]

// Debounced AI suggestions to prevent performance issues
const useDebouncedSuggestions = (messages: Message[], isAiEnabled: boolean) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()

  const fetchSuggestions = useCallback(async () => {
    if (!isAiEnabled || messages.length === 0) {
      setSuggestions([])
      return
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.from === 'user') {
      setSuggestions([])
      return
    }

    // Simulate AI API call with proper error handling
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Generate contextual suggestions based on last message
      const contextualSuggestions = quickReplySuggestions
        .filter(suggestion =>
          lastMessage.text.toLowerCase().includes('hello') && suggestion.toLowerCase().includes('hello') ||
          lastMessage.text.toLowerCase().includes('meet') && suggestion.toLowerCase().includes('meet')
        )
        .slice(0, 3)

      setSuggestions(contextualSuggestions)
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error)
      setSuggestions(quickReplySuggestions.slice(0, 2)) // Fallback
    }
  }, [isAiEnabled, messages.length])

  // Debounced fetch with cleanup
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions()
    }, 1000) // 1 second debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [fetchSuggestions])

  return { suggestions, fetchSuggestions }
}

export function MessagesScreen() {
  const vibrate = useVibrate()
  const {
    matches,
    chatMessages,
    addMessage,
    activeChat,
    setActiveChat,
    searchQuery,
    setSearchQuery,
    typingUsers,
    unreadCounts,
    setUnreadCount,
    isAiEnabled,
    user,
  } = useAppStore()

  const [inputValue, setInputValue] = useState('')
  const [isClient, setIsClient] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const chatContainerRef = useScrollToBottom(chatMessages[`chat_${activeChat}`])

  // Use optimized AI suggestions with debouncing
  const { suggestions, fetchSuggestions } = useDebouncedSuggestions(chatMessages[`chat_${activeChat}`] || [], isAiEnabled)

  useEffect(() => {
    if (!isClient || !activeChat) return
    fetchSuggestions()
  }, [isClient, activeChat, chatMessages[`chat_${activeChat}`], isAiEnabled])

  // Real-time Message Sending
  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputValue
    if (!text.trim() || !activeChat || !user) return

    const chatKey = `chat_${activeChat}`

    // 1. Optimistic Update
    const tempId = Date.now().toString()
    const optimisticMessage: Message = {
      id: tempId,
      text: text,
      from: 'user',
      timestamp: new Date(),
      read: false,
      status: 'sending',
      senderId: user.id,
    }

    addMessage(chatKey, optimisticMessage)
    if (!textOverride) setInputValue('')
    vibrate([20, 10])

    try {
      // 2. Database Insert
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        conversation_id: activeChat,
        content: text,
        message_type: 'text',
      } as any)

      if (error) throw error
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleQuickReply = (reply: string) => {
    vibrate([20, 10])
    handleSendMessage(reply)
  }

  // Sort conversations by last message
  const conversations = matches
    .filter((m) => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return (chatMessages[`chat_${m.id}`]?.length || 0) > 0
    })
    .sort((a, b) => {
      const lastA = chatMessages[`chat_${a.id}`]?.slice(-1)[0]?.timestamp?.getTime() || 0
      const lastB = chatMessages[`chat_${b.id}`]?.slice(-1)[0]?.timestamp?.getTime() || 0
      return lastB - lastA
    })

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">MESSAGES</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-light tracking-wide">
            REAL-TIME CONVERSATIONS
          </p>
        </div>
        {isAiEnabled && (
          <div className="px-4 py-2 bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/40 rounded-full flex items-center gap-2 shadow-lg shadow-amber-600/20">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400">AI ASSISTANT ACTIVE</span>
          </div>
        )}
      </div>

      {/* Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-350px)] sm:h-[600px]">
        {/* Conversations List */}
        <div
          className={`lg:col-span-1 bg-slate-900/30 border border-slate-800 rounded-xl sm:rounded-2xl flex flex-col overflow-hidden ${activeChat ? 'hidden lg:flex' : 'flex'}`}
        >
          <div className="p-3 sm:p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-slate-950/50">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full"
              />
            </div>
            <p className="text-xs font-black text-amber-500 tracking-wider">CONVERSATIONS</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-3">
            {conversations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <MessageCircle className="w-12 h-12 text-slate-700" />
                <p className="text-slate-500 text-sm font-light italic">
                  No conversations yet. Start a chat from a profile!
                </p>
              </div>
            ) : (
              conversations.map((contact) => {
                const unread = unreadCounts[contact.id] || 0
                const isTyping = typingUsers[contact.id]
                const isActive = activeChat === contact.id
                const lastMsg = chatMessages[`chat_${contact.id}`]?.slice(-1)[0]

                return (
                  <motion.button
                    key={contact.id}
                    onClick={() => {
                      vibrate([20, 10])
                      setActiveChat(contact.id)
                      setUnreadCount(contact.id, 0)
                    }}
                    className={`
                        w-full p-3 rounded-xl transition-all duration-300 text-left border
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-600/30 to-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-600/20'
                            : 'bg-slate-800/30 border-slate-700 hover:border-amber-500/30 hover:bg-slate-800/50'
                        }
                      `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-white relative">
                        {contact.name.charAt(0)}
                        {contact.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 bg-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between mb-1">
                          <p
                            className={`text-sm font-black truncate ${isActive ? 'text-amber-300' : 'text-white'}`}
                          >
                            {contact.name}
                          </p>
                          {unread > 0 && (
                            <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                              {unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate italic font-light">
                          {isTyping ? 'Typing...' : lastMsg?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900/70 to-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setActiveChat(null)}
                  className="lg:hidden p-2 hover:bg-slate-800/50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-white">
                  {activeMatch?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-black text-white">{activeMatch?.name || 'User'}</p>
                  <p className="text-xs text-green-400 font-semibold">
                    {activeMatch?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-slate-900/20 to-slate-950/40"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-slate-500">
                  <div className="space-y-3">
                    <div className="text-4xl">💬</div>
                    <p className="text-sm font-light">Start a conversation!</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[85%] px-3 py-2.5 rounded-2xl text-sm font-light
                          ${
                            msg.from === 'user'
                              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-none'
                              : 'bg-slate-800 text-slate-100 rounded-bl-none'
                          }
                        `}
                      >
                        {msg.messageType === 'game' ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400">
                              <Zap className="w-3 h-3" /> Game Challenge
                            </div>
                            <p className="font-bold">{msg.gameData?.question}</p>
                            <div className="grid grid-cols-1 gap-2">
                              {msg.gameData?.options?.map((opt, i) => (
                                <button
                                  key={i}
                                  className="py-2 bg-black/20 hover:bg-black/40 rounded-lg text-xs transition-colors border border-white/5"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-gradient-to-r from-slate-900/70 to-slate-950/70 space-y-3">
              <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide pb-1">
                {[
                  { id: 'truth_or_dare', label: 'Truth or Dare' },
                  { id: 'rate_me', label: 'Rate Me' },
                  { id: 'never_have_i_ever', label: 'Never Have I Ever' },
                ].map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      vibrate([10])
                      handleSendMessage(`I challenged you to ${game.label}!`)
                      // In a real app, you'd send the game object here.
                    }}
                    className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full text-[10px] font-black border border-slate-700 transition-all uppercase tracking-tighter"
                  >
                    {game.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="p-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {isAiEnabled && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                  <div className="flex items-center gap-1.5 mr-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    {isAiLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                    <span>AI Assistant</span>
                  </div>
                  {aiSuggestions.map((reply, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleQuickReply(reply)}
                      className="text-[11px] px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 rounded-full border border-amber-600/30 hover:border-amber-600/50 transition-all font-bold whitespace-nowrap"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl items-center justify-center">
            <p className="text-slate-500">Select a conversation to start</p>
          </div>
        )}
      </div>
    </div>
  )
}
