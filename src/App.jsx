import { useState } from 'react'
import ChitPicker from './components/ChitPicker'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-indigo-500 selection:text-white">
        {/* Sleek Glassmorphic Theme Toggle */}
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:scale-95"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <ChitPicker />
      </div>
    </div>
  )
}

export default App