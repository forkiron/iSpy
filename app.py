from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/check-ai', methods=['POST'])
def check_ai():
    data = request.get_json()
    image_url = data.get('url')
    print(f"Received image URL: {image_url}")

    params = {
        'url': image_url,
        'models': 'genai',
        'api_user': '1166579605',
        'api_secret': 'Uu5XRGeAsw2U7riF2qst2MPBR9tSNFes'
    }

    r = requests.get('https://api.sightengine.com/1.0/check.json', params=params)
    output = r.json()
    print("Sightengine API output:", output)

    ai_percentage = 0
    if 'type' in output and 'ai_generated' in output['type']:
        ai_percentage = output['type']['ai_generated'] * 100
        print(f"AI generated likelihood: {ai_percentage:.2f}%")

    # You can send back a response anyway even if frontend does not display it
    return jsonify({'ai_percentage': ai_percentage})

if __name__ == '__main__':
    app.run(debug=True)
