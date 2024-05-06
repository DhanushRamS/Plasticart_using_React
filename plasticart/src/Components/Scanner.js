import React, { useState, useEffect, useRef } from "react";
import "./stylescn.css"; // Import the stylesheet

function Scanner() {
  const [currentPoints, setCurrentPoints] = useState(100);
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => console.error("Error accessing camera:", err));
    }
  }, []);

  const dataURItoBlob = (dataURI) => {
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURI.split(",")[1]);
    } else {
      byteString = unescape(dataURI.split(",")[1]);
    }

    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  };

  const handleCaptureClick = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 280;
    canvas.height = 200;

    context.drawImage(video, 0, 0, 280, 200);

    var imageData = canvas.toDataURL("image/jpeg");
    imageData = dataURItoBlob(imageData);

    setCapturedImages((prevImages) => [...prevImages, imageData]);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="points">Current Points: {currentPoints}</div>
        <button>Redeem Your Points</button>
      </header>
      <div className="container">
        <div className="camera-video">
          <h1>Hello User Please Scan your plastic &darr;</h1>
          <video ref={videoRef} width="500" height="340" />
          <button onClick={handleCaptureClick}>Capture</button>
        </div>
        <div className="camera-snapshot" id="camera-snapshot">
          <div className="scrollable-container">
            {capturedImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Captured ${index + 1}`}
                className="captured-image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
