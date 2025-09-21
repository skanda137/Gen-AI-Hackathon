from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import sys
import os
import random
import time

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)  # Enable CORS for Chrome extension

# Demo responses for testing without API key
DEMO_RESPONSES = [
    {
        "score": 85,
        "category": "misleading",
        "explanation": "This claim contains several misleading statements and unverified information.",
        "tip": "Verify this information with official sources and fact-checking websites.",
        "flags": ["unverified claim", "emotional language", "conspiracy theory"]
    },
    {
        "score": 25,
        "category": "factual",
        "explanation": "This statement appears to be based on factual information and credible sources.",
        "tip": "This information seems reliable, but always cross-reference with multiple sources.",
        "flags": []
    },
    {
        "score": 65,
        "category": "biased",
        "explanation": "This content shows clear bias and may present information in a misleading way.",
        "tip": "Look for multiple perspectives and check for balanced reporting.",
        "flags": ["biased language", "one-sided view"]
    },
    {
        "score": 90,
        "category": "false",
        "explanation": "This claim is demonstrably false and contains multiple inaccuracies.",
        "tip": "This information is incorrect. Check reliable fact-checking sources for accurate information.",
        "flags": ["false information", "debunked claim", "misleading"]
    }
]

# API route for fact-checking (demo version)
@app.route('/api/fact-check', methods=['POST'])
def fact_check():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text'].lower()
        
        # Simulate processing time
        time.sleep(1)
        
        # Return different responses based on content
        if any(word in text for word in ['flat', 'nasa', 'lying', 'conspiracy']):
            return jsonify(DEMO_RESPONSES[0])  # High risk
        elif any(word in text for word in ['water', 'boils', '100', 'celsius']):
            return jsonify(DEMO_RESPONSES[1])  # Low risk
        elif any(word in text for word in ['bias', 'political', 'agenda']):
            return jsonify(DEMO_RESPONSES[2])  # Medium risk
        else:
            return jsonify(DEMO_RESPONSES[3])  # High risk default
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route for health check
@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "service": "misinformation-detector-demo"})

# Static file routes
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(app.static_folder, 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(app.static_folder, 'js'), filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(os.path.join(app.static_folder, 'images'), filename)

# Main frontend route
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("🚀 Starting TruthGuard Demo Server...")
    print("📱 Open: http://localhost:5001")
    print("🎯 Try these test phrases:")
    print("   - 'The Earth is flat and NASA is lying'")
    print("   - 'Water boils at 100 degrees Celsius'")
    print("   - 'This is clearly biased political content'")
    app.run(host='0.0.0.0', port=5001, debug=True)
