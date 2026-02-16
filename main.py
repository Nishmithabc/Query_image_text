
from answer import chatbot

while True:
    q = input("Ask: ")
    if q.lower() == "exit":
        break
    print("Bot:", chatbot(q))
