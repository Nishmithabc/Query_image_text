from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

from nltk.tokenize import sent_tokenize

def chunk_text(text, chunk_size=3):
    sents = sent_tokenize(text)
    return [" ".join(sents[i:i+chunk_size]) 
            for i in range(0, len(sents), chunk_size)]


def build_index(text: str, doc_id: str):

    # 1️⃣ Chunk text
    chunks = chunk_text(text)

    if not chunks:
        return

    processed_chunks = [c.lower().strip() for c in chunks]

    # 2️⃣ Convert to embeddings
    embeddings = embed_model.encode(processed_chunks)

    # 3️⃣ Normalize for cosine similarity
    faiss.normalize_L2(embeddings)

    # 4️⃣ Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(np.array(embeddings))

    # 5️⃣ Save index + chunks
    index_path = f"data/{doc_id}.faiss"
    chunk_path = f"data/{doc_id}.pkl"

    faiss.write_index(index, index_path)

    with open(chunk_path, "wb") as f:
        pickle.dump(chunks, f)

    return doc_id
