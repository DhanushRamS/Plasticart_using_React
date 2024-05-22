// // import React, { useState, useEffect, useRef } from "react";
// // import styles from "./Stylescn.module.css";
// // import axios from "axios";
// // import { useLocation } from "react-router-dom";

// // function Scanner() {
// //   const [currentPoints, setCurrentPoints] = useState(100);
// //   const [capturedImages, setCapturedImages] = useState([]);
// //   const [allImages, setAllImages] = useState([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentCapture, setCurrentCapture] = useState(null);
// //   const [description, setDescription] = useState("");
// //   const [quantity, setQuantity] = useState(1);
// //   const videoRef = useRef(null);
// //   const { state } = useLocation();
// //   console.log(state);

// //   useEffect(() => {
// //     const setupCamera = async () => {
// //       try {
// //         const stream = await navigator.mediaDevices.getUserMedia({
// //           video: true,
// //         });
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream;
// //         }
// //       } catch (error) {
// //         console.error("Error accessing camera:", error);
// //       }
// //     };

// //     setupCamera();

// //     const style = document.createElement("style");
// //     style.innerHTML = `
// //       html, body {
// //         background-color: rgb(16, 16, 16);
// //         font-family: 'Segoe UI Light';
// //         color: #f1f1f1;
// //         height: 100%;
// //         font-size: 14px; /* Smaller base font size */
// //       }
// //     `;
// //     document.head.appendChild(style);

// //     return () => {
// //       // Cleanup global styles
// //       document.head.removeChild(style);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     fetchImages();
// //   }, []);

// //   const handleCaptureClick = async () => {
// //     const video = videoRef.current;
// //     const canvas = document.createElement("canvas");
// //     const context = canvas.getContext("2d");

// //     canvas.width = 280;
// //     canvas.height = 200;

// //     context.drawImage(video, 0, 0, 280, 200);

// //     const imageData = canvas.toDataURL("image/jpeg");
// //     const blobData = dataURItoBlob(imageData);

// //     navigator.geolocation.getCurrentPosition((position) => {
// //       const { latitude, longitude } = position.coords;

// //       setCurrentCapture({
// //         image: imageData,
// //         blob: blobData,
// //         lat: latitude,
// //         long: longitude,
// //       });

// //       setShowModal(true);
// //     });
// //   };

// //   const handleDeleteCapture = () => {
// //     setShowModal(false);
// //     setCurrentCapture(null);
// //     setDescription("");
// //     setQuantity(1);
// //   };

// //   const handleUploadCapture = async () => {
// //     if (!currentCapture) return;

// //     const { image, blob, lat, long } = currentCapture;

// //     try {
// //       const formData = new FormData();
// //       formData.append("image", blob);
// //       formData.append("lat", lat);
// //       formData.append("long", long);

// //       const response = await axios({
// //         method: "post",
// //         url: "http://127.0.0.1:5000/upload",
// //         data: formData,
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });

// //       const data = response.data;

// //       const capturedData = {
// //         image: image,
// //         prediction: data.prediction,
// //         lat: lat,
// //         long: long,
// //         date: new Date().toISOString(), // ISO string for current date and time
// //         points: data.points,
// //         description: description,
// //         quantity: quantity,
// //         email: state.email,
// //       };

// //       setCapturedImages((prevImages) => [...prevImages, capturedData]);
// //       setShowModal(false);
// //       setCurrentCapture(null);
// //       setDescription("");
// //       setQuantity(1);

// //       // Save the data to the database
// //       await saveData(capturedData);
// //     } catch (error) {
// //       console.error("Error uploading image:", error);
// //     }
// //   };

// //   const dataURItoBlob = (dataURI) => {
// //     let byteString =
// //       dataURI.split(",")[0].indexOf("base64") >= 0
// //         ? atob(dataURI.split(",")[1])
// //         : unescape(dataURI.split(",")[1]);
// //     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
// //     const ia = new Uint8Array(byteString.length);
// //     for (let i = 0; i < byteString.length; i++) {
// //       ia[i] = byteString.charCodeAt(i);
// //     }
// //     return new Blob([ia], { type: mimeString });
// //   };

