import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./VendorStylescn.module.css";
import { appFirestore } from "../../config";
import { setDoc, doc } from "firebase/firestore";

function VendorScanner() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { pickup } = location.state; // Get pickup data from location state

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
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
                url: "https://dhanush10.pythonanywhere.com/upload",
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
      reader.readAsDataURL(file);
    }
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

  return (
    <div className={styles.vendorScannerContainer}>
      <header className={styles.vendorScannerHeader}>
        <h1>PlastiCart Scanner</h1>
      </header>
      <div className={styles.vendorScannerContent}>
        <div className={styles.vendorScannerVideoContainer}>
          <h2>Hello Vendor, Please Capture your plastic image ↓</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className={styles.vendorScannerFileInput}
          />
        </div>
      </div>
      {showModal && (
        <div className={styles.vendorScannerModal}>
          <div className={styles.vendorScannerModalContent}>
            <h2>Verification Result</h2>
            <img
              src={capturedImage.image}
              alt="Current Capture"
              className={styles.vendorScannerModalImage}
            />
            <p>Prediction: {prediction}</p>
            {verificationResult ? (
              <p>{verificationResult}</p>
            ) : (
              <>
                <button
                  className={styles.vendorScannerModalButton}
                  onClick={handleVerify}
                >
                  Verify
                </button>
                <button
                  className={styles.vendorScannerModalButton}
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
