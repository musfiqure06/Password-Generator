import { useState } from 'react'
import { Copy, Check, RefreshCw, AlertTriangle, Sparkles, Zap } from 'lucide-react'
import type { PersonalInfo } from '../App'

export function PersonalAI() {
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'direct' | 'obfuscated'>('obfuscated')
  const [isGenerating, setIsGenerating] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    nickname: '',
    birthYear: '',
    favoriteWord: '',
    favoriteNumber: '',
    specialDate: ''
  })

  const generatePersonalPassword = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const { fullName, nickname, birthYear, favoriteWord, favoriteNumber, specialDate } = personalInfo
      
      if (!fullName && !nickname && !favoriteWord) {
        setPassword('Please enter at least some personal information')
        setIsGenerating(false)
        return
      }

      let baseString = ''
      const components = []
      
      if (nickname) components.push(nickname)
      else if (fullName) components.push(fullName.split(' ')[0])
      
      if (favoriteWord) components.push(favoriteWord)
      if (favoriteNumber) components.push(favoriteNumber)
      if (specialDate) components.push(specialDate.replace(/[-/]/g, ''))
      if (birthYear) components.push(birthYear.slice(-2))

      if (mode === 'direct') {
        // Direct mix mode
        baseString = components.join('')
        
        // Add random capitalization
        let result = ''
        for (let i = 0; i < baseString.length; i++) {
          if (Math.random() > 0.5) {
            result += baseString[i].toUpperCase()
          } else {
            result += baseString[i].toLowerCase()
          }
        }
        
        // Add random symbols
        const symbols = '!@#$%^&*'
        const numSymbols = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < numSymbols; i++) {
          const pos = Math.floor(Math.random() * (result.length + 1))
          result = result.slice(0, pos) + symbols[Math.floor(Math.random() * symbols.length)] + result.slice(pos)
        }
        
        // Add random numbers
        const numNumbers = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < numNumbers; i++) {
          const pos = Math.floor(Math.random() * (result.length + 1))
          result = result.slice(0, pos) + Math.floor(Math.random() * 10) + result.slice(pos)
        }
        
        setPassword(result)
      } else {
        // Obfuscated secure mode
        baseString = components.join('').toLowerCase()
        
        // Character substitution
        const substitutions: { [key: string]: string } = {
          'a': '@', 'e': '3', 'i': '!', 'o': '0', 's': '$', 't': '7',
          'l': '1', 'g': '9', 'b': '8', 'z': '2'
        }
        
        let result = ''
        for (let char of baseString) {
          if (Math.random() > 0.6 && substitutions[char]) {
            result += substitutions[char]
          } else if (Math.random() > 0.7) {
            result += char.toUpperCase()
          } else {
            result += char
          }
        }
        
        // Reverse parts of the string
        const parts = result.split('')
        for (let i = 0; i < parts.length / 2; i++) {
          if (Math.random() > 0.5) {
            const temp = parts[i]
            parts[i] = parts[parts.length - 1 - i]
            parts[parts.length - 1 - i] = temp
          }
        }
        
        result = parts.join('')
        
        // Add random symbols and numbers
        const allChars = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789'
        const extraChars = Math.floor(Math.random() * 4) + 2
        for (let i = 0; i < extraChars; i++) {
          const pos = Math.floor(Math.random() * (result.length + 1))
          result = result.slice(0, pos) + allChars[Math.floor(Math.random() * allChars.length)] + result.slice(pos)
        }
        
        setPassword(result)
        
        // Emit event for history tracking
        if (!result.includes('Please enter')) {
          window.dispatchEvent(new CustomEvent('passwordGenerated', {
            detail: { password: result, type: 'personal' }
          }))
        }
      }
      
      setIsGenerating(false)
    }, 500)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-xl">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-300">
            <p className="font-semibold mb-1">Security Notice</p>
            <p>Using personal information may reduce security. These passwords are memorable but potentially vulnerable to targeted attacks.</p>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Generation Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('direct')}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              mode === 'direct'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Direct Mix</span>
          </button>
          <button
            onClick={() => setMode('obfuscated')}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              mode === 'obfuscated'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Obfuscated</span>
            <span className="text-xs text-green-400 block">Recommended</span>
          </button>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nickname</label>
            <input
              type="text"
              value={personalInfo.nickname}
              onChange={(e) => setPersonalInfo({ ...personalInfo, nickname: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              placeholder="Johnny"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Birth Year</label>
            <input
              type="text"
              value={personalInfo.birthYear}
              onChange={(e) => setPersonalInfo({ ...personalInfo, birthYear: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              placeholder="1990"
              maxLength={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Favorite Word</label>
            <input
              type="text"
              value={personalInfo.favoriteWord}
              onChange={(e) => setPersonalInfo({ ...personalInfo, favoriteWord: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              placeholder="Adventure"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Favorite Number</label>
            <input
              type="text"
              value={personalInfo.favoriteNumber}
              onChange={(e) => setPersonalInfo({ ...personalInfo, favoriteNumber: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              placeholder="42"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Special Date (Optional)</label>
            <input
              type="text"
              value={personalInfo.specialDate}
              onChange={(e) => setPersonalInfo({ ...personalInfo, specialDate: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              placeholder="12-25 or 2024-12-25"
            />
          </div>
        </div>
      </div>

      {/* Generated Password */}
      {password && (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-400">Generated Password</label>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="font-mono text-lg p-4 bg-black/50 rounded-lg border border-gray-800/50">
            <span className="text-cyan-400">{password}</span>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generatePersonalPassword}
        disabled={isGenerating}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
      >
        <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Generating...' : 'Generate Personal Password'}</span>
      </button>
    </div>
  )
}