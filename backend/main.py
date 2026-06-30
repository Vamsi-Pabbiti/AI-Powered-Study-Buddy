from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, ai, history
from utils.database import connect_db

app = FastAPI(title="AI Study Buddy", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await connect_db()

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(history.router, prefix="/api/history", tags=["History"])

@app.get("/")
def root():
    return {"message": "AI Study Buddy API is running"}