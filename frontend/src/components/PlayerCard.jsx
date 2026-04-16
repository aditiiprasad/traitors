export default function PlayerCard({ player, isMe }) {
  const isAlive = player.alive;

  // Map the exact character names to your local image files
  const getAvatarSrc = () => {
    if (isMe) return '/5.jpg'; // The Human User

    // Use .includes() just to be safe in case of minor text variations
    if (player.name.includes('Kabir')) return '/1.jpg';
    if (player.name.includes('Lalu')) return '/2.jpg';
    if (player.name.includes('Kim')) return '/3.jpg';
    if (player.name.includes('Elon')) return '/4.png';

    // Fallback just in case
    return '/5.jpg';
  };

  return (
    <div className={`flex items-center gap-3 p-3 border-4 border-black mb-3 ${isAlive ? 'bg-[#335c67]' : 'bg-[#540b0e] opacity-80'}`}>
      <img
        src={getAvatarSrc()}
        alt={player.name}
        className={`w-12 h-12 border-2 border-black object-cover ${!isAlive && 'grayscale brightness-50 contrast-125'}`}
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
      {!isAlive && <span className="text-[#9e2a2b] text-xl drop-shadow-[2px_2px_0_#000]">X</span>}
    </div>
  );
}