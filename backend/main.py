from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import random
from typing import List, Optional
import time

app = FastAPI(title="Aegis.AI Backend Pipeline")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock databases
mock_feed = [
    {"id": 1, "type": "apk", "title": "Groww_v4.2.apk", "source": "Telegram: @crypto_signals", "risk": "critical", "time": "Just now"},
    {"id": 2, "type": "video", "title": "elon_musk_giveaway.mp4", "source": "WhatsApp Bot", "risk": "high", "time": "2 mins ago"},
    {"id": 3, "type": "apk", "title": "Zerodha_Kite_Clone.apk", "source": "Telegram: @fx_trading", "risk": "critical", "time": "5 mins ago"},
    {"id": 4, "type": "review", "title": "Synthetic Review Swarm", "source": "Play Store (Mock)", "risk": "medium", "time": "12 mins ago"},
]

stats = {
    "analyzed_apks": 15402,
    "malicious_clones": 842,
    "deepfakes_detected": 4291,
    "tcr_nodes": 124
}

class SystemStats(BaseModel):
    analyzed_apks: int
    malicious_clones: int
    deepfakes_detected: int
    tcr_nodes: int

@app.get("/")
def read_root():
    return {"message": "Aegis.AI Threat Intelligence API is running."}

@app.get("/api/stats", response_model=SystemStats)
def get_stats():
    # Simulate slightly changing stats for the live demo effect
    return {
        "analyzed_apks": stats["analyzed_apks"] + random.randint(0, 5),
        "malicious_clones": stats["malicious_clones"] + random.randint(0, 1),
        "deepfakes_detected": stats["deepfakes_detected"] + random.randint(0, 2),
        "tcr_nodes": stats["tcr_nodes"]
    }

@app.get("/api/feed")
def get_feed():
    return mock_feed

@app.post("/api/analyze/apk")
async def analyze_apk(file: UploadFile = File(...)):
    # Mocking the Behavioral Analysis Engine
    await asyncio.sleep(2)  # Simulate processing delay
    
    # Mock extracted permissions from AndroidManifest.xml
    permissions = [
        {"name": "SYSTEM_ALERT_WINDOW", "weight": 0.85, "status": "Anomalous"},
        {"name": "BIND_ACCESSIBILITY_SERVICE", "weight": 0.92, "status": "Anomalous"},
        {"name": "READ_SMS", "weight": 0.70, "status": "Suspicious"},
        {"name": "INTERNET", "weight": 0.10, "status": "Standard"}
    ]
    
    probability = round(random.uniform(85.0, 99.0), 2)
    
    return {
        "filename": file.filename,
        "status": "Analysis Complete",
        "permissions_extracted": permissions,
        "xgboost_probability": probability,
        "siamese_ui_match": 98.7,
        "threat_level": "CRITICAL"
    }

@app.post("/api/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    # Mocking Deepfake Detection (Optical Flow & Face X-ray)
    await asyncio.sleep(3)
    
    return {
        "filename": file.filename,
        "status": "Analysis Complete",
        "optical_flow_anomalies": True,
        "face_xray_boundary_detected": True,
        "temporal_inconsistency_score": round(random.uniform(0.75, 0.99), 2),
        "mesoinception_probability": round(random.uniform(88.0, 99.9), 2),
        "classification": "DEEPFAKE"
    }

# Background task to mock Telegram scraper injecting new items
def scrape_telegram_mock():
    # In a real app this would use Telethon
    pass
