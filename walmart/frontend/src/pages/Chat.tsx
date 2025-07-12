import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/types'
import axios from 'axios'

// Mock chat history
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content: "Hello! I'm MarginIQ, your AI assistant for margin analysis. I can help you understand margin trends, identify at-risk products, and suggest improvements. What would you like to know?",
    timestamp: new Date().toISOString(),
  }
]

// Mock quick questions
const quickQuestions = [
  "Which top 10 items lost margin this month?",
  "What categories are most affected by tariffs?",
  "Why are beverage margins falling in Florida?",
  "Show me products with negative margins",
  "What's the impact of recent tariff changes?",
  "Which suppliers have the highest cost increases?"
]

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const res = await axios.post('/api/chat/message', { message: userMessage.content })
      if (res.data && res.data.success && res.data.data) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: res.data.data.content,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        setError('AI assistant did not return a valid response.')
      }
    } catch (err) {
      setError('Failed to connect to AI assistant. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">AI Chat Assistant</h1>
        <p className="text-muted-foreground">Ask questions about margins, products, and get AI-powered insights</p>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-500" />
                MarginIQ Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex justify-start">
                    <div className="bg-red-100 text-red-800 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about margins, products, or trends..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Questions Sidebar */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  <div className="text-sm">{question}</div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Ask about margin trends and analysis</span>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                <span>Identify at-risk products and categories</span>
              </div>
              <div className="flex items-start space-x-2">
                <DollarSign className="h-4 w-4 mt-0.5 text-blue-500" />
                <span>Get pricing and supplier recommendations</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 