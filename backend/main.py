from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import GameState, Player
import random

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store (MVP)
game_state = GameState()

@app.post("/start-game")
async def start_game(user_name: str = "Human"):
    global game_state
    
    # Random role assignment (1 Mafia, 4 Villagers)
    roles = ["Mafia", "Villager", "Villager", "Villager", "Villager"]
    random.shuffle(roles)
    
    # Create Human Player
    players = [Player(id="p1", name=user_name, role=roles[0])]
    
    # Create AI Agents
    ai_names = ["Bot_Alpha", "Bot_Beta", "Bot_Gamma", "Bot_Delta"]
    for i, name in enumerate(ai_names):
        players.append(Player(id=f"p{i+2}", name=name, role=roles[i+1]))
        
    game_state = GameState(
        players=players,
        phase="day"
    )
    return game_state

@app.get("/state")
async def get_state():
    return game_state