'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'

type Language = 'en' | 'es' | 'de' | 'fr' | 'pt'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.discover': 'Discover',
    'nav.messages': 'Messages',
    'nav.explore': 'Explore',
    'nav.saved': 'Saved',
    'nav.profile': 'Profile',
    'header.title': 'FIND YOUR KING',
  },
  es: {
    'nav.discover': 'Descubrir',
    'nav.messages': 'Mensajes',
    'nav.explore': 'Explorar',
    'nav.saved': 'Guardado',
    'nav.profile': 'Perfil',
    'header.title': 'ENCUENTRA TU REY',
  },
  // Add other languages as needed
  de: {},
  fr: {},
  pt: {},
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string) => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
