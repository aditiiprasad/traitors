export default function PlayerCard({ player, isMe }) {
  const isAlive = player.alive;
  
  return (
    <div className={`flex items-center gap-3 p-3 border-4 border-black mb-3 ${isAlive ? 'bg-[#335c67]' : 'bg-[#540b0e] opacity-80'}`}>
      <img 
        src={`https://ui-avatars.com/api/?name=${player.name}&background=${isAlive ? 'e09f3e' : '9e2a2b'}&color=000&rounded=false&bold=true`} 
        alt={player.name} 
        className={`w-12 h-12 border-2 border-black ${!isAlive && 'grayscale'}`} 
      />
      <div className="flex-1 overflow-hidden">
        <span className={`text-[10px] block truncate ${isAlive ? 'text-[#fff3b0]' : 'text-gray-400 line-through'}`}>
          {player.name} {isMe && '(YOU)'}
        </span>
        {isMe && (
          <span className={`text-[8px] mt-2 inline-block px-2 py-1 border-2 border-black ${player.role === 'Traitor' ? 'bg-[#9e2a2b] text-[#fff3b0]' : 'bg-[#e09f3e] text-[#540b0e]'}`}>
            {player.role}
          </span>
        )}
      </div>
      {!isAlive && <span className="text-[#9e2a2b] text-xl">X</span>}
    </div>
  );
}