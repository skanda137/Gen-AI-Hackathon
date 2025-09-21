#!/usr/bin/env python3
"""
TruthGuard Setup Script
Automates the setup process for the TruthGuard misinformation detection system.
"""

import os
import sys
import subprocess
import json

def check_python_version():
    """Check if Python version is 3.8 or higher."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required.")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_dependencies():
    """Install required Python packages."""
    print("\n📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist."""
    env_file = ".env"
    if os.path.exists(env_file):
        print("✅ .env file already exists")
        return True
    
    print("\n🔧 Creating .env file...")
    api_key = input("Enter your Google Gemini API key: ").strip()
    
    if not api_key:
        print("❌ API key is required!")
        return False
    
    with open(env_file, "w") as f:
        f.write(f"GEMINI_API_KEY={api_key}\n")
    
    print("✅ .env file created successfully!")
    return True

def create_chrome_extension_icons():
    """Create placeholder icons for Chrome extension."""
    icons_dir = "chrome-extension/icons"
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
    
    # Create a simple script to generate icons from SVG
    icon_script = """
import os
from PIL import Image, ImageDraw
import io

def create_icon(size, filename):
    # Create a simple shield icon
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw shield shape
    shield_points = [
        (size//2, size//8),
        (size*3//4, size//4),
        (size*3//4, size*3//4),
        (size//2, size*7//8),
        (size//4, size*3//4),
        (size//4, size//4)
    ]
    
    # Background circle
    draw.ellipse([0, 0, size, size], fill=(102, 126, 234, 255))
    
    # Shield
    draw.polygon(shield_points, fill=(255, 255, 255, 230))
    
    # Checkmark
    check_points = [
        (size//3, size//2),
        (size//2, size*2//3),
        (size*2//3, size//3)
    ]
    draw.line([check_points[0], check_points[1]], fill=(102, 126, 234, 255), width=max(2, size//32))
    draw.line([check_points[1], check_points[2]], fill=(102, 126, 234, 255), width=max(2, size//32))
    
    img.save(filename)

# Create different sizes
sizes = [16, 32, 48, 128]
for size in sizes:
    create_icon(size, f'chrome-extension/icons/icon{size}.png')
    print(f'Created icon{size}.png')
"""
    
    try:
        with open("create_icons.py", "w") as f:
            f.write(icon_script)
        
        # Try to create icons with PIL
        try:
            subprocess.check_call([sys.executable, "create_icons.py"])
            print("✅ Chrome extension icons created!")
        except (subprocess.CalledProcessError, ImportError):
            print("⚠️  Could not create icons automatically. Please create icon files manually:")
            print("   - chrome-extension/icons/icon16.png")
            print("   - chrome-extension/icons/icon32.png")
            print("   - chrome-extension/icons/icon48.png")
            print("   - chrome-extension/icons/icon128.png")
        
        # Clean up
        if os.path.exists("create_icons.py"):
            os.remove("create_icons.py")
            
    except Exception as e:
        print(f"⚠️  Could not create icons: {e}")

def test_backend():
    """Test if the backend can start."""
    print("\n🧪 Testing backend...")
    try:
        # Try to import the required modules
        sys.path.append(os.path.join(os.getcwd(), 'stati'))
        from test_prompt import prompt_runner
        from app import input_checker
        print("✅ Backend modules can be imported successfully!")
        return True
    except ImportError as e:
        print(f"❌ Backend import error: {e}")
        return False

def main():
    """Main setup function."""
    print("🛡️  TruthGuard Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Create .env file
    if not create_env_file():
        return False
    
    # Create Chrome extension icons
    create_chrome_extension_icons()
    
    # Test backend
    if not test_backend():
        return False
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend server:")
    print("   cd stati && python Backend.py")
    print("2. Open http://localhost:5000 in your browser")
    print("3. Load the Chrome extension:")
    print("   - Go to chrome://extensions/")
    print("   - Enable Developer mode")
    print("   - Click 'Load unpacked' and select the 'chrome-extension' folder")
    print("\n🚀 You're ready to use TruthGuard!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
