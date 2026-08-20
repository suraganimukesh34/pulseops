from dotenv import load_dotenv

load_dotenv()
from app.features.auth.router import router as auth_router
from app.features.patients.router import router as patients_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PulseOps AI", version="1.0.0")

app.include_router(auth_router)
app.include_router(patients_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True,
)


@app.get("/")
def root():
    return {"message": "Welcome to PulseOps AI Backend"}
