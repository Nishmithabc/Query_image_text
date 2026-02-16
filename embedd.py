from c import chunks
from sentence_transformers import SentenceTransformer
import faiss, numpy as np

embed_model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = embed_model.encode(chunks)

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))
