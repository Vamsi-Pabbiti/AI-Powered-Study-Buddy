from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ExplainRequest(BaseModel):
    topic: str
    level: str = "simple"  # simple | medium | advanced

class SummarizeRequest(BaseModel):
    notes: str
    style: str = "bullets"  # bullets | paragraph | key_points

class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5
    difficulty: str = "medium"

class FlashcardRequest(BaseModel):
    topic: str
    num_cards: int = 8