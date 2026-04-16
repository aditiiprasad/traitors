from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel # Added this import
from models import GameState, Player
import random

# NEW IMPORTS
from agents import generate_ai_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game_state = GameState()

# (Keep your existing /start-game and /state endpoints here...)
@app.post("/start-game")
async def start_game(user_name: str = "Human"):
    global game_state
    roles = ["Mafia", "Villager", "Villager", "Villager", "Villager"]
    random.shuffle(roles)
    players = [Player(id="p1", name=user_name, role=roles[0])]
    ai_names = ["Bot_Alpha", "Bot_Beta", "Bot_Gamma", "Bot_Delta"]
    for i, name in enumerate(ai_names):
        players.append(Player(id=f"p{i+2}", name=name, role=roles[i+1]))
        
    game_state = GameState(players=players, phase="day")
    return game_state

@app.get("/state")
async def get_state():
    return game_state

# --- NEW ENDPOINT BELOW ---

class MessageInput(BaseModel):
    message: str

@app.post("/user-message")
async def user_message(msg: MessageInput):
    global game_state
    
    # 1. Add user message
    game_state.chat_history.append({"sender": "Human (You)", "message": msg.message})
    
    # 2. Let 1 or 2 random AI agents respond to keep the conversation flowing
    alive_ais = [p for p in game_state.players if p.alive and p.id != "p1"]
    
    if alive_ais:
        num_responders = random.randint(1, min(2, len(alive_ais)))
        responders = random.sample(alive_ais, num_responders)
        
        for ai in responders:
            ai_reply = generate_ai_response(ai, game_state.players, game_state.chat_history)
            game_state.chat_history.append({"sender": ai.name, "message": ai_reply})
            
    return game_state