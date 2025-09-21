#!/usr/bin/env python3
"""
Quick Setup Script for TruthGuard
This script will help you get the system running immediately.
"""

import os
import sys

def main():
    print("🛡️  TruthGuard Quick Setup")
    print("=" * 50)
    
    # Check if API key is set
    env_file = ".env"
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            content = f.read()
            if "your_gemini_api_key_here" in content:
                print("⚠️  You need to set up your Gemini API key!")
                print("\n📋 Steps to get your API key:")
                print("1. Go to: https://makersuite.google.com/app/apikey")
                print("2. Create a new API key")
                print("3. Copy the key")
                print("4. Edit the .env file and replace 'your_gemini_api_key_here' with your actual key")
                print("\n🔧 Or run this command:")
                print("echo 'GEMINI_API_KEY=your_actual_key_here' > .env")
                return False
    
    print("✅ API key is configured!")
    print("\n🚀 Your TruthGuard system is ready!")
    print("\n📱 Access your application:")
    print("   Website: http://localhost:5001")
    print("   API Health: http://localhost:5001/api/health")
    
    print("\n🎯 Test the system:")
    print("1. Open http://localhost:5001 in your browser")
    print("2. Try entering: 'The Earth is flat and NASA is lying'")
    print("3. Click 'Check Credibility' to see the AI analysis")
    
    print("\n🔧 Chrome Extension:")
    print("1. Go to chrome://extensions/")
    print("2. Enable 'Developer mode'")
    print("3. Click 'Load unpacked'")
    print("4. Select the 'chrome-extension' folder")
    
    return True

if __name__ == "__main__":
    main()
