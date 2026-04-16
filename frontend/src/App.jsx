import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function App() {
  const [gameState, setGameState] = useState(null)

  const fetchState = async () => {
    try {
      const res = await axios.get(`${API_URL}/state`)
      setGameState(res.data)
    } catch (error) {
      console.error("Backend not running", error)
    }
  }

  const startGame = async () => {
    await axios.post(`${API_URL}/start-game?user_name=Player1`)
    fetchState()
  }

  useEffect(() => {
    fetchState()
  }, [])

  return (
    <div className="min-h-screen text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-red-500 tracking-wider text-center">MAFIA AI</h1>
        
        {(!gameState || gameState.players.length === 0) ? (
          <div className="flex justify-center mt-20">
            <button 
              onClick={startGame} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all"
            >
              Initialize Game
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center shadow-md border border-gray-700">
              <span className="text-xl font-semibold uppercase text-blue-400">Phase: {gameState.phase}</span>
              <span className="text-xl font-semibold">Round: {gameState.round}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Player Roster */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md col-span-1">
                <h3 className="text-xl font-bold border-b border-gray-600 pb-2 mb-4 text-gray-300">Roster</h3>
                <ul className="space-y-3">
                  {gameState.players.map(p => (
                    <li key={p.id} className="flex justify-between items-center">
                      <span className="font-medium">{p.name} {p.id === 'p1' && '(You)'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{p.alive ? '🟢' : '🔴'}</span>
                        {p.id === 'p1' && (
                          <span className={`text-xs font-bold px-2 py-1 rounded ${p.role === 'Mafia' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                            {p.role}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chat Placeholder */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md col-span-2 flex items-center justify-center">
                <p className="text-gray-500 italic">Chat interface goes here...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App