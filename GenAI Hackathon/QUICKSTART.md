# TruthGuard Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up API Key
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Backend
```bash
cd stati
python Backend.py
```

### 4. Open the Website
Navigate to: `http://localhost:5000`

### 5. Install Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

## 🎯 Test the System

### Website Testing
1. Go to `http://localhost:5000`
2. Enter test text: "The Earth is flat and NASA is lying"
3. Click "Check Credibility"
4. View the analysis results

### Chrome Extension Testing
1. Click the TruthGuard icon in your browser
2. Enter text or select text on any webpage
3. Click "Check" to see results
4. Try right-clicking on selected text for context menu

## 🔧 Troubleshooting

**Backend won't start?**
- Check if port 5000 is available
- Verify your API key is correct
- Make sure all dependencies are installed

**Chrome extension not working?**
- Check browser console for errors
- Ensure backend is running on localhost:5000
- Try reloading the extension

**API errors?**
- Verify your Gemini API key has proper permissions
- Check the `misinfo_log.txt` file for detailed logs

## 📱 Features Overview

### Website Features
- ✅ Real-time text analysis
- ✅ Visual credibility scoring
- ✅ Detailed explanations and tips
- ✅ Responsive design
- ✅ Error handling

### Chrome Extension Features
- ✅ Popup interface for quick checks
- ✅ Content script for webpage integration
- ✅ Context menu integration
- ✅ Selected text detection
- ✅ Overlay results display

## 🎨 Customization

### Changing API Endpoint
Update the `apiBaseUrl` in:
- `stati/static/js/app.js` (website)
- `chrome-extension/popup.js` (extension)

### Styling
Modify CSS files:
- `stati/static/css/style.css` (website)
- `chrome-extension/popup.css` (extension popup)
- `chrome-extension/content.css` (content script)

## 🚀 Production Deployment

1. **Backend**: Deploy Flask app to your preferred hosting service
2. **Extension**: Update manifest.json with production URLs
3. **Icons**: Replace placeholder icons with actual PNG files
4. **Security**: Configure proper CORS and API key management

---

**Need help?** Check the full README.md for detailed documentation!
