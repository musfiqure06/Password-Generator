import { useState, useEffect } from 'react'
import { Shield, Key, Moon, Sun, Info, X, Lock, Sparkles } from 'lucide-react'
import { PasswordGenerator } from './components/PasswordGenerator'
import { PersonalAI } from './components/PersonalAI'
import { PassphraseGenerator } from './components/PassphraseGenerator'
import { PasswordHistory } from './components/PasswordHistory'
import { SplashScreen } from './components/SplashScreen'

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
}

export interface PersonalInfo {
  fullName: string
  nickname: string
  birthYear: string
  favoriteWord: string
  favoriteNumber: string
  specialDate: string
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState<'generator' | 'personal' | 'passphrase'>('generator')
  const [showAbout, setShowAbout] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    }
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'public')
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 animate-pulse" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-500/10 text-xs font-mono animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 backdrop-blur-xl bg-black/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
                <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-lg animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CyberKey
                </h1>
                <p className="text-xs text-gray-400">by Md Musfiqure Rahman</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAbout(true)}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-1">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-2 rounded-md transition-all duration-300 font-medium ${
                activeTab === 'generator'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Generator
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-2 rounded-md transition-all duration-300 font-medium ${
                activeTab === 'personal'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Personal AI
            </button>
            <button
              onClick={() => setActiveTab('passphrase')}
              className={`px-6 py-2 rounded-md transition-all duration-300 font-medium ${
                activeTab === 'passphrase'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Passphrase
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'generator' && <PasswordGenerator />}
          {activeTab === 'personal' && <PersonalAI />}
          {activeTab === 'passphrase' && <PassphraseGenerator />}
        </div>

        {/* Password History */}
        <PasswordHistory />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 backdrop-blur-xl bg-black/40 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Crafted with{' '}
              <span className="text-red-500 animate-pulse">♥</span>{' '}
              by{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                Md Musfiqure Rahman
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">© 2026 CyberKey - Advanced Password Security</p>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-cyan-500/20 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                About CyberKey
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                CyberKey is an advanced password generation tool designed with security and usability in mind.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h3 className="font-semibold text-cyan-400 mb-2">Developer</h3>
                <p className="text-sm">Md Musfiqure Rahman</p>
                <p className="text-xs text-gray-500 mt-1">Full Stack Developer & Security Enthusiast</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h3 className="font-semibold text-cyan-400 mb-2">Features</h3>
                <ul className="text-sm space-y-1">
                  <li>• Cryptographically secure generation</li>
                  <li>• Advanced strength analysis</li>
                  <li>• Personal AI password mode</li>
                  <li>• Passphrase generator</li>
                  <li>• Password history tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corner Watermark */}
      <div className="fixed bottom-4 right-4 z-20 opacity-20 pointer-events-none">
        <div className="text-xs font-mono text-cyan-400 transform rotate-45 origin-center">
          Md Musfiqure Rahman
        </div>
      </div>
    </div>
  )
}

export default App