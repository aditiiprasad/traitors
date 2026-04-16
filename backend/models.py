from pydantic import BaseModel
from typing import List

class Player(BaseModel):
    id: str
    name: str
    role: str
    alive: bool = True
    suspicion_score: int = 0

class GameState(BaseModel):
    players: List[Player] = []
    chat_history: List[dict] = []
    round: int = 1
    phase: str = "setup" # setup, night, day, voting