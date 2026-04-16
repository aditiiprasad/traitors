import { useState } from 'react';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* HEADER */}
      <h1 className="text-5xl md:text-7xl text-[#e09f3e] mb-12 text-center tracking-widest" style={{ textShadow: '6px 6px 0 #000' }}>
        TRAITORS
      </h1>

      <div className="flex gap-4 mb-8">
        <a
          href="https://github.com/aditiiprasad/traitors"
          target="_blank"
          className="bg-[#335c67] text-[#fff3b0] border-4 border-black px-4 py-2 text-xs shadow-[4px_4px_0_#000] hover:bg-[#2a4d56]"
        >
          GITHUB
        </a>

        <a
          href="https://linkedin.com/in/aditiiprasad"
          target="_blank"
          className="bg-[#e09f3e] text-[#540b0e] border-4 border-black px-4 py-2 text-xs shadow-[4px_4px_0_#000] hover:bg-[#fff3b0]"
        >
          LINKEDIN
        </a>
      </div>

      {/* 2-COLUMN MAIN MENU GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

        {/* LEFT COLUMN: START GAME BOX */}
        <div className="bg-[#540b0e] p-8 border-4 border-black shadow-[8px_8px_0_#000] h-fit flex flex-col justify-center">
          <h2 className="text-xl text-[#fff3b0] mb-8 text-center leading-loose">
            ENTER THE PALACE
          </h2>

          <input
            type="text"
            placeholder="ENTER NAME..."
            className="w-full bg-[#fff3b0] text-[#540b0e] border-4 border-black p-4 mb-6 text-sm focus:outline-none focus:bg-white placeholder-[#9e2a2b] transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />

          <button
            onClick={() => onStart(name || 'PLAYER')}
            className="w-full bg-[#e09f3e] text-[#540b0e] border-4 border-black p-5 text-base font-black shadow-[4px_4px_0_#000] hover:bg-[#fff3b0] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-none"
          >
            START GAME
          </button>
        </div>

        {/* RIGHT COLUMN: ACTIONS & INSTRUCTIONS */}
        <div className="flex flex-col gap-6 h-fit">

          {/* TOP BIG BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#9e2a2b] text-[#fff3b0] border-4 border-black p-6 text-sm md:text-base leading-loose shadow-[6px_6px_0_#000] 
  hover:bg-red-700 
  
  active:translate-y-[4px] active:translate-x-[4px] active:shadow-none 
  uppercase tracking-widest"
          >
            <span className="blink">HOW THIS PROJECT WAS MADE ?</span>
          </button>

          {/* BOTTOM INSTRUCTION CARD */}
          <div className="bg-[#e09f3e] p-6 border-4 border-black shadow-[6px_6px_0_#000] text-[#540b0e]">
            <h2 className="text-base font-black border-b-4 border-[#540b0e] pb-2 mb-4 text-center tracking-widest">
              HOW TO PLAY
            </h2>
            <ul className="text-xs space-y-4 leading-relaxed">
              <li>🕵️ <strong className="text-black">ROLES:</strong> Secretly assigned as Innocent or Traitor.</li>
              <li>💬 <strong className="text-black">DAY PHASE:</strong> 90s to chat, interrogate, and deceive the AI.</li>
              <li>🗳️ <strong className="text-black">VOTING:</strong> 30s to banish the most suspicious player.</li>
              <li>🌙 <strong className="text-black">NIGHT:</strong> Traitors secretly eliminate an Innocent.</li>
              <li className="bg-[#fff3b0] p-2 border-2 border-black mt-4 text-center uppercase tracking-widest">
                TRUST NO ONE.
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* THE MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">

          <div className="bg-[#fff3b0] p-6 md:p-10 border-4 border-black shadow-[12px_12px_0_#e09f3e] max-w-3xl w-full text-[#540b0e] relative max-h-[90vh] flex flex-col">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#9e2a2b] text-[#fff3b0] border-4 border-black w-12 h-12 flex items-center justify-center text-xl shadow-[4px_4px_0_#000] hover:bg-red-600 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none z-10"
            >
              X
            </button>

            <h2 className="text-lg md:text-xl mb-6 border-b-4 border-black pb-4 text-center leading-loose">
              DEEP DIVE: EXPLANATIONS & ARCHITECTURE
            </h2>

            {/* SCROLLABLE MODAL CONTENT */}
            <div className="space-y-8 text-[10px] md:text-xs leading-relaxed overflow-y-auto pr-4">

              <div>
                <h3 className="bg-[#335c67] text-[#fff3b0] inline-block px-3 py-2 border-2 border-black mb-3">
                  1. FILE ARCHITECTURE: WHAT IS DOING WHAT?
                </h3>
                <ul className="list-square pl-4 space-y-2">
                  <li><strong className="text-black">main.py:</strong> The master controller. Manages FastAPI routes, stores the global state (in-memory), tracks votes, and dictates the Day/Voting/Night phases.</li>
                  <li><strong className="text-black">agents.py:</strong> The LLM brain. Connects directly to the Groq API (Llama 3), executing rapid inference without heavy orchestration frameworks.</li>
                  <li><strong className="text-black">prompts.py:</strong> The context engine. Generates strict, variable-injected text strings to force the AI to adopt character personas and game rules.</li>
                  <li><strong className="text-black">React Frontend:</strong> A modular, state-driven UI featuring strict timers and asynchronous data polling.</li>
                </ul>
              </div>

              <div>
                <h3 className="bg-[#e09f3e] text-black inline-block px-3 py-2 border-2 border-black mb-3">
                  2. SYSTEM PROCESS FLOW
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Initialization:</strong> User connects. The backend deals 1 Traitor and 4 Innocent roles perfectly randomly.</li>
                  <li><strong>Discussion Loop:</strong> The UI polls the chat. The user types a message OR an autonomous 8-second AI heartbeat fires.</li>
                  <li><strong>Inference:</strong> The backend grabs the last 10-15 messages, injects them into the AI's prompt, and returns the contextual response.</li>
                  <li><strong>Voting Phase:</strong> AI agents are prompted to evaluate the chat history purely to extract the name of the most suspicious player. Votes are aggregated.</li>
                  <li><strong>Resolution:</strong> The most voted player is flagged `alive: false`. Win conditions are checked.</li>
                </ol>
              </div>

              <div>
                <h3 className="bg-[#9e2a2b] text-[#fff3b0] inline-block px-3 py-2 border-2 border-black mb-3">
                  3. REQUIREMENT MAPPING
                </h3>
                <ul className="space-y-3">
                  <li><strong className="text-black underline">Multi-Agent Interaction:</strong> Achieved by forcing different AI profiles (e.g., Elon Musk vs. Kabir Singh) to read a shared, global chat array.</li>
                  <li><strong className="text-black underline">Hidden Roles & Deception:</strong> Traitor prompts explicitly reveal roles to the Traitor AI, instructing it to lie and blend in. Innocent AIs receive masked "Unknown" roles.</li>
                  <li><strong className="text-black underline">No Agent Frameworks:</strong> Zero LangChain or AutoGPT. Built entirely on raw API calls, sliding-window memory arrays, and strict temperature control for tool-less agent autonomy.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}