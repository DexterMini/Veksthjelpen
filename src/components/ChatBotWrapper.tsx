'use client'

import { useRouter } from 'next/navigation'
import ChatBot from './ChatBot'

export default function ChatBotWrapper() {
  const router = useRouter()

  return (
    <ChatBot 
      userProfile={{
        preferredLanguage: 'no'
      }}
      onNavigate={(route) => {
        router.push(route)
      }}
    />
  )
}