import ChatMessage from './ChatMessage';

// Added 'me' to the props list here
export default function ChatWindow({ chatHistory, chatRef, phase, isAlive, chatInput, setChatInput, onSendMessage, me }) {
  return (
    <div className="bg-[#540b0e] border-4 border-black shadow-[4px_4px_0_#000] flex flex-col h-[500px] md:h-full">
      <div className="bg-[#e09f3e] border-b-4 border-black p-2 text-center text-[#540b0e] text-xs">
        CHAT LOG
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-[#2a4d56]">
        {chatHistory.map((msg, idx) => (
          <ChatMessage 
            key={idx} 
            msg={msg} 
            isMe={msg.sender === me?.name} /* <--- EXACT NAME MATCH LOGIC FIX */
            isSystem={msg.sender === 'SYSTEM'} 
          />
        ))}
        <div ref={chatRef} />
      </div>

      <div className="p-4 bg-[#540b0e] border-t-4 border-black">
        {phase === 'day' && isAlive ? (
          <form onSubmit={onSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="ACCUSE..."
              className="flex-1 bg-[#fff3b0] text-[#540b0e] border-4 border-black p-3 text-[10px] focus:outline-none focus:bg-white transition-colors"
            />
            <button type="submit" className="bg-[#e09f3e] text-[#540b0e] border-4 border-black px-4 shadow-[4px_4px_0_#000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none text-[10px]">
              SEND
            </button>
          </form>
        ) : (
          <div className="text-center text-[#9e2a2b] text-[10px] bg-[#fff3b0] border-4 border-black p-3 shadow-[4px_4px_0_#000]">
            {!isAlive ? "YOU ARE DEAD." : "CHAT LOCKED."}
          </div>
        )}
      </div>
    </div>
  );
}