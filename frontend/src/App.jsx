import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function App() {
  const [gameState, setGameState] = useState(null)
  const [chatInput, setChatInput] = useState('')

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

    

{/* Chat Interface */}
<div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md col-span-2 flex flex-col h-[500px]">
  <h3 className="text-xl font-bold border-b border-gray-600 pb-2 mb-4 text-gray-300">Town Square</h3>
  
  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
    {gameState.chat_history.length === 0 ? (
      <p className="text-gray-500 italic text-center mt-10">The town is quiet... say something.</p>
    ) : (
      gameState.chat_history.map((msg, idx) => (
        <div key={idx} className={`p-3 rounded-lg ${msg.sender === 'Human (You)' ? 'bg-blue-900/50 ml-8' : 'bg-gray-700 mr-8'}`}>
          <span className="font-bold text-sm text-gray-400 block mb-1">{msg.sender}</span>
          <p className="text-gray-100">{msg.message}</p>
        </div>
      ))
    )}
  </div>

  {/* Input Area */}
  <form 
    onSubmit={async (e) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      
      const msg = chatInput;
      setChatInput(''); // Clear input immediately
      
      await axios.post(`${API_URL}/user-message`, { message: msg });
      fetchState(); // Refresh chat
    }} 
    className="flex gap-2 pt-2 border-t border-gray-600"
  >
    <input
      type="text"
      value={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      placeholder="Accuse someone..."
      className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
    />
    <button 
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
    >
      Send
    </button>
  </form>


  {/* Voting Interface */}
<div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md col-span-1 md:col-span-3 mt-2">
  {gameState.phase === 'day' && (
    <div className="flex justify-center">
      <button 
        onClick={async () => {
          await axios.post(`${API_URL}/start-voting`);
          fetchState();
        }}
        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded shadow transition-all"
      >
        End Day & Start Voting
      </button>
    </div>
  )}

  {gameState.phase === 'voting' && (
    <div>
      <h3 className="text-xl font-bold text-center text-red-400 mb-4">Cast Your Vote</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {gameState.players.filter(p => p.alive && p.id !== 'p1').map(p => (
          <button
            key={p.id}
            onClick={async () => {
              await axios.post(`${API_URL}/vote`, { voted_for_id: p.id });
              fetchState();
            }}
            className="bg-red-800 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded border border-red-600 transition-all"
          >
            Vote {p.name}
          </button>
        ))}
      </div>
    </div>
  )}

  {gameState.phase === 'night' && (
    <div className="text-center text-gray-400 italic">
      The town goes to sleep... (Night phase logic coming soon)
    </div>
  )}
</div>


</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App