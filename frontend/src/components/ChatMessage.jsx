export default function ChatMessage({ msg, isMe, isSystem }) {
  if (isSystem) {
    return (
      <div className="text-center my-6">
        <span className="bg-[#9e2a2b] text-[#fff3b0] border-4 border-black px-4 py-2 text-[10px] shadow-[2px_2px_0_#000]">
          {msg.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] border-4 border-black p-3 shadow-[4px_4px_0_#000] ${isMe ? 'bg-[#e09f3e] text-[#540b0e]' : 'bg-[#335c67] text-[#fff3b0]'}`}>
        <span className="text-[8px] opacity-70 block mb-2 uppercase border-b-2 border-black/20 pb-1">
          {msg.sender}
        </span>
        <p className="text-[10px] leading-relaxed">{msg.message}</p>
      </div>
    </div>
  );
}