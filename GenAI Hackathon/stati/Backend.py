from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import sys
import os

# Add parent directory to path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from test_prompt import prompt_runner
from app import input_checker

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)  # Enable CORS for Chrome extension

# API route for fact-checking
@app.route('/api/fact-check', methods=['POST'])
def fact_check():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        
        # Validate input
        valid_input = input_checker(text)
        
        if isinstance(valid_input, dict):
            return jsonify(valid_input)
        
        # Run fact-check
        result = prompt_runner(text)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API route for health check
@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "service": "misinformation-detector"})

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
    app.run(host='0.0.0.0', port=5001, debug=True)
