from PIL import Image, ImageEnhance, ImageFilter

def preprocess_image(image_stream):
    """
    Preprocess the image to improve handwriting OCR accuracy.
    """
    # Convert to grayscale
    image = Image.open(image_stream).convert("L")

    # Remove noise
    image = image.filter(ImageFilter.MedianFilter())

    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)

    # Binarize (black & white)
    image = image.point(lambda x: 0 if x < 140 else 255)

    return image
