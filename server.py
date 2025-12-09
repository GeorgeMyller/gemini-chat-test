import os
import uvicorn
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class ChatRequest(BaseModel):
    message: str
    apiKey: str
    model: str = "gemini-2.0-flash-exp"

class ModelsRequest(BaseModel):
    apiKey: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not request.apiKey:
        raise HTTPException(status_code=400, detail="API Key is required")

    try:
        genai.configure(api_key=request.apiKey)
        model = genai.GenerativeModel(request.model)
        
        # Determine strictness for older models vs newer
        # This is a basic configuration.
        response = model.generate_content(request.message)
        
        return {"response": response.text}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/models")
async def list_models(request: ModelsRequest = Body(...)):
    """List available Gemini models"""
    if not request.apiKey:
        raise HTTPException(status_code=400, detail="API Key is required")
    
    try:
        genai.configure(api_key=request.apiKey)
        # List models that support generateContent
        models = []
        for m in genai.list_models():
             if 'generateContent' in m.supported_generation_methods:
                 models.append(m.name)
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount static files
app.mount("/", StaticFiles(directory="src/static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
