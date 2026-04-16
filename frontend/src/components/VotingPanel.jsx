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
            <div className="bg-[#9e2a2b] text-[#fff3b0] text-[8px] border-4 border-black p-2 text-center shadow-[2px_2px_0_#000]">
              VOTING TALLY
            </div>
            
            <div className="space-y-4 my-2">
              {(() => {
                // 1. Count votes
                const counts = {};
                voteHistory?.forEach(v => {
                  counts[v.voted_for] = (counts[v.voted_for] || 0) + 1;
                });
                
                // 2. Sort descending
                const sortedVotes = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                
                // 3. Max possible votes is the number of alive players
                const aliveCount = players.filter(p => p.alive).length;

                return sortedVotes.map(([name, count]) => {
                  // Calculate width percentage
                  const fillPercent = Math.min((count / aliveCount) * 100, 100);
                  
                  return (
                    <div key={name} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[#fff3b0] text-[8px] uppercase">
                        <span>{name}</span>
                        <span className="text-[#e09f3e]">{count}/{aliveCount}</span>
                      </div>
                      
                      {/* Empty Bar Background */}
                      <div className="w-full h-4 bg-[#540b0e] border-2 border-black relative">
                        {/* Filled Bar */}
                        <div 
                          className="absolute top-0 left-0 h-full bg-[#9e2a2b] transition-all duration-1000"
                          style={{ width: `${fillPercent}%` }}
                        ></div>
                        {/* Shine effect for retro styling */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20"></div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <button 
              onClick={onWakeUp} 
              className="mt-2 bg-[#e09f3e] text-[#540b0e] border-4 border-black p-3 text-[10px] shadow-[4px_4px_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none w-full transition-none hover:bg-[#fff3b0]"
            >
              WAKE UP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}