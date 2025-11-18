'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mic, Square, Volume2, Loader2, Send, AlertCircle, Sparkles } from 'lucide-react'
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
    setIsRecording(!isRecording)
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/scenarios"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Sair do Cenário</span>
            </Link>
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-semibold">{scenario.title}</h1>
                <p className="text-xs text-muted-foreground">
                  Praticando com {scenario.character}
                </p>
              </div>
              <Badge variant="outline">{scenario.language}</Badge>
              {userCredits !== null && (
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium">{userCredits} créditos</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {!conversationStarted && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Pronto para começar?</h2>
                <p className="text-muted-foreground mb-4">
                  Esta conversa custará 1 crédito. Você terá uma sessão completa para praticar {scenario.language}.
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={startConversation}
                disabled={isLoading || userCredits === 0}
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
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border/40'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-semibold">
                            {scenario.character[0]}
                          </span>
                        </div>
                        <span className="text-xs font-medium">{scenario.character}</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                        <Volume2 className="h-3 w-3 inline mr-1" />
                        Ouvir
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border/40 rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border/40 pt-4">
              <div className="flex gap-2 items-end">
                <Button
                  size="icon"
                  variant={isRecording ? 'destructive' : 'outline'}
                  className="shrink-0"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Digite sua resposta em ${scenario.language}...`}
                    className="min-h-[60px] max-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Pressione Enter para enviar, Shift+Enter para nova linha
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
