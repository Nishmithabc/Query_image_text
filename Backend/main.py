from fastapi import FastAPI
from routes import text_extraction, ask, delete_img
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text_extraction.router, prefix="/text-extraction", tags=["Text Extraction"])
app.include_router(ask.router, prefix="/ask", tags=["Ask"])
app.include_router(delete_img.router, prefix="/delete", tags=["Delete Document"])   