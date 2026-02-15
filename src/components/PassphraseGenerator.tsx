import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw, Lock } from 'lucide-react'

const wordList = [
  'apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'cherry', 'lemon',
  'tiger', 'lion', 'elephant', 'giraffe', 'monkey', 'zebra', 'panda', 'koala',
  'ocean', 'mountain', 'forest', 'desert', 'river', 'lake', 'island', 'valley',
  'rocket', 'planet', 'galaxy', 'comet', 'asteroid', 'nebula', 'star', 'moon',
  'guitar', 'piano', 'violin', 'drums', 'trumpet', 'saxophone', 'flute', 'harp',
  'coffee', 'tea', 'water', 'juice', 'milk', 'soda', 'wine', 'beer',
  'summer', 'winter', 'spring', 'autumn', 'season', 'weather', 'climate', 'nature',
  'hacker', 'coder', 'developer', 'programmer', 'designer', 'artist', 'creator', 'builder',
  'quantum', 'binary', 'digital', 'cyber', 'matrix', 'algorithm', 'protocol', 'network',
  'shadow', 'light', 'dark', 'bright', 'neon', 'laser', 'plasma', 'energy'
]

export function PassphraseGenerator() {
  const [passphrase, setPassphrase] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [capitalize, setCapitalize] = useState(false)
  const [includeNumbers, setIncludeNumbers] = useState(true)

  const generatePassphrase = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const words: string[] = []
      
      for (let i = 0; i < wordCount; i++) {
        const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % wordList.length
        let word = wordList[randomIndex]
        
        if (capitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1)
        }
        
        words.push(word)
      }
      
      let result = words.join(separator)
      
      if (includeNumbers) {
        const randomNum = crypto.getRandomValues(new Uint32Array(1))[0] % 100
        result += separator + randomNum
      }
      
      setPassphrase(result)
      setIsGenerating(false)
      
      // Emit event for history tracking
      window.dispatchEvent(new CustomEvent('passwordGenerated', {
        detail: { password: result, type: 'passphrase' }
      }))
    }, 300)
  }

  useEffect(() => {
    generatePassphrase()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(passphrase)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const calculateEntropy = () => {
    const wordEntropy = Math.log2(wordList.length)
    const totalEntropy = wordCount * wordEntropy
    if (includeNumbers) {
      totalEntropy + Math.log2(100)
    }
    return Math.round(totalEntropy)
  }

  return (
    <div className="space-y-6">
      {/* Passphrase Display */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-400">Generated Passphrase</label>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
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
              <span className="text-cyan-400 font-mono">{passphrase}</span>
            )}
          </div>
          {copied && (
            <div className="absolute -top-8 right-0 text-green-400 text-sm animate-pulse">
              Copied!
            </div>
          )}
        </div>
      </div>

      {/* Entropy Display */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-400">Passphrase Entropy</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-cyan-400">{calculateEntropy()}</span>
            <span className="text-sm text-gray-400 ml-1">bits</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {calculateEntropy() < 50 ? 'Fair - Consider more words' : 
           calculateEntropy() < 70 ? 'Good - Reasonable security' : 
           'Excellent - High security'}
        </div>
      </div>

      {/* Options */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Passphrase Options</h3>
        
        {/* Word Count Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">Number of Words</label>
            <span className="text-sm font-bold text-cyan-400">{wordCount}</span>
          </div>
          <input
            type="range"
            min="3"
            max="8"
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-600">
            <span>3</span>
            <span>8</span>
          </div>
        </div>

        {/* Separator Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Separator</label>
          <div className="grid grid-cols-3 gap-2">
            {['-', '_', '.'].map((sep) => (
              <button
                key={sep}
                onClick={() => setSeparator(sep)}
                className={`py-2 px-4 rounded-lg border transition-all duration-300 font-mono ${
                  separator === sep
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white'
                }`}
              >
                {sep === '-' ? 'Dash (-)' : sep === '_' ? 'Underscore (_)' : 'Dot (.)'}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={capitalize}
              onChange={(e) => setCapitalize(e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Capitalize First Letter</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Include Random Number</span>
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-xl">
        <div className="text-sm text-blue-300">
          <p className="font-semibold mb-1">💡 Pro Tip</p>
          <p>Passphrases are easier to remember than random passwords but can be equally secure when using 4+ random words.</p>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassphrase}
        disabled={isGenerating}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
      >
        <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Generating...' : 'Generate Passphrase'}</span>
      </button>
    </div>
  )
}