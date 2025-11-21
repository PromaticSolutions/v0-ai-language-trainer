'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mic, Volume2, Loader2, Send, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

const scenarioData: Record<string, any> = {
  'coffee-shop': {
    title: 'Cafeteria',
    character: 'Alex',
    characterRole: 'Barista',
  },
  'job-interview': {
    title: 'Entrevista de Emprego',
    character: 'Jordan',
    characterRole: 'Recrutador',
  },
  'hotel-checkin': {
    title: 'Check-in no Hotel',
    character: 'Sam',
    characterRole: 'Recepcionista',
  },
  'restaurant': {
    title: 'Restaurante',
    character: 'Taylor',
    characterRole: 'Garçom/Garçonete',
  },
  'doctor-appointment': {
    title: 'Consulta Médica',
    character: 'Dr. Morgan',
    characterRole: 'Médico',
  },
  'business-meeting': {
    title: 'Reunião de Negócios',
    character: 'Chris',
    characterRole: 'Executivo',
  },
}

const languageConfig: Record<string, any> = {
  english: { name: 'Inglês', code: 'en-US', nativeName: 'English' },
  spanish: { name: 'Espanhol', code: 'es-ES', nativeName: 'Español' },
  french: { name: 'Francês', code: 'fr-FR', nativeName: 'Français' },
  german: { name: 'Alemão', code: 'de-DE', nativeName: 'Deutsch' },
  italian: { name: 'Italiano', code: 'it-IT', nativeName: 'Italiano' },
  portuguese: { name: 'Português', code: 'pt-PT', nativeName: 'Português' },
  japanese: { name: 'Japonês', code: 'ja-JP', nativeName: '日本語' },
  mandarin: { name: 'Mandarim', code: 'zh-CN', nativeName: '中文' },
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const scenarioId = params?.scenarioId as string
  const languageId = searchParams?.get('language') || 'english'
  
  const scenario = scenarioData[scenarioId]
  const language = languageConfig[languageId]

  const systemPrompt = `You are ${scenario?.character}, a friendly ${scenario?.characterRole} helping a Brazilian student practice ${language?.nativeName} (${language?.name}).

IMPORTANT INSTRUCTIONS:
- Respond naturally in ${language?.nativeName} to the conversation
- After each of your ${language?.nativeName} responses, add a feedback section in Portuguese starting with "💡 Feedback:"
- In the feedback, comment on: pronunciation hints, grammar corrections if needed, vocabulary suggestions, and encouragement
- Keep feedback brief (2-3 sentences) and positive
- If they make mistakes, correct them gently in the feedback section
- At the end of conversation (if they say goodbye), provide a performance summary in Portuguese

Example response format:
"[Response in ${language?.nativeName}]

💡 Feedback: [Brief feedback in Portuguese about their language use]"`

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [creditError, setCreditError] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch('/api/credits')
        const data = await response.json()
        setUserCredits(data.credits)
      } catch (error) {
        console.error('[v0] Error fetching credits:', error)
      }
    }
    fetchCredits()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        
        recognition.lang = language?.code || 'en-US'
        recognition.continuous = false
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          console.log('[v0] Audio transcribed:', transcript)
          setInput(transcript)
          setTimeout(() => {
            handleSendAfterTranscription(transcript)
          }, 100)
        }

        recognition.onerror = (event: any) => {
          console.error('[v0] Speech recognition error:', event.error)
          setIsRecording(false)
        }

        recognition.onend = () => {
          console.log('[v0] Recording ended')
          setIsRecording(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [scenario, language])

  const handleSendAfterTranscription = async (transcribedText: string) => {
    if (!transcribedText.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: transcribedText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: transcribedText },
      ]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageText = input
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: messageText },
      ]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const startConversation = async () => {
    if (conversationStarted) return
    
    setIsLoading(true)
    try {
      const creditResponse = await fetch('/api/credits/deduct', {
        method: 'POST',
      })
      
      const creditData = await creditResponse.json()
      
      if (!creditData.success) {
        setCreditError(true)
        setIsLoading(false)
        return
      }
      
      setUserCredits(creditData.remainingCredits)
      setConversationStarted(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt }],
        }),
      })

      if (!response.ok) throw new Error('Failed to start conversation')

      const data = await response.json()
      setMessages([
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('[v0] Error starting conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!scenario || !language) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cenário não encontrado</h1>
          <Link href="/scenarios">
            <Button>Voltar aos Cenários</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link
              href="/scenarios"
              className="text-zinc-400 hover:text-zinc-200 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm sm:text-base text-white truncate">{scenario.title}</h1>
              <p className="text-xs text-zinc-400 truncate">
                {scenario.character} • {language.name}
              </p>
            </div>
          </div>
          {userCredits !== null && (
            <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-1.5 flex-shrink-0">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">{userCredits}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {!conversationStarted && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Pronto para começar?</h2>
                <p className="text-sm sm:text-base text-zinc-400 mb-4">
                  Esta conversa custará 1 crédito. Você praticará {language.name} no cenário {scenario.title}.
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={startConversation}
                disabled={isLoading || userCredits === 0}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  'Iniciar Conversa'
                )}
              </Button>
              {userCredits === 0 && (
                <p className="text-sm text-destructive">
                  Você precisa de créditos para começar
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div 
              className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 space-y-3 bg-zinc-950"
              style={{ 
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(39 39 42 / 0.4) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-lg shadow-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-zinc-900 text-zinc-100 rounded-bl-sm'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1 border-b border-zinc-800">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {scenario.character[0]}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-zinc-300">{scenario.character}</span>
                      </div>
                    )}
                    <div className="px-3 py-2">
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 gap-2">
                        {message.role === 'assistant' && (
                          <button
                            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                            onClick={() => {
                              const utterance = new SpeechSynthesisUtterance(message.content)
                              utterance.lang = language.code
                              speechSynthesis.speak(utterance)
                            }}
                          >
                            <Volume2 className="h-3 w-3" />
                            Ouvir
                          </button>
                        )}
                        <span className="text-[10px] text-zinc-500 ml-auto">
                          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 rounded-lg rounded-bl-sm px-4 py-3 shadow-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="bg-zinc-900 border-t border-zinc-800 px-3 py-3 sm:px-4 sm:py-4">
              {isRecording && (
                <div className="mb-3 bg-red-500/10 rounded-xl px-4 py-3 flex items-center gap-3 border border-red-500/20">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm text-red-400 font-medium flex-1">Gravando áudio...</span>
                  <span className="text-xs text-red-400/70">Fale agora</span>
                </div>
              )}
              
              <div className="flex gap-2 items-end">
                <div className="flex-1 bg-zinc-800 rounded-full px-4 py-2.5 flex items-center gap-2 border border-zinc-700">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Mensagem em ${language.name}...`}
                    className="flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 outline-none"
                    disabled={isLoading || isRecording}
                  />
                  
                  {speechSupported && !input.trim() && (
                    <button
                      onClick={toggleRecording}
                      disabled={isLoading}
                      className={`flex-shrink-0 transition-all ${
                        isRecording 
                          ? 'text-red-500 scale-110' 
                          : 'text-primary hover:text-primary/80'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <Button
                  id="send-message-btn"
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || isRecording}
                  className="h-11 w-11 rounded-full flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
