import PlayerCard from './PlayerCard';

export default function PlayerPanel({ players }) {
  return (
    <div className="bg-[#540b0e] border-4 border-black shadow-[4px_4px_0_#000] p-4 flex flex-col h-full">
      <h3 className="text-[#e09f3e] text-xs mb-4 border-b-4 border-black pb-2 text-center">PLAYERS</h3>
      <div className="flex-1 overflow-y-auto pr-2">
        {players.map(p => (
          <PlayerCard key={p.id} player={p} isMe={p.id === 'p1'} />
        ))}
      </div>
    </div>
  );
}