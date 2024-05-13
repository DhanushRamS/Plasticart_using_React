import React, { useState, useEffect, useRef } from "react";
import styles from "./Stylescn.module.css";

function Scanner() {
  const [currentPoints, setCurrentPoints] = useState(100);
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    setupCamera();
  }, [videoRef]);

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

  const handleCaptureClick = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 280;
    canvas.height = 200;

    context.drawImage(video, 0, 0, 280, 200);

    const imageData = canvas.toDataURL("image/jpeg");
    const blobData = dataURItoBlob(imageData);

    try {
      const formData = new FormData();
      formData.append("image", blobData);

      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        const { prediction, lat, long, date, points } = data;

        const capturedData = {
          image: imageData,
          prediction,
          lat,
          long,
          date,
          points,
        };

        updateDatabase(capturedData);
        setCapturedImages((prevImages) => [...prevImages, capturedData]);
      } else {
        throw new Error("Failed to get prediction data from backend");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateDatabase = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/saveData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update database");
      }
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  return (
    <div className={styles["scanner-container"]}>
      <header className={styles.header}>
        <div className={styles.points}>Current Points: {currentPoints}</div>
        {/* Replace the button's onClick event with your desired functionality */}
        <button>Redeem Your Points</button>
      </header>
      <div className={styles.container}>
        <div className={styles.cameravideo}>
          <h1>Hello User Please Scan your plastic &darr;</h1>
          <video ref={videoRef} width="500" height="340" muted autoPlay />
          <button onClick={handleCaptureClick}>Capture</button>
        </div>
        <div className={styles.camerasnapshot} id="camera-snapshot">
          <div className={styles.scrollablecontainer}>
            {capturedImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Captured ${index + 1}`}
                className={styles.capturedimage}
              />
            ))}

            {/* Uncomment the lines below to display response data */}

            {capturedImages.map((response, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(response.image)}
                  alt={`Captured ${index + 1}`}
                  className={styles.capturedimage}
                />
                <p>Prediction: {response.prediction}</p>
                <p>Latitude: {response.lat}</p>
                <p>Longitude: {response.long}</p>
                <p>Date: {response.date}</p>
                <p>Points: {response.points}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
