export default function GameHUD({ phase, timeLeft, round }) {
  return (
    <div className="bg-[#540b0e] border-4 border-black shadow-[4px_4px_0_#000] p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="text-[#e09f3e] text-lg" style={{ textShadow: '2px 2px 0 #000' }}>
        PHASE: <span className="text-[#fff3b0]">{phase.toUpperCase()}</span>
      </div>
      <div className={`text-2xl ${timeLeft <= 10 ? 'text-[#9e2a2b] animate-pulse' : 'text-[#fff3b0]'}`} style={{ textShadow: '2px 2px 0 #000' }}>
        TIME: {timeLeft}
      </div>
      <div className="text-[#e09f3e] text-sm">
        ROUND {round}
      </div>
    </div>
  );
}