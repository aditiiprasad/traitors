import os
from groq import Groq
from dotenv import load_dotenv
from prompts import get_system_prompt

# Load the .env file
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_ai_response(player, players_list, chat_history):
    # Hide Mafia identities from the AI if it is a Villager
    players_str = ", ".join([
        f"{p.name} ({p.role if player.role == 'Mafia' or p.id == player.id else 'Unknown'})" 
        for p in players_list if p.alive
    ])
    
    # Format the last 10 messages for context
    chat_str = "\n".join([f"{msg['sender']}: {msg['message']}" for msg in chat_history[-10:]])

    # Assign a simple personality based on role
    personality = "Aggressive and analytical" if player.role == "Villager" else "Defensive and manipulative"

    prompt = get_system_prompt(player.role, personality, players_str, chat_str)

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant", 
            temperature=0.8,
            max_tokens=100,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq API Error: {e}")
        return "Uh... I lost my train of thought."