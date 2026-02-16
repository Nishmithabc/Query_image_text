from embedd import embed_model, index
from c import chunks
import numpy as np
import ollama

SIM_THRESHOLD = 0.6

SYSTEM_PROMPT = """
You are a closed-book assistant.
Answer ONLY using the provided context.
Paraphrase naturally based on the question.
If the answer is not explicitly in the context, reply exactly:
"This content does not contain information to answer that question."
Do not add external knowledge.
"""

def chatbot(query):
    q_emb = embed_model.encode([query])
    distances, indices = index.search(np.array(q_emb), k=1)

    best_chunk = chunks[indices[0][0]]
    similarity = 1 / (1 + distances[0][0])

    if similarity < SIM_THRESHOLD:
        return "This content does not contain information to answer that question."

    prompt = f"""
{SYSTEM_PROMPT}

Context:
{best_chunk}

Question:
{query}
"""

    response = ollama.chat(
    model='mistral',
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Context:\n{best_chunk}\n\nQuestion: {query}"}
    ],
    options=
        {"temperature": 0.2}
    
)

    return response['message']['content']



if __name__ == "__main__":
    while True:
        user_input = input("Ask a question (or 'exit' to quit): ")
        if user_input.lower() == 'exit':
            break
        answer = chatbot(user_input)
        print("Answer:", answer)
