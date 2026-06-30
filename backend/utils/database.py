from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
client = None
db = None

async def connect_db():
    global client, db
    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME")
    if not mongo_url or not db_name:
        raise RuntimeError("MONGO_URL and DB_NAME must be set in backend/.env")

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    print("MongoDB connected")

def get_db():
    return db
