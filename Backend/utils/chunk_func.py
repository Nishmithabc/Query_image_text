from nltk.tokenize import sent_tokenize

def chunk_text(text, chunk_size=3):
    sents = sent_tokenize(text)
    return [" ".join(sents[i:i+chunk_size]) 
            for i in range(0, len(sents), chunk_size)]
