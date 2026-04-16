export default function VotingPanel({ phase, isAlive, players, onVote, onWakeUp, voteHistory }) {
  return (
    <div className="bg-[#540b0e] border-4 border-black shadow-[4px_4px_0_#000] p-4 flex flex-col h-full">
      <h3 className="text-[#e09f3e] text-xs mb-4 border-b-4 border-black pb-2 text-center">ACTION</h3>
      
      <div className="flex-1 overflow-y-auto">
        {phase === 'day' && (
          <div className="text-center text-[#fff3b0] text-[10px] leading-loose mt-10">
            DISCUSS WITH<br/>THE PALACE.<br/><br/>FIND THE<br/>TRAITORS.
          </div>
        )}

        {phase === 'voting' && (
          <div className="flex flex-col gap-3">
            <div className="text-center text-[#9e2a2b] text-[10px] mb-2 bg-[#fff3b0] p-2 border-2 border-black">
              CAST VOTE
            </div>
            {isAlive ? players.filter(p => p.id !== 'p1').map(p => (
              <button
                key={p.id}
                onClick={() => onVote(p.id)}
                className="bg-[#335c67] text-[#fff3b0] border-4 border-black p-3 text-[8px] shadow-[4px_4px_0_#000] hover:bg-[#e09f3e] hover:text-[#540b0e] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none text-left flex items-center justify-between"
              >
                <span>{p.name}</span>
                <span className="text-[#9e2a2b]">VOTE</span>
              </button>
            )) : (
              <p className="text-[#fff3b0] text-[8px] text-center mt-4">WAITING FOR VOTES...</p>
            )}
          </div>
        )}

        {phase === 'night' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#9e2a2b] text-[#fff3b0] text-[8px] border-4 border-black p-2 text-center">
              NIGHT FALLS
            </div>
            <div className="space-y-2">
              {voteHistory?.map((v, i) => (
                <div key={i} className="text-[8px] text-[#fff3b0] border-b-2 border-[#335c67] pb-1">
                  <span className="text-[#e09f3e]">{v.voter}</span> voted <span className="text-[#9e2a2b]">{v.voted_for}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={onWakeUp} 
              className="mt-4 bg-[#e09f3e] text-[#540b0e] border-4 border-black p-3 text-[10px] shadow-[4px_4px_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none w-full"
            >
              WAKE UP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}