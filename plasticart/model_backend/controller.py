import os
from flask import Flask, request, jsonify
from predictor import predict_external_image
from flask_cors import CORS, cross_origin

app = Flask(__name__)

CORS(app, resources={r"/upload": {"origins": "http://localhost:3000"}})

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/api/upload', methods=['GET'])
def hello_world():
    return "Hello World!"

@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        uploaded_file = request.files["image"]
        if uploaded_file.filename != "":
            # Save the uploaded file temporarily (you can choose a different location)
            temp_path = "temp_image.jpg"
            uploaded_file.save(temp_path)

            print("Going to predict")
            # Get the prediction
            prediction = predict_external_image(temp_path)

            # Clean up: remove the temporary file
            os.remove(temp_path)

            print("Got image", prediction)
            return jsonify(
                {
                    "prediction": prediction,
                    "lat": request.form.get("lat", "0"),
                    "long": request.form.get("long", "0"),
                    "status": "ok",
                }
            )
        else:
            return "No file uploaded."
    except Exception as e:
        print(e)
        return f"Error: {str(e)}"

if __name__ == "__main__":
    from waitress import serve
    port = int(os.environ.get("PORT", 4000))
    serve(app, host="0.0.0.0", port=port)
