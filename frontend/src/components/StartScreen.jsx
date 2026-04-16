import { useState } from 'react';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#6fa8ff] text-black font-sans p-4">
      <h1 
        className="text-6xl md:text-8xl font-black mb-8 tracking-widest text-white uppercase" 
        style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px #000' }}
      >
        Traitors
      </h1>
      
      <div className="bg-[#ffde59] p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-md w-full relative">
        <div className="absolute -top-6 -left-6 bg-[#c084fc] border-4 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0_#000] transform -rotate-6">
          <span className="font-black text-xl uppercase">Welcome! 👋</span>
        </div>

        <h2 className="text-2xl font-black mt-4 mb-6 uppercase border-b-4 border-black pb-2">The Palace Awaits</h2>
        
        <ul className="text-left font-bold mb-8 space-y-4 text-sm md:text-base">
          <li className="bg-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0_#000]">
            🕵️‍♂️ <strong className="uppercase">Roles:</strong> You are Innocent or a Traitor.
          </li>
          <li className="bg-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0_#000]">
            ⏳ <strong className="uppercase">Pacing:</strong> 90s to argue, 30s to vote.
          </li>
          <li className="bg-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0_#000]">
            💬 <strong className="uppercase">Persuade:</strong> Chat with AI to survive.
          </li>
        </ul>
        
        <input
          type="text"
          placeholder="Enter your name..."
          className="w-full bg-white border-4 border-black rounded-xl px-4 py-4 font-black text-lg mb-6 shadow-[4px_4px_0_#000] focus:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-[2px_2px_0_#000] transition-all placeholder:font-bold placeholder:text-gray-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <button 
          onClick={() => onStart(name || 'Player')}
          className="w-full bg-[#4ade80] text-black font-black uppercase tracking-wider text-xl py-4 px-8 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all"
        >
          Enter Palace 🚀
        </button>
      </div>
    </div>
  );
}