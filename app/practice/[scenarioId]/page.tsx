'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mic, Square, Volume2, Loader2, Send, AlertCircle, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useParams, useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

const scenarioData: Record<string, any> = {
  'coffee-paris': {
    title: 'Café em Paris',
    language: 'Francês',
    character: 'Marie',
    characterRole: 'Barista',
    systemPrompt: `You are Marie, a friendly French barista at a charming Parisian café. You speak French but can understand Portuguese. Your role is to help a Brazilian student practice ordering coffee in French. Be encouraging, correct mistakes gently, and provide translations when needed. Keep responses natural and conversational. If the student makes a mistake, kindly correct it and explain. Start by greeting the customer warmly in French.`,
  },
  'job-interview': {
    title: 'Entrevista de Emprego',
    language: 'Inglês',
    character: 'James',
    characterRole: 'Recrutador',
    systemPrompt: `You are James, a professional recruiter conducting a job interview in English. You are interviewing a Brazilian candidate for a software developer position. Be professional but friendly. Ask typical interview questions, and provide feedback on the candidate's English and answers. Keep responses concise and realistic. Start by introducing yourself and the company.`,
  },
  'hotel-checkin': {
    title: 'Check-in no Hotel',
    language: 'Espanhol',
    character: 'Carlos',
    characterRole: 'Recepcionista',
    systemPrompt: `You are Carlos, a helpful hotel receptionist in Spain. You speak Spanish but understand Portuguese. Help a Brazilian guest check in to the hotel. Be polite and professional. Correct mistakes gently and provide translations when needed. Start by greeting the guest warmly in Spanish.`,
  },
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params?.scenarioId as string
  const scenario = scenarioData[scenarioId]

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
        
        const languageMap: Record<string, string> = {
          'Francês': 'fr-FR',
          'Inglês': 'en-US',
          'Espanhol': 'es-ES',
        }
        recognition.lang = languageMap[scenario?.language] || 'en-US'
        recognition.continuous = false
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput((prev) => prev + (prev ? ' ' : '') + transcript)
          setIsRecording(false)
        }

        recognition.onerror = (event: any) => {
          console.error('[v0] Speech recognition error:', event.error)
          setIsRecording(false)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [scenario])

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
          messages: [{ role: 'system', content: scenario.systemPrompt }],
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = [
        { role: 'system', content: scenario.systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: input },
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
      console.error('Error sending message:', error)
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

  if (!scenario) {
    return <div>Cenário não encontrado</div>
  }

  if (creditError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você não tem créditos suficientes para iniciar esta conversa.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Compre mais créditos para continuar praticando!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/buy-credits">
                <Button size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Comprar Créditos
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="outline" size="lg">
                  Voltar aos Cenários
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <header className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-10">
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
                {scenario.character} • {scenario.language}
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
                  Esta conversa custará 1 crédito. Você terá uma sessão completa para praticar {scenario.language}.
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
              className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 space-y-3 bg-zinc-900"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-lg shadow-md ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1 border-b border-zinc-700/50">
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
                      <div className="flex items-center justify-between mt-1">
                        <button
                          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(message.content)
                            utterance.lang =
                              scenario.language === 'Francês'
                                ? 'fr-FR'
                                : scenario.language === 'Espanhol'
                                  ? 'es-ES'
                                  : 'en-US'
                            speechSynthesis.speak(utterance)
                          }}
                        >
                          <Volume2 className="h-3 w-3" />
                          Ouvir
                        </button>
                        <span className="text-[10px] text-zinc-500">
                          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-lg rounded-bl-none px-4 py-3 shadow-md">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="bg-zinc-800 border-t border-zinc-700 px-3 py-3 sm:px-4 sm:py-4">
              {isRecording && (
                <div className="mb-3 bg-zinc-900 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm text-red-400 font-medium">Gravando áudio...</span>
                  </div>
                  <button
                    onClick={toggleRecording}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              
              <div className="flex gap-2 items-end">
                <div className="flex-1 bg-zinc-900 rounded-full px-4 py-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Mensagem em ${scenario.language}...`}
                    className="flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 outline-none"
                    disabled={isLoading || isRecording}
                  />
                  
                  {speechSupported && !input.trim() && (
                    <button
                      onClick={toggleRecording}
                      disabled={isLoading}
                      className={`flex-shrink-0 transition-colors ${
                        isRecording 
                          ? 'text-red-500' 
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <Button
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