// //   const fetchImages = async () => {
// //     try {
// //       const response = await axios.get("http://127.0.0.1:5000/get-image");
// //       setAllImages(response.data.data);
// //     } catch (error) {
// //       console.error("Error fetching images:", error);
// //     }
// //   };

// //   const saveData = async (data) => {
// //     try {
// //       const response = await axios.post(
// //         "http://localhost:5000/save-data",
// //         data,
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       console.log(response.data);
// //     } catch (error) {
// //       console.error("Error saving data:", error);
// //     }
// //   };

// //   return (
// //     <div className={styles.scannerContainer}>
// //       <header className={styles.header}>
// //         <div className={styles.points}>Current Points: {currentPoints}</div>
// //         <button onClick={() => setCurrentPoints(currentPoints + 10)}>
// //           Redeem Your Points
// //         </button>
// //       </header>
// //       <div className={styles.container}>
// //         <div className={styles.cameraVideo}>
// //           <h1>Hello User Please Scan your plastic &darr;</h1>
// //           <video ref={videoRef} width="500" height="340" muted autoPlay />
// //           <button
// //             className={styles.button}
// //             onClick={handleCaptureClick}
// //           ></button>
// //         </div>
// //         <div className={styles.cameraSnapshot}>
// //           <div className={styles.scrollableContainer}>
// //             {capturedImages.map((img, index) => (
// //               <div key={index} className={styles.imageContainer}>
// //                 <img
// //                   src={img.image}
// //                   alt={`Capture ${index}`}
// //                   className={styles.capturedImage}
// //                 />
// //                 <p>Prediction: {img.prediction}</p>
// //                 <p>Latitude: {img.lat}</p>
// //                 <p>Longitude: {img.long}</p>
// //                 <p>Date: {new Date(img.date).toLocaleString()}</p>
// //                 <p>Points: {img.points}</p>
// //                 <p>Description: {img.description}</p>
// //                 <p>Quantity: {img.quantity}</p>
// //               </div>
// //             ))}
// //             {allImages.map((image, index) => (
// //               <div key={index} className={styles.imageContainer}>
// //                 <img
// //                   src={image.url}
// //                   alt={`Gallery ${index}`}
// //                   className={styles.galleryImage}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {showModal && (
// //         <div className={styles.modal}>
// //           <div className={styles.modalContent}>
// //             <h2>Add Details</h2>
// //             {currentCapture && (
// //               <img
// //                 src={currentCapture.image}
// //                 alt="Current Capture"
// //                 className={styles.modalImage}
// //               />
// //             )}
// //             <label>
// //               Description:
// //               <input
// //                 type="text"
// //                 value={description}
// //                 onChange={(e) => setDescription(e.target.value)}
// //               />
// //             </label>
// //             <label>
// //               Quantity:
// //               <input
// //                 type="number"
// //                 value={quantity}
// //                 onChange={(e) => setQuantity(e.target.value)}
// //                 min="1"
// //               />
// //             </label>
// //             <button onClick={handleDeleteCapture}>Delete and Retake</button>
// //             <button onClick={handleUploadCapture}>Upload</button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Scanner;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "./Stylescn.module.css";
// import backgroundImage from "./img/scannerimg.jpg"; // Ensure this path is correct

// function Scanner() {
//   const [currentPoints, setCurrentPoints] = useState(100);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [allImages, setAllImages] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentCapture, setCurrentCapture] = useState(null);
//   const [description, setDescription] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const videoRef = useRef(null);
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   console.log(state);

//   useEffect(() => {
//     const setupCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//       }
//     };

//     setupCamera();

//     return () => {
//       // Cleanup camera stream
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:5000/get-image");
//         setAllImages(response.data.data);
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       }
//     };

//     fetchImages();
//   }, []);

//   const handleCaptureClick = async () => {
//     const video = videoRef.current;
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");

//     canvas.width = 280;
//     canvas.height = 200;

//     context.drawImage(video, 0, 0, 280, 200);

//     const imageData = canvas.toDataURL("image/jpeg");
//     const blobData = dataURItoBlob(imageData);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;

//         setCurrentCapture({
//           image: imageData,
//           blob: blobData,
//           lat: latitude,
//           long: longitude,
//         });

