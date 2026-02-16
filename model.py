import google.generativeai as genai
genai.configure(api_key="AIzaSyCxBEcy89KVML7IhybHqInH8j7drLfaYAI")

for m in genai.list_models():
    print(m.name, m.supported_generation_methods)
