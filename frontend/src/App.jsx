import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StartScreen from './components/StartScreen';

const API_URL = 'http://localhost:8000';

function App() {
  const [gameState, setGameState] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const chatEndRef = useRef(null);

  const fetchState = async () => {
    const res = await axios.get(`${API_URL}/state`);
    setGameState(res.data);
  };

  const startGame = async (name) => {
    const res = await axios.post(`${API_URL}/start-game?user_name=${name}`);
    setGameState(res.data);
    setTimeLeft(90); // 90 Seconds for Day Discussion
  };

  useEffect(() => {
    if (!gameState) return;
    
    if (gameState.phase === 'day' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState.phase === 'day' && timeLeft === 0) {
      axios.post(`${API_URL}/start-voting`).then(() => {
        fetchState();
        setTimeLeft(30); // 30 Seconds for Voting
      });
    }

    if (gameState.phase === 'voting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState.phase === 'voting' && timeLeft === 0) {
      const me = gameState.players.find(p => p.id === 'p1');
      if (me?.alive) axios.post(`${API_URL}/vote`, { voted_for_id: "p2" }).then(fetchState); 
    }
  }, [timeLeft, gameState?.phase]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState?.chat_history]);

  if (!gameState || gameState.phase === 'setup') {
    return <StartScreen onStart={startGame} />;
  }

  const me = gameState.players.find(p => p.id === 'p1');

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 font-sans bg-[#6fa8ff] text-black">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-6">
        
        {/* TOP STATUS BAR */}
        <div className="bg-[#c084fc] p-4 rounded-2xl flex flex-wrap justify-between items-center border-4 border-black shadow-[6px_6px_0_#000]">
          <div className="font-black text-2xl uppercase tracking-widest flex items-center gap-2 bg-white px-4 py-1 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] transform -rotate-2">
            🎲 Traitors
          </div>
          <div className="flex gap-4 md:gap-8 items-center mt-4 md:mt-0">
            <span className="font-black text-lg bg-white border-4 border-black px-4 py-1 rounded-xl shadow-[4px_4px_0_#000]">
              PHASE: <span className="text-[#ff6b6b]">{gameState.phase.toUpperCase()}</span>
            </span>
            <span className="font-black text-3xl w-16 text-center bg-white border-4 border-black px-4 py-1 rounded-xl shadow-[4px_4px_0_#000]">
              {['day', 'voting'].includes(gameState.phase) ? `${timeLeft}s` : '⏳'}
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="flex flex-col md:flex-row gap-6 flex-1">
          
          {/* LEFT PANEL: ROSTER */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-[#ff9eaa] p-5 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] flex flex-col">
            <div className="bg-white border-4 border-black rounded-xl p-2 mb-6 shadow-[4px_4px_0_#000] transform rotate-2">
              <h3 className="font-black text-center uppercase tracking-wider text-xl">The Palace</h3>
            </div>
            <ul className="space-y-4 overflow-y-auto flex-1 pr-2">
              {gameState.players.map((p) => (
                <li key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border-4 border-black ${p.alive ? 'bg-white shadow-[4px_4px_0_#000]' : 'bg-gray-300 opacity-70 grayscale shadow-none translate-y-[4px] translate-x-[4px]'}`}>
                  <img src={`https://ui-avatars.com/api/?name=${p.name}&background=random&bold=true`} alt={p.name} className="w-12 h-12 rounded-full border-4 border-black" />
                  <div className="flex-1">
                    <span className={`font-black block leading-tight ${!p.alive && 'line-through'}`}>{p.name} {p.id === 'p1' && '(You)'}</span>
                    {p.id === 'p1' && (
                      <span className={`text-[10px] uppercase font-black border-2 border-black px-2 py-0.5 rounded-full mt-1 inline-block ${p.role === 'Traitor' ? 'bg-[#ff6b6b] text-white' : 'bg-[#4ade80] text-black'}`}>
                        {p.role}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER/RIGHT PANEL */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
            
            {/* CHAT AREA */}
            <div className="bg-[#ffde59] flex-1 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] flex flex-col p-4 overflow-hidden relative min-h-[450px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                {gameState.chat_history.map((msg, idx) => {
                  const isSystem = msg.sender === 'SYSTEM';
                  const isMe = msg.sender === me?.name;
                  
                  if (isSystem) return (
                    <div key={idx} className="flex justify-center my-4">
                      <span className="bg-white border-4 border-black px-4 py-1 rounded-xl shadow-[4px_4px_0_#000] font-black uppercase text-xs">
                        {msg.message}
                      </span>
                    </div>
                  );
                  
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <img src={`https://ui-avatars.com/api/?name=${msg.sender}&background=random&color=fff`} className="w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0_#000]" />
                        <div className={`p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_#000] ${isMe ? 'bg-[#4ade80] rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                          <span className="text-[10px] font-black opacity-70 uppercase block mb-1">{msg.sender}</span>
                          <p className="text-sm md:text-base font-bold">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* CHAT INPUT */}
              {gameState.phase === 'day' && me?.alive ? (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!chatInput.trim()) return;
                    const msg = chatInput;
                    setChatInput(''); 
                    await axios.post(`${API_URL}/user-message`, { message: msg });
                    fetchState();
                  }} 
                  className="mt-4 flex gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your accusation..."
                    className="flex-1 bg-white border-4 border-black font-black rounded-xl px-4 py-3 shadow-[4px_4px_0_#000] focus:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-[2px_2px_0_#000] transition-all"
                  />
                  <button type="submit" className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-black uppercase tracking-wider py-3 px-8 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all">
                    Send
                  </button>
                </form>
              ) : (
                <div className="mt-4 p-4 bg-white rounded-xl text-center font-black border-4 border-black shadow-[4px_4px_0_#000] transform -rotate-1">
                  {!me?.alive ? "💀 You are dead." : "Chat is closed."}
                </div>
              )}
            </div>

            {/* ACTION PANEL (VOTING/NIGHT) */}
            {(gameState.phase === 'voting' || gameState.phase === 'night' || gameState.phase === 'game_over') && (
              <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] relative overflow-hidden">
                
                {/* VOTING PHASE */}
                {gameState.phase === 'voting' && (
                  <div>
                    <h3 className="text-3xl font-black text-center mb-6 uppercase tracking-widest bg-[#ffde59] border-4 border-black inline-block px-6 py-2 rounded-xl shadow-[4px_4px_0_#000] transform rotate-1">
                      🚨 Time to Vote 🚨
                    </h3>
                    {me?.alive ? (
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {gameState.players.filter(p => p.alive && p.id !== 'p1').map((p) => (
                          <button
                            key={p.id}
                            onClick={async () => {
                              await axios.post(`${API_URL}/vote`, { voted_for_id: p.id });
                              fetchState();
                            }}
                            className="flex items-center gap-3 bg-[#6fa8ff] text-black font-black uppercase py-3 px-6 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
                          >
                            <img src={`https://ui-avatars.com/api/?name=${p.name}&background=random`} className="w-8 h-8 rounded-full border-2 border-black" />
                            Vote {p.name}
                          </button>
                        ))}
                      </div>
                    ) : <p className="text-center font-black text-lg">Waiting for the living to vote...</p>}
                  </div>
                )}

                {/* NIGHT PHASE (VOTE RESULTS) */}
                {gameState.phase === 'night' && (
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black text-center uppercase tracking-widest">Vote Results</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
                      {gameState.players.map((player) => {
                        const votesReceived = gameState.vote_history?.filter(v => v.voted_for === player.name) || [];
                        if (votesReceived.length === 0) return null;

                        return (
                          <div key={player.id} className="bg-[#ffde59] rounded-xl border-4 border-black shadow-[6px_6px_0_#000] p-4 text-center relative hover:-translate-y-2 transition-transform">
                            <div className="absolute -top-4 -right-4 bg-[#ff6b6b] text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-[4px_4px_0_#000] border-4 border-black">
                              {votesReceived.length}
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=${player.name}`} className="w-14 h-14 rounded-full mx-auto mb-3 border-4 border-black shadow-[2px_2px_0_#000]" />
                            <div className="font-black text-lg leading-tight uppercase border-b-4 border-black pb-2 mb-2">{player.name}</div>
                            <div className="text-sm font-bold space-y-1">
                              <div className="text-[10px] uppercase bg-white border-2 border-black inline-block px-2 rounded-full mb-1">Voters:</div>
                              {votesReceived.map((v, i) => (
                                <div key={i} className="bg-white border-2 border-black rounded-lg py-1 px-2 shadow-[2px_2px_0_#000] text-xs">
                                  {v.voter}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 text-center bg-[#c084fc] p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000]">
                      <p className="text-lg font-black mb-6 uppercase bg-white border-4 border-black inline-block px-4 py-2 rounded-xl shadow-[4px_4px_0_#000]">
                        🌙 Traitors are choosing a victim...
                      </p>
                      <br/>
                      <button 
                        onClick={async () => { await axios.post(`${API_URL}/run-night`); fetchState(); }} 
                        className="bg-[#4ade80] text-black font-black uppercase py-4 px-10 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all text-xl"
                      >
                        Wake Up Palace
                      </button>
                    </div>
                  </div>
                )}

                {/* GAME OVER */}
                {gameState.phase === 'game_over' && (
                  <div className="text-center space-y-8 py-8">
                    <h2 
                      className="text-6xl font-black uppercase tracking-tighter text-white"
                      style={{ WebkitTextStroke: '2px black', textShadow: '6px 6px 0px #000' }}
                    >
                      GAME OVER
                    </h2>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                      {gameState.players.map((p) => (
                        <div key={p.id} className={`p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] transform transition-transform hover:-translate-y-2 ${p.role === 'Traitor' ? 'bg-[#ff9eaa]' : 'bg-[#4ade80]'}`}>
                          <img src={`https://ui-avatars.com/api/?name=${p.name}`} className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-black" />
                          <div className="font-black text-xl uppercase bg-white border-2 border-black rounded-lg px-2 py-1 mb-2 shadow-[2px_2px_0_#000]">{p.name}</div>
                          <div className="text-sm font-black uppercase bg-white border-2 border-black rounded-full inline-block px-3 py-1 shadow-[2px_2px_0_#000]">{p.role}</div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => window.location.reload()} 
                      className="bg-[#ffde59] text-black font-black uppercase text-xl py-4 px-12 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[6px_6px_0_#000] active:translate-y-[8px] active:translate-x-[8px] active:shadow-none transition-all mt-6"
                    >
                      Play Again 🔄
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;