//         setShowModal(true);
//       },
//       (error) => {
//         console.error("Error getting geolocation:", error);
//       }
//     );
//   };

//   const handleDeleteCapture = () => {
//     setShowModal(false);
//     setCurrentCapture(null);
//     setDescription("");
//     setQuantity(1);
//   };

//   const handleUploadCapture = async () => {
//     if (!currentCapture) return;

//     const { image, blob, lat, long } = currentCapture;

//     try {
//       const formData = new FormData();
//       formData.append("image", blob);
//       formData.append("lat", lat);
//       formData.append("long", long);
//       formData.append("email", state.email);
//       formData.append("description", description);
//       formData.append("quantity", quantity);

//       const response = await axios({
//         method: "post",
//         url: "http://127.0.0.1:4000/upload",
//         data: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = response.data;

//       const capturedData = {
//         image: image,
//         prediction: data.prediction,
//         lat: lat,
//         long: long,
//         date: new Date().toISOString(),
//         points: data.points,
//         description: description,
//         quantity: quantity,
//         email: state.email,
//       };

//       setCapturedImages((prevImages) => [...prevImages, capturedData]);
//       setCurrentPoints((prevPoints) => prevPoints + data.points); // Update points
//       setShowModal(false);
//       setCurrentCapture(null);
//       setDescription("");
//       setQuantity(1);

//       await saveData(capturedData);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   const dataURItoBlob = (dataURI) => {
//     let byteString =
//       dataURI.split(",")[0].indexOf("base64") >= 0
//         ? atob(dataURI.split(",")[1])
//         : unescape(dataURI.split(",")[1]);
//     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
//     const ia = new Uint8Array(byteString.length);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ia], { type: mimeString });
//   };

//   const saveData = async (data) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/save-data",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   };

//   return (
//     <div
//       className={styles.scannerContainer}
//       style={{
//         height: "100vh",
//         width: "100vw",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage}) no-repeat center center fixed`,
//         backgroundSize: "cover",
//         color: "#fff",
//         WebkitFontSmoothing: "antialiased",
//         MozOsxFontSmoothing: "grayscale",
//       }}
//     >
//       <header className={styles.header}>
//         <div className={styles.points}>
//           <i id="icon" className="fas fa-coins coin-icon"></i>
//           Current Points: {currentPoints}
//         </div>
//         <button
//           onClick={() => navigate("/redeem")}
//           className={styles.redeemButton}
//         >
//           Redeem Your Points
//         </button>
//       </header>
//       <div className={styles.container}>
//         <div className={styles.cameraVideo}>
//           <h1>Hello User, Please Scan your plastic &darr;</h1>
//           <video ref={videoRef} width="500" height="340" muted autoPlay />
//           <button
//             className={styles.scnbutton}
//             onClick={handleCaptureClick}
//           ></button>
//         </div>
//         <div className={styles.cameraSnapshot}>
//           <div className={styles.scrollableContainer}>
//             {capturedImages.map((img, index) => (
//               <div key={`capture-${index}`} className={styles.imageContainer}>
//                 <img
//                   src={img.image}
//                   alt={`Capture ${index}`}
//                   className={styles.capturedImage}
//                 />
//                 <p>Prediction: {img.prediction}</p>
//                 <p>Latitude: {img.lat}</p>
//                 <p>Longitude: {img.long}</p>
//                 <p>Date: {new Date(img.date).toLocaleString()}</p>
//                 <p>Points: {img.points}</p>
//                 <p>Description: {img.description}</p>
//                 <p>Quantity: {img.quantity}</p>
//               </div>
//             ))}
//             {allImages.map((image, index) => (
//               <div key={`gallery-${index}`} className={styles.imageContainer}>
//                 <img
//                   src={image.url}
//                   alt={`Gallery ${index}`}
//                   className={styles.galleryImage}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className={styles.modal}>
//           <div className={styles.modalContent}>
//             <h2>Add Details</h2>
//             {currentCapture && (
//               <img
//                 src={currentCapture.image}
//                 alt="Current Capture"
//                 className={styles.modalImage}
//               />
//             )}
//             <p>Prediction: {currentCapture.prediction}</p>
//             <label>
//               Description:
//               <input
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </label>
//             <label>
//               Quantity:
//               <input
//                 type="number"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value))}
//               />
//             </label>
//             <button onClick={handleDeleteCapture}>Cancel</button>
//             <button onClick={handleUploadCapture}>Upload</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Scanner;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Stylescn.module.css";
import backgroundImage from "./img/scannerimg.jpg";

