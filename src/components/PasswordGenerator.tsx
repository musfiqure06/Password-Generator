import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, Eye, EyeOff, RefreshCw, Shield } from 'lucide-react'
import type { PasswordOptions } from '../App'

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false
  })

  const generatePassword = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      let charset = ''
      if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
      if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (options.numbers) charset += '0123456789'
      if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

      if (options.excludeSimilar) {
        charset = charset.replace(/[lI1O0]/g, '')
      }

      if (charset === '') {
        setPassword('Select at least one character type')
        setIsGenerating(false)
        return
      }

      const array = new Uint32Array(options.length)
      crypto.getRandomValues(array)
      let newPassword = ''
      for (let i = 0; i < options.length; i++) {
        newPassword += charset[array[i] % charset.length]
      }

      setPassword(newPassword)
      setIsGenerating(false)
      
      // Emit event for history tracking
      window.dispatchEvent(new CustomEvent('passwordGenerated', {
        detail: { password: newPassword, type: 'generator' }
      }))
    }, 300)
  }, [options])

  useEffect(() => {
    generatePassword()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const calculateStrength = (pwd: string) => {
    if (!pwd || pwd.includes('Select at least one character type')) return { score: 0, label: 'None', color: 'bg-gray-500' }
    
    let score = 0
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    if (pwd.length >= 20) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score: 50, label: 'Medium', color: 'bg-yellow-500' }
    if (score <= 6) return { score: 75, label: 'Strong', color: 'bg-green-500' }
    return { score: 100, label: 'Very Strong', color: 'bg-gradient-to-r from-green-500 to-blue-500' }
  }

  const calculateEntropy = (pwd: string) => {
    let charsetSize = 0
    if (options.lowercase) charsetSize += 26
    if (options.uppercase) charsetSize += 26
    if (options.numbers) charsetSize += 10
    if (options.symbols) charsetSize += 32
    
    if (options.excludeSimilar) charsetSize -= 4
    
    const entropy = Math.log2(Math.pow(charsetSize, pwd.length))
    return Math.round(entropy)
  }

  const strength = calculateStrength(password)
  const entropy = calculateEntropy(password)

  return (
    <div className="space-y-6">
      {/* Password Display */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-400">Generated Password</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="font-mono text-lg p-4 bg-black/50 rounded-lg border border-gray-800/50 min-h-[60px] flex items-center">
            {isGenerating ? (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <span className="text-cyan-400 font-mono">
                {showPassword ? password : password.replace(/./g, '•')}
              </span>
            )}
          </div>
          {copied && (
            <div className="absolute -top-8 right-0 text-green-400 text-sm animate-pulse">
              Copied!
            </div>
          )}
        </div>
      </div>

      {/* Strength Indicator */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-400">Password Strength</span>
          </div>
          <span className="text-sm font-bold text-white">{strength.label}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${strength.color}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span>Entropy: {entropy} bits</span>
          <span>{entropy < 40 ? 'Low' : entropy < 60 ? 'Moderate' : entropy < 80 ? 'Strong' : 'Very Strong'}</span>
        </div>
      </div>

      {/* Options */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Password Options</h3>
        
        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">Password Length</label>
            <span className="text-sm font-bold text-cyan-400">{options.length}</span>
          </div>
          <input
            type="range"
            min="8"
            max="128"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-600">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Uppercase Letters (A-Z)</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Lowercase Letters (a-z)</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Numbers (0-9)</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Symbols (!@#$%^&*)</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Exclude Similar Characters (l, I, 1, O, 0)</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        disabled={isGenerating}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
      >
        <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Generating...' : 'Generate Password'}</span>
      </button>
    </div>
  )
}