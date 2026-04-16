import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StartScreen from './components/StartScreen';
import GameHUD from './components/GameHUD';
import PlayerPanel from './components/PlayerPanel';
import ChatWindow from './components/ChatWindow';
import VotingPanel from './components/VotingPanel';
import GameOverScreen from './components/GameOverScreen';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    setTimeLeft(90); 
  };

  // 1. COUNTDOWN TIMER LOGIC
  useEffect(() => {
    if (!gameState) return;
    if (gameState.phase === 'day' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState.phase === 'day' && timeLeft === 0) {
      axios.post(`${API_URL}/start-voting`).then(() => {
        fetchState();
        setTimeLeft(30);
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


  // 2. FIXED: AUTONOMOUS AI HEARTBEAT
  useEffect(() => {
    let aiInterval;
    if (gameState?.phase === 'day') {
      // Set to 8 seconds. Removed 'timeLeft' from dependencies so it doesn't reset!
      aiInterval = setInterval(async () => {
        await axios.post(`${API_URL}/ai-message`);
        fetchState();
      }, 8000); 
    }
    return () => clearInterval(aiInterval);
  }, [gameState?.phase]); // <--- Fixed dependency array here!

  
  // 3. AUTO-SCROLL LOGIC
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState?.chat_history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput(''); 
    await axios.post(`${API_URL}/user-message`, { message: msg });
    fetchState();
  };

  const handleVote = async (playerId) => {
    await axios.post(`${API_URL}/vote`, { voted_for_id: playerId });
    fetchState();
  };

  const handleNightWakeup = async () => {
    await axios.post(`${API_URL}/run-night`);
    fetchState();
  };

  if (!gameState || gameState.phase === 'setup') {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState.phase === 'game_over') {
    return <GameOverScreen players={gameState.players} onRestart={() => window.location.reload()} />;
  }

  const me = gameState.players.find(p => p.id === 'p1');

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
      <GameHUD phase={gameState.phase} timeLeft={timeLeft} round={gameState.round} />
      
      {/* GAME GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 h-[550px] min-h-[550px] max-h-[550px]">
        
        {/* LEFT: Players */}
        <div className="md:col-span-1">
          <PlayerPanel players={gameState.players} />
        </div>

        {/* CENTER: Chat */}
        <div className="md:col-span-2">
          <ChatWindow 
            chatHistory={gameState.chat_history} 
            chatRef={chatEndRef}
            phase={gameState.phase}
            isAlive={me?.alive}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendMessage={handleSendMessage}
            me={me}
          />
        </div>

        {/* RIGHT: Actions / Voting */}
        <div className="md:col-span-1">
          <VotingPanel 
            phase={gameState.phase}
            isAlive={me?.alive}
            players={gameState.players}
            onVote={handleVote}
            onWakeUp={handleNightWakeup}
            voteHistory={gameState.vote_history}
          />
        </div>

      </div>
    </div>
  );
}

export default App;