import os
from groq import Groq
from dotenv import load_dotenv
from prompts import get_system_prompt, get_voting_prompt, get_mafia_target_prompt


# Load the .env file
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_ai_response(player, players_list, chat_history):
    # Hide Mafia identities from the AI if it is a Villager
    players_str = ", ".join([
        f"{p.name} ({p.role if player.role == 'Traitor' or p.id == player.id else 'Unknown'})" 
        for p in players_list if p.alive
    ])
    
    # Format the last 10 messages for context
    chat_str = "\n".join([f"{msg['sender']}: {msg['message']}" for msg in chat_history[-10:]])



    prompt = get_system_prompt(player.role, player.personality, players_str, chat_str)

    

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
    
from prompts import get_system_prompt, get_voting_prompt # Update your import at the top

def generate_ai_vote(player, players_list, chat_history):
    # Only list other alive players as valid targets
    valid_targets = [p for p in players_list if p.alive and p.id != player.id]
    players_str = ", ".join([p.name for p in valid_targets])
    
    # Grab the last 15 messages for context
    chat_str = "\n".join([f"{msg['sender']}: {msg['message']}" for msg in chat_history[-15:]])

    prompt = get_voting_prompt(player.role, players_str, chat_str)

    try:
        vote_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.2, # Low temperature so it doesn't get creative with names
            max_tokens=15,
        )
        vote_result = vote_completion.choices[0].message.content.strip()
        return vote_result
    except Exception as e:
        print(f"Vote Error: {e}")
        # Fallback: vote randomly if the API fails
        import random
        return random.choice(valid_targets).name if valid_targets else ""
    
def generate_mafia_target(mafia_player, players_list):
    # Valid targets are anyone who is alive and NOT mafia
    valid_targets = [p for p in players_list if p.alive and p.role != "Mafia"]
    players_str = ", ".join([p.name for p in valid_targets])

    prompt = get_mafia_target_prompt(players_str)

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "system", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.5,
            max_tokens=15,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Mafia Target Error: {e}")
        import random
        return random.choice(valid_targets).name if valid_targets else ""    