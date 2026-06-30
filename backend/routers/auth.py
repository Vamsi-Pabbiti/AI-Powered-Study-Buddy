from fastapi import APIRouter, HTTPException
from models.schemas import RegisterRequest, LoginRequest
from utils.auth_utils import hash_password, verify_password, create_access_token
from utils.database import get_db
from datetime import datetime

router = APIRouter()

@router.post("/register")
async def register(req: RegisterRequest):
    db = get_db()
    if await db.users.find_one({"email": req.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await db.users.insert_one({
        "name": req.name, "email": req.email,
        "password": hash_password(req.password),
        "created_at": datetime.utcnow()
    })
    token = create_access_token({"sub": str(result.inserted_id)})
    return {"access_token": token, "user_name": req.name}

@router.post("/login")
async def login(req: LoginRequest):
    db = get_db()
    user = await db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "user_name": user["name"]}