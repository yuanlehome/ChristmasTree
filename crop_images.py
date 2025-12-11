import os
from PIL import Image

def crop_to_square(image_path):
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (e.g. for PNGs with transparency or palette)
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
                
            width, height = img.size
            
            # Determine the size of the square (shortest side)
            new_size = min(width, height)
            
            # Calculate coordinates to crop from the center
            left = (width - new_size) / 2
            top = (height - new_size) / 2
            right = (width + new_size) / 2
            bottom = (height + new_size) / 2
            
            # Crop the image
            img_cropped = img.crop((left, top, right, bottom))
            
            # Resize to a standard size (e.g., 512x512) for consistency and performance
            img_resized = img_cropped.resize((512, 512), Image.Resampling.LANCZOS)
            
            # Save overwrite
            img_resized.save(image_path, quality=95)
            print(f"Processed: {image_path}")
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def process_directory(directory):
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return

    files = os.listdir(directory)
    count = 0
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.webp')):
            file_path = os.path.join(directory, filename)
            crop_to_square(file_path)
            count += 1
            
    print(f"Finished processing {count} images.")

if __name__ == "__main__":
    target_dir = 'src/assets/photos'
    process_directory(target_dir)
