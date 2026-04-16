import { useState } from 'react';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl text-[#e09f3e] mb-12 text-center" style={{ textShadow: '4px 4px 0 #000' }}>
        PIXEL PALACE
      </h1>
      
      <div className="bg-[#540b0e] p-8 border-4 border-black shadow-[8px_8px_0_#000] max-w-md w-full">
        <h2 className="text-lg text-[#fff3b0] mb-8 text-center leading-loose">
          SURVIVE THE TRAITORS
        </h2>
        
        <input
          type="text"
          placeholder="ENTER NAME..."
          className="w-full bg-[#fff3b0] text-[#540b0e] border-4 border-black p-4 mb-6 text-xs md:text-sm focus:outline-none focus:bg-white placeholder-[#9e2a2b]"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
        />
        
        <button 
          onClick={() => onStart(name || 'PLAYER')}
          className="w-full bg-[#e09f3e] text-[#540b0e] border-4 border-black p-4 text-sm shadow-[4px_4px_0_#000] hover:bg-[#fff3b0] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-none"
        >
          START GAME
        </button>
      </div>
    </div>
  );
}