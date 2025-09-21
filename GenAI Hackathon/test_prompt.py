import google.generativeai as genai 
import os 
import json
from dotenv import load_dotenv 
import time
import logging
import re

def clean_response(respo):
  cleaned=re.sub(r"^'''(?:json)?\s","", respo.strip())
  cleaned=re.sub(r"\s*'''$", "", cleaned)
  return cleaned

logging.basicConfig(
  filename="misinfo_log.txt",
  level=logging.INFO,
  format="%(asctime)s - %(levelname)s - %(message)s"
)

load_dotenv()

api_key=os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Load Gemini 1.5 Flash
model = genai.GenerativeModel("gemini-1.5-flash")

def prompt_runner(input, retries=3, delay=2):
  # Base prompt
  prompt_template = """
  You are an assistant which helps detect misinformation. I will give you phrases/text which you will run background checks on and return an output in the following JSON format. Respond with **only raw JSON**. Do not add explanations, markdown, or code block fences.
  {{
    "score": "0-100 (0 = entirely correct, 100 = entirely false)",
    "category": "example: misleading, hate-speech, etc.",
    "explanation": "max 2 sentences, <= 30 words",
    "tip": "how the user can check credibility of this claim",
    "flags": "[reasons why flagged, can be multiple]"
  }}

  Example Input: {user_input}
  """
  prompt=prompt_template.format(user_input=input)

  for attempt in range(retries):
    response=model.generate_content(prompt)
    cleaned_resp=clean_response(response.text)

    try:
      return json.loads(cleaned_resp)
    except json.JSONDecodeError:
      if attempt<retries-1:
        time.sleep(delay)
        continue
      else:
        return {"error":"Invalid JSON returned","raw":response.text}
      