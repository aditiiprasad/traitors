export default function GameOverScreen({ players, onRestart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl md:text-6xl text-[#9e2a2b] mb-12 text-center" style={{ textShadow: '4px 4px 0 #000' }}>
        GAME OVER
      </h2>
      
      <div className="bg-[#335c67] p-6 border-4 border-black shadow-[8px_8px_0_#000] max-w-2xl w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {players.map(p => (
            <div key={p.id} className="bg-[#540b0e] border-4 border-black p-3 text-center">
              <div className={`text-[10px] ${p.role === 'Traitor' ? 'text-[#9e2a2b]' : 'text-[#e09f3e]'} mb-2`}>{p.role}</div>
              <div className="text-[#fff3b0] text-[8px]">{p.name}</div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onRestart}
          className="w-full bg-[#e09f3e] text-[#540b0e] border-4 border-black p-4 text-sm shadow-[4px_4px_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}