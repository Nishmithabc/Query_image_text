from fastapi import HTTPException, APIRouter
import pickle
import faiss
import numpy as np
import ollama
from sentence_transformers import SentenceTransformer
import os
from pydantic import BaseModel

router = APIRouter()
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

SIM_THRESHOLD = 0.5

SYSTEM_PROMPT = """
You are a closed-book assistant.
Answer ONLY using the provided context.
Paraphrase naturally based on the question.
If the answer is not explicitly in the context, reply exactly:
"This content does not contain information to answer that question."
Do not add external knowledge.
"""
class AskRequest(BaseModel):
    doc_id: str
    query: str

@router.post("/ask")
async def ask_question(request: AskRequest):
    doc_id = request.doc_id
    query = request.query
    index_path = f"data/{doc_id}.faiss"
    chunk_path = f"data/{doc_id}.pkl"

    if not os.path.exists(index_path) or not os.path.exists(chunk_path):
        raise HTTPException(status_code=404, detail="Document not found.")

    #Load FAISS index
    index = faiss.read_index(index_path)

    # Load chunks
    with open(chunk_path, "rb") as f:
        chunks = pickle.load(f)

    # 🔎 Embed query
    q_emb = embed_model.encode([query])
    faiss.normalize_L2(q_emb)
    q_emb = np.array(q_emb).astype("float32")

    # 🔍 Search top 1 match
    distances, indices = index.search(q_emb, k=1)

    best_chunk = chunks[indices[0][0]]
    similarity = distances[0][0]

    # ❌ If similarity too low
    if similarity < SIM_THRESHOLD:
        return {
            "answer": "This content does not contain information to answer that question."
        }

    # 🤖 Call Ollama
    response = ollama.chat(
        model="mistral",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Context:\n{best_chunk}\n\nQuestion: {query}"
            }
        ],
        options={"temperature": 0.2}
    )

    return {
        "answer": response["message"]["content"],
        "similarity": float(similarity)
    }