function Scanner() {
  const [currentPoints, setCurrentPoints] = useState(100);
  const [capturedImages, setCapturedImages] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCapture, setCurrentCapture] = useState(null);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const videoRef = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/get-image/${state.email}`
        );
        setAllImages(response.data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [state.email]);

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

          setCurrentCapture({
            image: imageData,
            blob: blobData,
            lat: latitude,
            long: longitude,
            prediction: data.prediction,
            points: data.points,
          });

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

  const handleDeleteCapture = () => {
    setShowModal(false);
    setCurrentCapture(null);
    setDescription("");
    setQuantity(1);
  };

  const handleUploadCapture = async () => {
    if (!currentCapture) return;

    const { image, blob, lat, long, prediction, points } = currentCapture;

    try {
      const formData = new FormData();
      formData.append("image", blob);
      formData.append("lat", lat);
      formData.append("long", long);
      formData.append("email", state.email);
      formData.append("description", description);
      formData.append("quantity", quantity);

      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:4000/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const capturedData = {
        userId: state.userId,
        image: image,
        prediction: prediction,
        latitude: lat,
        longitude: long,
        date: new Date().toISOString(),
        points: points,
        description: description,
        quantity: quantity,
        email: state.email,
      };

      setCapturedImages((prevImages) => [...prevImages, capturedData]);
      setCurrentPoints((prevPoints) => prevPoints + points); // Update points
      setShowModal(false);
      setCurrentCapture(null);
      setDescription("");
      setQuantity(1);

      await saveData(capturedData);
    } catch (error) {
      console.error("Error uploading image:", error);
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

  const saveData = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/save-data",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div
      className={styles.scannerContainer}
      style={{
        height: "100vh",
        width: "100vw",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage}) no-repeat center center fixed`,
        backgroundSize: "cover",
        color: "#fff",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <header className={styles.header}>
        <div className={styles.points}>
          <i id="icon" className="fas fa-coins coin-icon"></i>
          Current Points: {currentPoints}
        </div>
        <button
          onClick={() => navigate("/redeem")}
          className={styles.redeemButton}
        >
          Redeem Your Points
        </button>
      </header>
      <div className={styles.container}>
        <div className={styles.cameraVideo}>
          <h1>Hello User, Please Scan your plastic &darr;</h1>
          <video ref={videoRef} width="500" height="340" muted autoPlay />
          <button
            className={styles.scnbutton}
            onClick={handleCaptureClick}
          ></button>
        </div>
        <div className={styles.cameraSnapshot}>
          <div className={styles.scrollableContainer}>
            {capturedImages.map((img, index) => (
              <div key={`capture-${index}`} className={styles.imageContainer}>
                <img
                  src={img.image}
                  alt={`Capture ${index}`}
                  className={styles.capturedImage}
                />
                <p>Prediction: {img.prediction}</p>
                <p>Latitude: {img.latitude}</p>
                <p>Longitude: {img.longitude}</p>
                <p>Date: {new Date(img.date).toLocaleString()}</p>
                <p>Points: {img.points}</p>
                <p>Description: {img.description}</p>
                <p>Quantity: {img.quantity}</p>
              </div>
            ))}
            {allImages.map((image, index) => (
              <div key={`gallery-${index}`} className={styles.imageContainer}>
                <img
                  src={image.url}
                  alt={`Gallery ${index}`}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Details</h2>
            {currentCapture && (
              <>
                <img
                  src={currentCapture.image}
                  alt="Current Capture"
                  className={styles.modalImage}
                />
                <p>Prediction: {currentCapture.prediction}</p>
                <p>Points: {currentCapture.points}</p>
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
            <button onClick={handleDeleteCapture}>Cancel</button>
            <button onClick={handleUploadCapture}>Upload</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scanner;
