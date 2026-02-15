import { Shield, Zap } from 'lucide-react'

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20 animate-pulse" />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-cyan-500/10 text-xs font-mono animate-pulse"
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

      {/* Logo Animation */}
      <div className="relative z-10 text-center">
        <div className="relative mb-8">
          <div className="relative inline-block">
            <Shield className="w-24 h-24 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-12 h-12 text-white animate-ping" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            CyberKey
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-2">
          Advanced Password Security
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          by Md Musfiqure Rahman
        </p>
        
        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <div className="mt-8 text-xs text-gray-600 font-mono">
          <div className="animate-pulse">Initializing secure environment...</div>
        </div>
      </div>


    </div>
  )
}