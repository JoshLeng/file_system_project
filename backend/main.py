from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router

app = FastAPI()

# CORS - Configuración CORRECTA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

app.include_router(router)

@app.options("/{path:path}")
async def options_handler(path: str):
    """Manejar peticiones OPTIONS para CORS"""
    return {"message": "OK"}