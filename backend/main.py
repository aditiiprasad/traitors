from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import GameState, Player
import random
from agents import generate_ai_response, generate_ai_vote, generate_mafia_target

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

game_state = GameState()

@app.post("/start-game")
async def start_game(user_name: str = "Player"):
    global game_state
    
    # 100% Fair Randomization: User has an equal chance of being a Traitor
    roles = ["Traitor", "Innocent", "Innocent", "Innocent", "Innocent"]
    random.shuffle(roles) 
    
    players = [Player(id="p1", name=user_name, role=roles[0], personality="Human")]
    
    ai_names = ["Kabir Singh", "Kim Kardashian", "Lalu Prasad Yadav", "Elon Musk"]
    personalities = [
        "Kabir Singh: Aggressive, passionate, uses intense and slightly angry language, deeply suspicious.",
        "Kim Kardashian: Obsessed with drama and aesthetics, uses filler words like 'literally' and 'like', constantly shocked.",
        "Lalu Prasad Yadav: Rustic, funny, uses political analogies and unique idioms, highly observant.",
        "Elon Musk: Arrogant, talks about Mars, X, and logic, acts like the smartest person in the room."
    ]
    
    for i, name in enumerate(ai_names):
        players.append(Player(id=f"p{i+2}", name=name, role=roles[i+1], personality=personalities[i]))
        
    game_state = GameState(
        players=players,
        phase="day",
        chat_history=[{"sender": "SYSTEM", "message": "--- DAY 1: WELCOME TO THE PALACE ---"}]
    )
    return game_state

@app.get("/state")
async def get_state():
    return game_state

class MessageInput(BaseModel):
    message: str

@app.post("/user-message")
async def user_message(msg: MessageInput):
    global game_state
    user = next((p for p in game_state.players if p.id == "p1"), None)
    user_name = user.name if user else "Human"
    
    game_state.chat_history.append({"sender": user_name, "message": msg.message})
    
    alive_ais = [p for p in game_state.players if p.alive and p.id != "p1"]
    if alive_ais:
        num_responders = random.randint(1, min(2, len(alive_ais)))
        responders = random.sample(alive_ais, num_responders)
        for ai in responders:
            ai_reply = generate_ai_response(ai, game_state.players, game_state.chat_history)
            game_state.chat_history.append({"sender": ai.name, "message": ai_reply})
            
    return game_state

class VoteInput(BaseModel):
    voted_for_id: str

@app.post("/start-voting")
async def start_voting():
    global game_state
    game_state.phase = "voting"
    game_state.vote_history = [] # Clear old votes
    game_state.chat_history.append({"sender": "SYSTEM", "message": "Time is up! Who is the Traitor?"})
    return game_state

@app.post("/vote")
async def process_votes(vote: VoteInput):
    global game_state
    vote_tally = {}
    vote_details = []
    
    # Process Human Vote
    target_human = next((p for p in game_state.players if p.id == vote.voted_for_id), None)
    human_name = next((p.name for p in game_state.players if p.id == "p1"), "You")
    if target_human:
        vote_tally[target_human.id] = 1
        vote_details.append({"voter": human_name, "voted_for": target_human.name})
    
    alive_ais = [p for p in game_state.players if p.alive and p.id != "p1"]
    for ai in alive_ais:
        ai_vote_name = generate_ai_vote(ai, game_state.players, game_state.chat_history)
        target = next((p for p in game_state.players if p.name.lower() in ai_vote_name.lower()), None)
        if target:
            vote_tally[target.id] = vote_tally.get(target.id, 0) + 1
            vote_details.append({"voter": ai.name, "voted_for": target.name})
            
    game_state.vote_history = vote_details # Save to state for UI
    
    if vote_tally:
        eliminated_id = max(vote_tally, key=vote_tally.get)
        for p in game_state.players:
            if p.id == eliminated_id:
                p.alive = False
                game_state.chat_history.append({"sender": "SYSTEM", "message": f"{p.name} was banished! They were a {p.role}."})
                
    game_state.phase = "night"
    check_win_condition()
    return game_state

def check_win_condition():
    global game_state
    alive_traitors = [p for p in game_state.players if p.alive and p.role == "Traitor"]
    alive_innocents = [p for p in game_state.players if p.alive and p.role == "Innocent"]

    if len(alive_traitors) == 0:
        game_state.phase = "game_over"
        return True
    elif len(alive_traitors) >= len(alive_innocents):
        game_state.phase = "game_over"
        return True
    return False

@app.post("/run-night")
async def run_night():
    global game_state
    alive_traitors = [p for p in game_state.players if p.alive and p.role == "Traitor"]
    
    if alive_traitors:
        traitor = alive_traitors[0]
        if traitor.id == "p1":
            valid_targets = [p for p in game_state.players if p.alive and p.role != "Traitor"]
            import random
            target = random.choice(valid_targets) if valid_targets else None
        else:
            target_name = generate_mafia_target(traitor, game_state.players)
            target = next((p for p in game_state.players if p.name.lower() in target_name.lower()), None)

        if target:
            target.alive = False
            game_state.chat_history.append({"sender": "SYSTEM", "message": f"🌙 The Palace wakes up... {target.name} was eliminated."})

    is_over = check_win_condition()
    if not is_over:
        game_state.phase = "day"
        game_state.round += 1
        game_state.chat_history.append({"sender": "SYSTEM", "message": f"--- ROUND {game_state.round} STARTS ---"})

    return game_state