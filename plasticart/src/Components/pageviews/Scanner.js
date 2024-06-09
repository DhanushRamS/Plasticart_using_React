import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Stylescn.module.css";
import { appAuth, appFirestore, appStorage } from "../../config";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const findNearestVendor = (lat, lon, vendors) => {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;

  let nearestVendor = null;
  let minDistance = Infinity;

  vendors.forEach((vendor) => {
    const dLat = Math.abs(toRad(vendor.data.latitude - lat));
    const dLon = Math.abs(toRad(vendor.data.longitude - lon));
    const a =
      Math.sin(dLat / 2) * Math.sin(dLon / 2) +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(vendor.data.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    if (distance < minDistance) {
      minDistance = distance;
      nearestVendor = vendor;
    }
  });

  return nearestVendor;
};

function Scanner({ onCaptureComplete }) {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCapture, setCurrentCapture] = useState(null);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const docRef = doc(appFirestore, "USER", appAuth.currentUser?.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setCurrentPoints(docSnap.data().points || 0); // Set current points from user data
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const getVendors = async () => {
    const querySnapshot = await getDocs(collection(appFirestore, "VENDOR"));
    let vendors = [];
    querySnapshot.forEach((doc) => {
      const ven = { id: doc.id, data: doc.data() };
      vendors.push(ven);
    });
    setAllVendors(vendors);
    return vendors;
  };

  useEffect(() => {
    onAuthStateChanged(appAuth, async (user) => {
      if (!user) {
        navigate("/");
      } else {
        await fetchImages();
      }
    });
  }, []);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("capturedImages"));
    if (storedImages) {
      setCapturedImages(storedImages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("capturedImages", JSON.stringify(capturedImages));
  }, [capturedImages]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setIsLoading(true); // Show loading screen
          const { latitude, longitude } = position.coords;

          const formData = new FormData();
          formData.append("image", file);
          formData.append("lat", latitude);
          formData.append("long", longitude);

          try {
            const response = await axios({
              method: "post",
              url: "https://dhanush10.pythonanywhere.com/upload",
              // url: "http://127.0.0.1:4000/upload",
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });

            const data = response.data;

            if (data.prediction.toLowerCase() !== "plastic") {
              alert("The scanned object is not plastic. Please try again.");
              setIsLoading(false); // Hide loading screen
              return;
            }

            const vendors = await getVendors();
            const vendor = findNearestVendor(latitude, longitude, vendors);
            setCurrentCapture({
              imageUploaded: file,
              image: imageData,
              blob: file,
              latitude: latitude,
              vendor: vendor.data.email,
              longitude: longitude,
              prediction: data.prediction,
            });

            setIsLoading(false); // Hide loading screen
            setShowModal(true);
          } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again later.");
            setIsLoading(false); // Hide loading screen
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          alert("Failed to get geolocation. Please try again later.");
          setIsLoading(false); // Hide loading screen
        }
      );
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteCapture = () => {
    setShowModal(false);
    setCurrentCapture(null);
    setDescription("");
    setQuantity(1);
  };

  const handleUploadCapture = async () => {
    if (!currentCapture) return;

    try {
      const capturedData = {
        userId: appAuth.currentUser?.uid,
        image: currentCapture.image,
        prediction: currentCapture.prediction,
        latitude: currentCapture.latitude,
        longitude: currentCapture.longitude,
        vendor: currentCapture.vendor,
        date: new Date().toISOString(),
        description: description,
        quantity: quantity,
        email: appAuth.currentUser?.email,
      };

      setCapturedImages((prevImages) => [...prevImages, capturedData]);
      setShowModal(false);
      setCurrentCapture(null);
      setDescription("");
      setQuantity(1);

      await saveData(capturedData);
      onCaptureComplete();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const getTime = (prefix) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    return `${hours + "_" + minutes + "_" + seconds}`;
  };

  const saveData = async (data) => {
    try {
      const storagePath = `PICKUP/${generateKeys(5)}/${
        (appAuth.currentUser?.email, "_", getTime())
      }`;

      const storageRef = ref(appStorage, storagePath);

      const metadata = {
        contentType: data.image.type,
      };

      const uploadTask = uploadBytesResumable(
        storageRef,
        currentCapture.imageUploaded,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (docURL) => {
            try {
              await addDoc(
                collection(
                  appFirestore,
                  "USER",
                  appAuth.currentUser?.email,
                  "PICKUP"
                ),
                {
                  userId: appAuth.currentUser?.uid,
                  image: docURL,
                  prediction: data.prediction,
                  latitude: `${data.latitude}`,
                  longitude: `${data.longitude}`,
                  date: new Date().toISOString(),
                  description: description,
                  quantity: quantity,
                  iSeen: false,
                  vendor: data.vendor,
                  email: appAuth.currentUser?.email,
                  status: "pending",
                  pointsAssigned: false,
                }
              );
            } catch (error) {
              console.log(error);
            }
          });
        }
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  function generateKeys(length) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }

    // Ensure the first character is an uppercase letter
    result = result.replace(
      result.charAt(0),
      charset.charAt(Math.floor(Math.random() * 26) + 65)
    );

    return result;
  }

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.scannerContainer}>
      <header className={styles.scannerHeader}>
        <h1>PlastiCart Scanner</h1>
        <div className={styles.pointsDisplay}>Points: {currentPoints}</div>
        <nav className={styles.scannerHeaderNav}>
          <a href="#" onClick={() => navigate("/history")}>
            History
          </a>
          <a href="#" onClick={() => navigate("/redeem")}>
            Redeem Points
          </a>
          <a
            href="#"
            onClick={() => signOut(appAuth).then(() => navigate("/"))}
          >
            Log Out
          </a>
        </nav>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {isExpanded && (
          <div className={styles.dropdownMenu}>
            <a href="#" onClick={() => navigate("/history")}>
              History
            </a>
            <a href="#" onClick={() => navigate("/redeem")}>
              Redeem Points
            </a>
            <a
              href="#"
              onClick={() => signOut(appAuth).then(() => navigate("/"))}
            >
              Log Out
            </a>
          </div>
        )}
      </header>
      <div className={styles.scannerContent}>
        <div className={styles.scannerVideoContainer}>
          <h2>Hello User, Please Scan your plastic ↓</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className={styles.cameraInput}
          />
        </div>
        <div className={styles.scannerSnapshotContainer}>
          <h2>Current Upload History:</h2>
          {capturedImages.map((img, index) => (
            <div key={`capture-${index}`} className={styles.scannerHistoryItem}>
              <img src={img.image} alt={`Capture ${index}`} />
              <div className={styles.scannerDetails}>
                <p>Prediction: {img.prediction}</p>
                <p>Latitude: {img.latitude}</p>
                <p>Longitude: {img.longitude}</p>
                <p>Date: {new Date(img.date).toLocaleString()}</p>
                <p>Description: {img.description}</p>
                <p>Quantity: {img.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className={styles.scannerModal}>
          <div className={styles.scannerModalContent}>
            <h2>Add Details</h2>
            {currentCapture && (
              <>
                <img
                  src={currentCapture.image}
                  alt="Current Capture"
                  className={styles.scannerModalImage}
                />
                <p>Prediction: {currentCapture.prediction}</p>
              </>
            )}
            <label>
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <button
              className={styles.scannerModalButton}
              onClick={handleDeleteCapture}
            >
              Cancel
            </button>
            <button
              className={styles.scannerModalButton}
              onClick={handleUploadCapture}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingMessage}>
            Please wait, processing image...
          </div>
        </div>
      )}
    </div>
  );
}

export default Scanner;
