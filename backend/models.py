from pydantic import BaseModel
from typing import List, Dict, Optional

class Player(BaseModel):
    id: str
    name: str
    role: str
    alive: bool = True
    suspicion_score: int = 0
    personality: str = "Neutral"

class GameState(BaseModel):
    players: List[Player] = []
    chat_history: List[dict] = []
    round: int = 1
    phase: str = "setup"
    vote_history: List[dict] = [] 