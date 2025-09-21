# TruthGuard - AI-Powered Misinformation Detection

TruthGuard is a comprehensive misinformation detection system built for the Google Agentic AI Hackathon. It combines a modern web interface with a Chrome extension to provide real-time credibility analysis of text content using Google's Gemini AI.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google's Gemini 1.5 Flash model for advanced content analysis
- **Real-time Detection**: Instant credibility scoring and risk assessment
- **Chrome Extension**: Browser integration for checking selected text on any webpage
- **Modern Web Interface**: Beautiful, responsive design with comprehensive results
- **Comprehensive Analysis**: Provides category classification, explanations, tips, and red flags
- **Risk Scoring**: 0-100 scale (0 = entirely correct, 100 = entirely false)

## 🏗️ Architecture

### Backend (Python/Flask)
- **API Server**: Flask-based REST API with CORS support
- **AI Integration**: Google Gemini AI for content analysis
- **Input Validation**: Comprehensive text validation and error handling
- **Logging**: Detailed logging of all fact-checking requests

### Frontend
- **Web Interface**: Modern, responsive website with real-time analysis
- **Chrome Extension**: Browser extension with popup interface and content script
- **Real-time Updates**: Dynamic UI updates based on analysis results

## 📦 Installation

### Prerequisites
- Python 3.8+
- Google Gemini API key
- Chrome browser (for extension)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "GenAI Hackathon"
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the backend server**
   ```bash
   cd stati
   python Backend.py
   ```
   The server will start on `http://localhost:5000`

### Chrome Extension Setup

1. **Load the extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome-extension` folder

2. **Pin the extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Pin TruthGuard for easy access

## 🎯 Usage

### Web Interface
1. Navigate to `http://localhost:5000`
2. Enter text to check (5-250 characters)
3. Click "Check Credibility" or press Ctrl+Enter
4. View detailed analysis including:
   - Credibility score (0-100)
   - Risk level (Low/Medium/High)
   - Category classification
   - Detailed explanation
   - Verification tips
   - Red flags

### Chrome Extension
1. **Popup Interface**:
   - Click the TruthGuard icon in your browser toolbar
   - Enter text or check selected text from the current page
   - View results in the popup

2. **Content Script**:
   - Select any text on a webpage
   - Right-click and choose "Check with TruthGuard"
   - View results in an overlay

3. **Keyboard Shortcut**:
   - Select text and use the configured keyboard shortcut
   - Results appear in an overlay

## 🔧 API Endpoints

### POST `/api/fact-check`
Analyzes text for misinformation.

**Request Body:**
```json
{
  "text": "Text to analyze"
}
```

**Response:**
```json
{
  "score": 75,
  "category": "misleading",
  "explanation": "This claim contains several misleading statements.",
  "tip": "Verify this information with official sources.",
  "flags": ["unverified claim", "emotional language"]
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "misinformation-detector"
}
```

## 🎨 UI Components

### Web Interface
- **Hero Section**: Clear value proposition and input area
- **Results Display**: Comprehensive analysis with visual score indicators
- **Features Section**: Explanation of how the system works
- **Responsive Design**: Works on desktop and mobile devices

### Chrome Extension
- **Popup Interface**: Compact interface for quick checks
- **Content Overlay**: Full-screen results display
- **Context Menu**: Right-click integration
- **Loading States**: Visual feedback during analysis

## 🔍 Analysis Categories

The system can detect various types of problematic content:
- **Misleading**: Content that misrepresents facts
- **Hate Speech**: Content promoting hatred or discrimination
- **Conspiracy Theories**: Unsubstantiated conspiracy claims
- **Medical Misinformation**: False health information
- **Political Bias**: Heavily biased political content
- **Financial Scams**: Fraudulent financial claims

## 🛡️ Security & Privacy

- **Local Processing**: All analysis happens on your local server
- **No Data Storage**: Text is not stored after analysis
- **API Key Security**: Secure handling of Google API credentials
- **CORS Protection**: Proper cross-origin resource sharing setup

## 🚀 Deployment

### Local Development
```bash
# Backend
cd stati
python Backend.py

# Frontend
# Open http://localhost:5000 in your browser
```

### Production Deployment
1. Set up a production server (e.g., Heroku, AWS, GCP)
2. Configure environment variables
3. Update API URLs in the Chrome extension
4. Deploy the Flask application
5. Update extension manifest for production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built for the Google Agentic AI Hackathon. Please check the hackathon guidelines for usage rights.

## 🆘 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure your `.env` file contains a valid `GEMINI_API_KEY`
   - Check that the API key has proper permissions

2. **CORS Errors**
   - Make sure the Flask server is running
   - Check that `flask-cors` is installed

3. **Chrome Extension Not Working**
   - Ensure the extension is loaded in developer mode
   - Check the browser console for errors
   - Verify the backend server is running

4. **Connection Refused**
   - Make sure the Flask server is running on port 5000
   - Check firewall settings
   - Verify the API URL in the extension

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the browser console for errors
3. Check the Flask server logs
4. Create an issue in the repository

---

Built with ❤️ for the Google Agentic AI Hackathon
