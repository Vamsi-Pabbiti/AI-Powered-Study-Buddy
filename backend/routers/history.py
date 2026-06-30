from fastapi import APIRouter, Depends
from utils.auth_utils import get_current_user
from utils.database import get_db

router = APIRouter()

@router.get("/")
async def get_history(user_id: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.history.find({"user_id": user_id}).sort("created_at", -1).limit(30)
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return {"history": history}

@router.delete("/{item_id}")
async def delete_history_item(item_id: str, user_id: str = Depends(get_current_user)):
    from bson import ObjectId
    db = get_db()
    await db.history.delete_one({"_id": ObjectId(item_id), "user_id": user_id})
    return {"message": "Deleted"}