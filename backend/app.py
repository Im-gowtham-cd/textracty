from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from ocr_utils import preprocess_image

# If Tesseract is installed in a non-default path, uncomment & set path:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    try:
        # Preprocess for handwriting OCR
        processed_image = preprocess_image(file.stream)

        # Perform OCR (you can change lang to 'handwritten' if you have the model)
        text = pytesseract.image_to_string(processed_image, lang='eng')

        if not text.strip():
            return jsonify({'extracted_text': '', 'message': 'No text extracted'}), 200

        return jsonify({'extracted_text': text.strip()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
