# import os
# import requests
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv
# from openai import OpenAI
# import time

# load_dotenv()

# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# app = Flask(__name__)
# CORS(app)

# client = OpenAI(api_key=OPENAI_API_KEY)

# def split_into_verses_and_lines(text: str) -> str:
#     prompt = f"""
#     הטקסט הבא הוא שיר בעברית. אנא חלק אותו לבתים ולשורות כך שכל בית יהיה מופרד על ידי שורה ריקה, וכל שורה תישאר כפי שהיא.
#     טקסט:
#     {text}
#     """

#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=[
#             {"role": "system", "content": "אתה עוזר לחלק שירים בעברית לבתים ולשורות בהתאם למבנה שלהם."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0,
#         max_tokens=1000,
#     )
#     return response.choices[0].message.content.strip()

# @app.route('/transcribe', methods=['POST'])
# def transcribe_audio_url():
#     data = request.get_json()
#     song_url = data.get("url")
#     if not song_url:
#         return jsonify({'error': 'Missing song URL'}), 400

#     # הורדת הקובץ מה-URL
#     audio_file = requests.get(song_url)
#     if audio_file.status_code != 200:
#         return jsonify({'error': 'Unable to download the audio file'}), 400

#     # שמירת הקובץ זמנית
#     with open("temp_audio.mp3", "wb") as f:
#         f.write(audio_file.content)

#     # שליחת הקובץ ל-OpenAI Whisper
#     whisper_url = "https://api.openai.com/v1/audio/transcriptions"
#     headers = {
#         "Authorization": f"Bearer {OPENAI_API_KEY}"
#     }
#     files = {
#         "file": open("temp_audio.mp3", "rb")
#     }
#     data = {
#         "model": "whisper-1",
#         "language": "he",
#         "response_format": "json"
#     }

#     response = requests.post(whisper_url, headers=headers, data=data, files=files)

#     if response.status_code != 200:
#         return jsonify({'error': 'Transcription failed', 'details': response.text}), response.status_code

#     original_text = response.json().get("text", "")
#     print("Original text:", original_text)
#     structured_text = split_into_verses_and_lines(original_text)
#     print("Structured text:", structured_text)

#     return jsonify({
#         "original": original_text,
#         "corrected_lyrics": structured_text
#     })

# if __name__ == '__main__':
#     app.run(debug=True)


# import os
# import requests
# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# from openai import OpenAI
# import time
# from flask_cors import CORS


 

# # טוען משתני סביבה
# load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

# client = OpenAI(api_key=OPENAI_API_KEY)

# app = Flask(__name__)
# CORS(app) 

# def correct_lyrics(text: str) -> str:
#     prompt = f"""
# הטקסט הבא הוא תמלול של שיר . הוא עשוי להכיל טעויות כתיב, טעויות תחביר וגם מילים לא תקינות או לא מתאימות. 
# תקן אותו לעברית תקנית, זורמת, ומדויקת — כולל תיקון מילים שגויות או לא תקינות.
# שמור על המשקל, הרגש והמשמעות של השיר, ואל תשנה את המבנה השירי (שורות, בתים). אל תוסיף מילים חדשות ואל תוריד שורות שלמות.

# ---
# {text}
# ---
# """

#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=[
#             {"role": "system", "content": "אתה עורך שירים בעברית באופן שמכבד את המקצב, הרגש והמשמעות."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.4,
#         max_tokens=1000
#     )

#     return response.choices[0].message.content

# def transcribe_audio(upload_url: str) -> str:
#     headers = {
#         'authorization': ASSEMBLYAI_API_KEY,
#         'content-type': 'application/json'
#     }
#     json_data = {
#         'audio_url': upload_url,
#         'language_code': 'he',
#         'speech_model': 'nano'
#     }

#     # בקשת תמלול
#     response = requests.post('https://api.assemblyai.com/v2/transcript', headers=headers, json=json_data)
#     response.raise_for_status()
#     transcript_id = response.json()['id']

#     # בדיקת סטטוס עד שהתמלול מוכן
#     while True:
#         check_response = requests.get(f'https://api.assemblyai.com/v2/transcript/{transcript_id}', headers=headers)
#         check_response.raise_for_status()
#         status_data = check_response.json()
#         if status_data['status'] == 'completed':
#             return correct_lyrics(status_data['text'])
#         elif status_data['status'] == 'failed':
#             raise Exception('Transcription failed')
#         time.sleep(2)

# @app.route('/transcribe', methods=['POST'])
# def handle_transcription():
#     data = request.get_json()
#     audio_url = data.get('url')
#     if not audio_url:
#         return jsonify({'error': 'Missing audio URL'}), 400

#     try:
#         result = transcribe_audio(audio_url)
#         return jsonify({'corrected_lyrics': result})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

# import os
# import requests
# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# from openai import OpenAI
# import tempfile
# from flask_cors import CORS

# # טוען משתני סביבה
# load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# client = OpenAI(api_key=OPENAI_API_KEY)

# app = Flask(__name__)
# CORS(app)

