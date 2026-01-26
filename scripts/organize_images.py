"""
Script to organize downloaded images and copy them to appropriate locations
"""
import shutil
from pathlib import Path

PUBLIC_DIR = Path(__file__).parent.parent / "frontend" / "public"
IMAGES_DIR = PUBLIC_DIR / "shivashray_images"

def organize_images():
    """Organize images from shivashray_images folder to public root"""
    
    # Map room types to image folders
    room_mappings = {
        "Deluxe Room": "deluxe",
        "Super Deluxe Room": "super_deluxe", 
        "Family Room": "family",
    }
    
    # Copy room images - use first image from each folder as primary
    for folder_name, prefix in room_mappings.items():
        folder_path = IMAGES_DIR / folder_name
        if folder_path.exists():
            # Get all images in folder
            images = sorted([f for f in folder_path.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.avif']])
            if images:
                # Copy first few images with better names
                for i, img in enumerate(images[:5]):  # Copy first 5 images
                    new_name = f"{prefix}_room_{i+1}{img.suffix}"
                    dest = PUBLIC_DIR / new_name
                    shutil.copy2(img, dest)
                    print(f"Copied: {img.name} -> {new_name}")
    
    # Copy property images to public root
    property_folder = IMAGES_DIR / "Property Images"
    if property_folder.exists():
        images = sorted([f for f in property_folder.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.avif']])
        for i, img in enumerate(images):
            new_name = f"property_{i+1}{img.suffix}"
            dest = PUBLIC_DIR / new_name
            shutil.copy2(img, dest)
            print(f"Copied property image: {img.name} -> {new_name}")
    
    # Copy root level images (those individual images)
    for img in IMAGES_DIR.iterdir():
        if img.is_file() and img.suffix.lower() in ['.jpg', '.jpeg', '.png', '.avif']:
            new_name = f"shivashray_{img.name}"
            dest = PUBLIC_DIR / new_name
            shutil.copy2(img, dest)
            print(f"Copied root image: {img.name} -> {new_name}")
    
    print("\nImage organization complete!")

if __name__ == "__main__":
    organize_images()
