from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ExplainRequest(BaseModel):
    topic: str
    level: str = "simple"

class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5
    difficulty: str = "medium"

class FlashcardRequest(BaseModel):
    topic: str
    num_cards: int = 8