# def correct_lyrics(text: str) -> str:
#     prompt = f"""
#     החזר את השיר בצורה נקייה וברורה, מבלי להוסיף טקסט מסביר.
# הטקסט הבא הוא תמלול של שיר . הוא עשוי להכיל טעויות כתיב, טעויות תחביר וגם מילים לא תקינות או לא מתאימות. 
# תקן אותו לעברית תקנית, זורמת, ומדויקת — כולל תיקון מילים שגויות או לא תקינות.
# שמור על המשקל, הרגש והמשמעות של השיר. אל תוסיף מילים חדשות ואל תוריד שורות שלמות.
# ובנוסף - 

# אנא בצע את הפעולות הבאות:
# 1. חלק את הטקסט לשורות שיר ברורות – כל שורה בשורה חדשה.
# 2. חלק את השורות לבתים – כל בית מופרד על ידי שורה ריקה.
# 3. תקן את הטעויות בשיר כך שיהיה כתוב בעברית תקנית וזורמת, אך שמור על המשקל, הרגש והמשמעות של השיר.
# 4. אל תוסיף שורות או מילים חדשות, ואל תסיר שורות שלמות.


# ---
# {text}
# ---
# """

#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=[
#             {"role": "system", "content": "אתה עורך שירים בעברית באופן שמכבד את המקצב, הרגש והמשמעות."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.4,
#         max_tokens=1000
#     )

#     return response.choices[0].message.content


# def transcribe_with_whisper(audio_url: str) -> str:
#     # הורדת קובץ זמנית
#     audio_data = requests.get(audio_url)
#     audio_data.raise_for_status()

#     with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
#         temp_audio.write(audio_data.content)
#         temp_audio_path = temp_audio.name

#     # שליחת הקובץ ל־Whisper API
#     with open(temp_audio_path, "rb") as audio_file:
#         transcript = client.audio.transcriptions.create(
#             model="whisper-1",
#             file=audio_file,
#             language="he"
#         )
    
#     os.remove(temp_audio_path)  # ניקוי קובץ זמני

#     return correct_lyrics(transcript.text)

# @app.route("/")
# def index():
#     return "השרת פועל! 🎵"

# @app.route('/transcribe', methods=['POST'])
# def handle_transcription():
#     data = request.get_json()
#     audio_url = data.get('url')
#     if not audio_url:
#         return jsonify({'error': 'Missing audio URL'}), 400

#     try:
#         corrected_text = transcribe_with_whisper(audio_url)
#         return jsonify({'corrected_lyrics': corrected_text})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# if __name__ == '__main__':
#     app.run(debug=True)





import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import tempfile
from flask_cors import CORS

# טוען משתני סביבה
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
def detect_language(text: str) -> str:
    prompt = f"באיזו שפה כתוב הטקסט הבא? רק תגיד את שם השפה במילה אחת (למשל: עברית, אנגלית, ספרדית וכו').\n\n{text}"
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "אתה מזהה שפות של טקסטים."},
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        max_tokens=10
    )

    return response.choices[0].message.content.strip().lower()
def correct_lyrics(text: str) -> str:
    prompt = f"""
הטקסט הבא הוא תמלול של שיר. הוא עשוי להכיל טעויות כתיב, טעויות תחביר וגם מילים לא תקינות או לא מתאימות. 
תקן אותו לשפה בה הוא כתוב, כך שיהיה כתוב בצורה תקנית, זורמת ומדויקת – כולל תיקון מילים שגויות או לא תקינות.
שמור על המשקל, הרגש והמשמעות של השיר. אל תוסיף מילים חדשות ואל תוריד שורות שלמות.

אנא בצע את הפעולות הבאות:
1. חלק את הטקסט לשורות שיר ברורות – כל שורה בשורה חדשה.
2. חלק את השורות לבתים – כל בית מופרד על ידי שורה ריקה.
3. תקן את הטעויות כך שיהיה כתוב בצורה תקנית וזורמת, אך שמור על המשקל, הרגש והמשמעות של השיר.
4. אל תוסיף שורות או מילים חדשות, ואל תסיר שורות שלמות.

---
{text}
---
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "אתה עורך שירים בכל שפה, באופן שמכבד את המקצב, הרגש והמשמעות."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=1000
    )

    return response.choices[0].message.content


def transcribe_with_whisper(audio_url: str) -> str:
    # הורדת קובץ זמנית
    audio_data = requests.get(audio_url)
    audio_data.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        temp_audio.write(audio_data.content)
        temp_audio_path = temp_audio.name

    # שליחת הקובץ ל־Whisper API
    with open(temp_audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

    os.remove(temp_audio_path)

    text = transcript.text
    corrected_text = correct_lyrics(text)

    return corrected_text

@app.route("/")
def index():
    return "השרת פועל! 🎵"

@app.route('/transcribe', methods=['POST'])
def handle_transcription():
    data = request.get_json()
    audio_url = data.get('url')
    if not audio_url:
        return jsonify({'error': 'Missing audio URL'}), 400

    try:
        corrected_text = transcribe_with_whisper(audio_url)
        return jsonify({'corrected_lyrics': corrected_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
