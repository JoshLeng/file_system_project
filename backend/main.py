from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.api.routes import router
from fastapi.responses import FileResponse
import os

app = FastAPI()

# CORS - Configuración CORRECTA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

app.include_router(router)

# Montar carpeta storage para acceso directo a archivos
storage_path = "storage/uploads"
if not os.path.exists(storage_path):
    os.makedirs(storage_path, exist_ok=True)

app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# Montar carpeta frontend para archivos estáticos (CSS, JS)
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

@app.get("/")
def serve_frontend():
    return FileResponse("frontend/index.html")

@app.options("/{path:path}")
async def options_handler(path: str):
    """Manejar peticiones OPTIONS para CORS"""
    return {"message": "OK"}