"""
Script to download images from Google Drive folder for Shivashray application
"""
import os
import sys
import subprocess
from pathlib import Path

# Google Drive folder ID
FOLDER_ID = "15gb5hMdW2069tbT0nNYXnmsz0VP9jwTv"
PUBLIC_DIR = Path(__file__).parent.parent / "frontend" / "public"
IMAGES_DIR = PUBLIC_DIR / "shivashray_images"

def install_gdown():
    """Install gdown if not available"""
    try:
        import gdown
        return True
    except ImportError:
        print("Installing gdown...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown"])
        try:
            import gdown
            return True
        except ImportError:
            print("Failed to install gdown. Please install manually: pip install gdown")
            return False

def download_from_folder_link(folder_link):
    """Download all files from a Google Drive folder"""
    # Create images directory
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"Downloading images from Google Drive...")
    print(f"Target directory: {IMAGES_DIR}")
    print(f"Folder link: {folder_link}\n")
    
    # Install and use gdown
    if not install_gdown():
        return False
    
    try:
        import gdown
        print("Starting download...")
        gdown.download_folder(
            folder_link, 
            output=str(IMAGES_DIR), 
            quiet=False, 
            use_cookies=False,
            remaining_ok=True
        )
        print("\n✓ Download complete!")
        
        # List downloaded files
        print("\nDownloaded files:")
        for file in sorted(IMAGES_DIR.rglob("*")):
            if file.is_file():
                print(f"  - {file.relative_to(IMAGES_DIR)}")
        
        return True
    except Exception as e:
        print(f"\n✗ Error downloading: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Ensure the Google Drive folder is set to 'Anyone with the link can view'")
        print("2. Try installing gdown manually: pip install gdown")
        print("3. Check your internet connection")
        return False

if __name__ == "__main__":
    folder_link = f"https://drive.google.com/drive/folders/{FOLDER_ID}"
    success = download_from_folder_link(folder_link)
    sys.exit(0 if success else 1)
