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
      label: `Option ${i + 1}`
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
      }, 600)
    }, 500)
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
    
    // Animation effect - cycle through random chits
    let iterations = 0
    const maxIterations = 15
    const interval = setInterval(() => {
      setCurrentPick(available[Math.floor(Math.random() * available.length)])
      iterations++
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        // Use random for final pick
        const randomIndex = Math.floor(Math.random() * available.length)
        const finalPick = available[randomIndex]
        setCurrentPick(finalPick)
        setPickedChits(prev => [...prev, finalPick])
        setHistory(prev => [{ pick: finalPick, timestamp: new Date().toISOString() }, ...prev].slice(0, 10))
        setIsAnimating(false)
      }
    }, 75)
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

  const filledCount = chits.filter(c => c.value.trim()).length

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Instant Decision Maker
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Chit Picker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-md mx-auto">
          Add your choices, shuffle to randomize, and pick fair decisions without repetition.
        </p>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 transition-all duration-300">
        {/* Status Notification */}
        {shuffledChits.length > 0 && !isShuffling && (
          <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2.5 text-emerald-700 dark:text-emerald-400 text-sm font-medium animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Chits are shuffled and hidden. Pick one to reveal!</span>
          </div>
        )}

        {/* Chit Count Configuration */}
        {chits.length === 0 && (
          <div className="py-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Number of Options
              </label>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-lg">
                {chitCount}
              </span>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="2"
                max="20"
                value={chitCount}
                onChange={(e) => setChitCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500 transition-all"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>Quick select:</span>
                <div className="flex gap-1.5">
                  {[2, 4, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChitCount(num)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        chitCount === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                          : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateInputs}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-base active:scale-[0.99]"
            >
              <span>Generate Input Fields</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

        {/* Chit Inputs Grid */}
        {chits.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                {isShuffling 
                  ? 'Shuffling in progress...' 
                  : !showChits && shuffledChits.length > 0 
                    ? 'Chits are hidden' 
                    : 'Fill in your options:'}
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {filledCount} / {chits.length} filled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {chits.map((chit, index) => {
                const isPicked = pickedChits.includes(chit.value) && chit.value.trim() !== ''

                return (
                  <div
                    key={chit.id}
                    className={`relative transition-all duration-300 ${isPicked ? 'opacity-40 grayscale-[40%]' : ''}`}
                  >
                    <div className={`flip-card ${!showChits ? 'flipped' : ''}`}>
                      <div className="flip-card-inner">
                        {/* Front Side: Input Card */}
                        <div className="flip-card-front">
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 select-none">
                              #{index + 1}
                            </span>
                            <input
                              type="text"
                              value={chit.value}
                              onChange={(e) => updateChit(chit.id, e.target.value)}
                              placeholder={`Enter option ${index + 1}`}
                              disabled={isPicked || isShuffling}
                              className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm font-medium transition-all duration-200 ${
                                isPicked
                                  ? 'border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 text-slate-400 line-through'
                                  : 'border-slate-200/90 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 shadow-sm'
                              }`}
                            />
                            {isPicked && (
                              <div className="absolute right-3 text-emerald-500 dark:text-emerald-400 flex items-center gap-1 text-xs font-semibold">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Back Side: Minimalist Hidden Card (No bouncing question mark) */}
                        <div className="flip-card-back">
                          <div className="w-full h-full flex items-center justify-center rounded-2xl bg-slate-800 dark:bg-slate-900/90 border border-slate-700/60 dark:border-slate-800 shadow-inner px-4 text-slate-300 dark:text-slate-400">
                            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
                              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Chit #{index + 1} Hidden</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Controls */}
        {chits.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {/* Shuffle Button */}
            <button
              onClick={handleShuffle}
              disabled={isAnimating || isShuffling}
              className={`flex-1 min-w-[130px] py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                isShuffling
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white disabled:opacity-50'
              }`}
            >
              <svg className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isShuffling ? 'Shuffling...' : 'Shuffle'}</span>
            </button>

            {/* Pick Button */}
            <button
              onClick={handlePick}
              disabled={isAnimating || isShuffling}
              className="flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white transition-all duration-200 shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>Pick One</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={isAnimating || isShuffling}
              className="px-5 py-3 rounded-2xl font-semibold text-sm bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700/80 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Picked Result Display */}
      {currentPick && (
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 text-center animate-fade-in border-indigo-500/30 dark:border-indigo-500/30 shadow-xl shadow-indigo-500/5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {isAnimating ? 'Selecting randomly...' : 'Selected Chit'}
          </div>

          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight transition-all duration-150 ${
            isAnimating ? 'text-indigo-400 scale-95 opacity-80' : 'text-slate-900 dark:text-white scale-100'
          }`}>
            {currentPick}
          </h2>

          {!isAnimating && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-3">
              {pickedChits.length} of {filledCount} options chosen
            </p>
          )}
        </div>
      )}

      {/* Pick History Section */}
      {history.length > 0 && (
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Recent Picks</span>
            </h3>
            <button
              onClick={clearHistory}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              Clear History
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.pick}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="text-center text-xs text-slate-400 dark:text-slate-600 font-medium">
        Chit Picker &bull; Clean &amp; Minimal Decision Tool
      </footer>
    </div>
  )
}

export default ChitPicker