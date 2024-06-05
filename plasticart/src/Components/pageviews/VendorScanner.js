import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./VendorStylescn.module.css";
import { appAuth, appFirestore } from "../../config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

function VendorScanner() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const videoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { pickup } = location.state; // Get pickup data from location state

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCaptureClick = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 280;
    canvas.height = 200;

    context.drawImage(video, 0, 0, 280, 200);

    const imageData = canvas.toDataURL("image/jpeg");
    const blobData = dataURItoBlob(imageData);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const formData = new FormData();
        formData.append("image", blobData);
        formData.append("lat", latitude);
        formData.append("long", longitude);

        try {
          const response = await axios({
            method: "post",
            url: "http://127.0.0.1:4000/upload",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });

          const data = response.data;
          setCapturedImage({
            image: imageData,
            prediction: data.prediction,
            latitude,
            longitude,
          });

          setPrediction(data.prediction);
          setShowModal(true);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  };

  const handleRetry = () => {
    setShowModal(false);
    setCapturedImage(null);
    setVerificationResult(null);
  };

  const handleVerify = async () => {
    if (prediction === pickup.data.prediction) {
      setVerificationResult("Data matched. Please proceed with the pickup.");
      // Mark the pickup as complete
      await setDoc(
        doc(appFirestore, "USER", pickup.data.email, "PICKUP", pickup.id),
        { status: "complete" },
        { merge: true }
      );
      navigate("/vendor-dashboard", {
        state: { successMessage: "Successfully completed pickup" },
      });
    } else {
      setVerificationResult("Match failed. Retry.");
    }
  };

  const dataURItoBlob = (dataURI) => {
    let byteString =
      dataURI.split(",")[0].indexOf("base64") >= 0
        ? atob(dataURI.split(",")[1])
        : unescape(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  };

  const getVendors = async () => {
    const querySnapshot = await getDocs(collection(appFirestore, "VENDOR"));
    let vendors = [];
    querySnapshot.forEach((doc) => {
      const ven = { id: doc.id, data: doc.data() };
      vendors.push(ven);
    });
    return vendors;
  };

  return (
    <div className={styles.scannerContainer}>
      <header className={styles.scannerHeader}>
        <h1>PlastiCart Scanner</h1>
      </header>
      <div className={styles.scannerContent}>
        <div className={styles.scannerVideoContainer}>
          <h2>Hello Vendor, Please Scan your plastic ↓</h2>
          <video ref={videoRef} width="500" height="340" muted autoPlay />
          <button
            className={styles.scannerCaptureButton}
            onClick={handleCaptureClick}
          ></button>
        </div>
      </div>
      {showModal && (
        <div className={styles.scannerModal}>
          <div className={styles.scannerModalContent}>
            <h2>Verification Result</h2>
            <img
              src={capturedImage.image}
              alt="Current Capture"
              className={styles.scannerModalImage}
            />
            <p>Prediction: {prediction}</p>
            {verificationResult ? (
              <p>{verificationResult}</p>
            ) : (
              <>
                <button
                  className={styles.scannerModalButton}
                  onClick={handleVerify}
                >
                  Verify
                </button>
                <button
                  className={styles.scannerModalButton}
                  onClick={handleRetry}
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorScanner;
