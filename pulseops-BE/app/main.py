from dotenv import load_dotenv

load_dotenv()
from app.features.ai.router import router as ai_router
from app.features.alerts.router import router as alerts_router
from app.features.appointments.router import router as appointments_router
from app.features.auth.router import router as auth_router
from app.features.beds.router import router as beds_router
from app.features.billing.router import router as billing_router
from app.features.dashboard.router import router as dashboard_router
from app.features.departments.router import router as departments_router
from app.features.inventory.router import router as inventory_router
from app.features.patients.router import router as patients_router
from app.features.settings.router import router as settings_router
from app.features.staff.router import router as staff_router
from app.features.users.router import router as users_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PulseOps AI", version="1.0.0")

app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(users_router)
app.include_router(departments_router)
app.include_router(staff_router)
app.include_router(appointments_router)
app.include_router(beds_router)
app.include_router(alerts_router)
app.include_router(billing_router)
app.include_router(inventory_router)
app.include_router(dashboard_router)
app.include_router(settings_router)
app.include_router(ai_router)


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
