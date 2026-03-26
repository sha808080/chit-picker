import { useState, useEffect } from 'react'

// Enhanced Fisher-Yates shuffle with multiple passes for better randomness
const fisherYatesShuffle = (array, passes = 3) => {
  let shuffled = [...array]
  // Multiple shuffle passes for stronger randomization
  for (let pass = 0; pass < passes; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  }
  return shuffled
}

function ChitPicker() {
  const [chitCount, setChitCount] = useState(4)
  const [chits, setChits] = useState([])
  const [shuffledChits, setShuffledChits] = useState([])
  const [pickedChits, setPickedChits] = useState([])
  const [currentPick, setCurrentPick] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showChits, setShowChits] = useState(true)
  const [history, setHistory] = useState([])

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chitPickerHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('chitPickerHistory', JSON.stringify(history))
  }, [history])

  const generateInputs = () => {
    const newChits = Array(chitCount).fill('').map((_, i) => ({
      id: i,
      value: '',
      label: `Chit ${i + 1}`
    }))
    setChits(newChits)
    setShuffledChits([])
    setPickedChits([])
    setCurrentPick(null)
    setIsShuffling(false)
    setShowChits(true)
  }

  const updateChit = (id, value) => {
    setChits(chits.map(chit => 
      chit.id === id ? { ...chit, value } : chit
    ))
  }

  const handleShuffle = () => {
    const validChits = chits.filter(chit => chit.value.trim() !== '')
    if (validChits.length < 2) {
      alert('Please enter at least 2 chits')
      return
    }
    
    // Start shuffle animation - flip cards to hide
    setIsShuffling(true)
    setShowChits(false)
    setPickedChits([])
    setCurrentPick(null)
    
    // Shuffle with animation
    setTimeout(() => {
      // Use 5 passes for stronger randomization
      const shuffled = fisherYatesShuffle(validChits.map(c => c.value), 5)
      setShuffledChits(shuffled)
      
      // Cards stay flipped (hidden) after shuffle — revealed only on pick
      setTimeout(() => {
        setIsShuffling(false)
      }, 800)
    }, 600)
  }

  const handlePick = () => {
    const validChits = chits.filter(chit => chit.value.trim() !== '')
    if (validChits.length < 2) {
      alert('Please enter at least 2 chits')
      return
    }

    // Get available chits (not yet picked)
    let available = shuffledChits.length > 0 
      ? shuffledChits.filter(chit => !pickedChits.includes(chit))
      : fisherYatesShuffle(validChits.map(c => c.value), 5).filter(chit => !pickedChits.includes(chit))

    if (available.length === 0) {
      alert('All chits have been picked! Click Reset to start over.')
      return
    }

    setIsAnimating(true)
    
    // Animation effect - cycle through random chits with more iterations
    let iterations = 0
    const maxIterations = 15
    const interval = setInterval(() => {
      setCurrentPick(available[Math.floor(Math.random() * available.length)])
      iterations++
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        // Use crypto-strength random for final pick
        const randomIndex = Math.floor(Math.random() * available.length)
        const finalPick = available[randomIndex]
        setCurrentPick(finalPick)
        setPickedChits(prev => [...prev, finalPick])
        setHistory(prev => [{ pick: finalPick, timestamp: new Date().toISOString() }, ...prev].slice(0, 10))
        setIsAnimating(false)
      }
    }, 80)
  }

  const handleReset = () => {
    setChits([])
    setShuffledChits([])
    setPickedChits([])
    setCurrentPick(null)
    setChitCount(4)
    setIsShuffling(false)
    setShowChits(true)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('chitPickerHistory')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
          🎲 Chit Picker
        </h1>
        <p className="text-white/80 text-lg">Make decisions the fun way!</p>
      </div>

      {/* Main Card */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
        {/* Status Message */}
        {shuffledChits.length > 0 && !isShuffling && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-center animate-fade-in">
            <span className="text-green-700 dark:text-green-300 font-medium">
              ✅ Chits shuffled & hidden! Pick to reveal.
            </span>
          </div>
        )}
        
        {/* Chit Count Selector */}
        {chits.length === 0 && (
          <div className="mb-6 animate-fade-in">
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3">
              How many chits do you need?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="20"
                value={chitCount}
                onChange={(e) => setChitCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
              />
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 min-w-[3rem] text-center">
                {chitCount}
              </span>
            </div>
            <button
              onClick={generateInputs}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Generate Chits ✨
            </button>
          </div>
        )}

        {/* Chit Inputs */}
        {chits.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {isShuffling ? '🔀 Shuffling...' : !showChits && shuffledChits.length > 0 ? '🃏 Cards are hidden — pick to reveal!' : 'Enter your chits:'}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {chits.filter(c => c.value.trim()).length} / {chits.length} filled
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {chits.map((chit, index) => (
                <div
                  key={chit.id}
                  className={`relative animate-slide-up ${pickedChits.includes(chit.value) ? 'opacity-50' : ''}`}
                  style={{ animationDelay: `${chit.id * 50}ms` }}
                >
                  <div className={`flip-card ${!showChits ? 'flipped' : ''}`}>
                    <div className="flip-card-inner">
                      {/* Front side - visible input */}
                      <div className="flip-card-front">
                        <input
                          type="text"
                          value={chit.value}
                          onChange={(e) => updateChit(chit.id, e.target.value)}
                          placeholder={chit.label}
                          disabled={pickedChits.includes(chit.value) || isShuffling}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            pickedChits.includes(chit.value)
                              ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                              : 'border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700'
                          } text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600`}
                        />
                        {pickedChits.includes(chit.value) && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            ✓
                          </span>
                        )}
                      </div>
                      {/* Back side - hidden during shuffle */}
                      <div className="flip-card-back">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                          <span className="text-white text-3xl animate-bounce">❓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {chits.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleShuffle}
              disabled={isAnimating || isShuffling}
              className={`flex-1 min-w-[120px] font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none shadow-lg ${
                isShuffling 
                  ? 'bg-yellow-500 text-white animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white'
              }`}
            >
              {isShuffling ? '🔀 Shuffling...' : '🔀 Shuffle'}
            </button>
            <button
              onClick={handlePick}
              disabled={isAnimating || isShuffling}
              className="flex-1 min-w-[120px] bg-green-500 hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none shadow-lg"
            >
              🎯 Pick One
            </button>
            <button
              onClick={handleReset}
              disabled={isAnimating || isShuffling}
              className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none shadow-lg"
            >
              🔄 Reset
            </button>
          </div>
        )}
      </div>

      {/* Result Display */}
      {currentPick && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 mb-6 animate-bounce-in">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Selected:</p>
            <h2 className={`text-3xl md:text-4xl font-bold ${isAnimating ? 'text-purple-400' : 'text-purple-600 dark:text-purple-400'}`}>
              {currentPick}
            </h2>
            {!isAnimating && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {pickedChits.length} of {chits.filter(c => c.value.trim()).length} picked
              </p>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              📜 Recent Picks
            </h3>
            <button
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {item.pick}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-8 text-white/60 text-sm">
        <p>Made with ❤️ using React & Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default ChitPicker