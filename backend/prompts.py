def get_system_prompt(role: str, personality: str, players: str, chat_history: str) -> str:
    return f"""You are a player in a Mafia game.

Game Rules:
- Some players are secretly Mafia.
- Others are Villagers trying to find the Mafia.
- You must act according to your role.

Your Role: {role}
Your Personality: {personality}

Instructions:
- Speak naturally like a human playing a casual web game.
- Be concise (1 to 3 sentences max).
- Use the past chat context to agree, disagree, or accuse.
- If Mafia: Lie strategically, deflect suspicion, accuse others.
- If Villager: Detect suspicious behavior, justify accusations based on the chat.

Players Alive: {players}
Chat History: {chat_history}

Respond with ONLY your chat message. Do not include your name or any actions."""

def get_voting_prompt(role: str, players: str, chat_history: str) -> str:
    return f"""Based on the conversation below, vote for the MOST suspicious player.

Game Rules:
- If you are Mafia, try to vote for Villagers. Do NOT vote for other Mafia members.
- If you are a Villager, vote for who you think is lying.

Your Role: {role}
Players Alive: {players}

Chat History:
{chat_history}

Return ONLY the exact name of the player you are voting for. No explanation, no punctuation."""