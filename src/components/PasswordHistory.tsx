import { useState, useEffect } from 'react'
import { History, Trash2, Copy, Check } from 'lucide-react'

interface HistoryItem {
  password: string
  timestamp: number
  type: 'generator' | 'personal' | 'passphrase'
}

export function PasswordHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem('passwordHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }

    // Listen for custom events when passwords are generated
    const handlePasswordGenerated = (event: CustomEvent) => {
      const { password, type } = event.detail
      addToHistory(password, type)
    }

    window.addEventListener('passwordGenerated', handlePasswordGenerated as EventListener)
    return () => {
      window.removeEventListener('passwordGenerated', handlePasswordGenerated as EventListener)
    }
  }, [])

  const addToHistory = (password: string, type: 'generator' | 'personal' | 'passphrase') => {
    if (!password || password.includes('Select at least one') || password.includes('Please enter')) {
      return
    }

    const newItem: HistoryItem = {
      password,
      timestamp: Date.now(),
      type
    }

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 5) // Keep only last 5
      localStorage.setItem('passwordHistory', JSON.stringify(updated))
      return updated
    })
  }

  const copyToClipboard = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(password)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('passwordHistory')
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return date.toLocaleDateString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personal': return '🎭'
      case 'passphrase': return '🔑'
      default: return '🔐'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'text-purple-400'
      case 'passphrase': return 'text-green-400'
      default: return 'text-cyan-400'
    }
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
          >
            <History className="w-4 h-4" />
            <span className="font-medium">Password History</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
              {history.length}
            </span>
          </button>
          
          {showHistory && (
            <button
              onClick={clearHistory}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showHistory && (
          <div className="p-4 space-y-2">
            {history.map((item, index) => (
              <div
                key={item.timestamp}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-300"
                style={{
                  animation: index === 0 ? 'slideIn 0.3s ease-out' : undefined
                }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className={getTypeColor(item.type)}>
                    {getTypeIcon(item.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-gray-300 truncate">
                      {item.type === 'passphrase' ? item.password : item.password.slice(0, 20)}
                      {item.type !== 'passphrase' && item.password.length > 20 && '...'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(item.password)}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-300 ml-2"
                >
                  {copied === item.password ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}