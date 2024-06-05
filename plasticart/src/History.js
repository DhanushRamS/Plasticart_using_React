import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appAuth, appFirestore } from "./config";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./HistoryPage.css"; // Import the CSS file for additional styling

export default function History() {
  const [completedPickups, setCompletedPickups] = useState([]);
  const navigate = useNavigate();

  const fetchPickups = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(appFirestore, "USER", appAuth.currentUser?.email, "PICKUP")
      );
      let completed = [];
      querySnapshot.forEach((doc) => {
        const complete = { id: doc.id, data: doc.data() };
        completed.push(complete);
      });
      setCompletedPickups(completed);
    } catch (error) {
      console.error("Error fetching pickups:", error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(appAuth, async (user) => {
      if (user == null || user === undefined) {
        console.log("User is null or undefined");
        navigate("/Userhome");
      } else {
        await fetchPickups();
      }
    });
  }, [navigate]);

  return (
    <div className="history-page h-screen w-full items-center mx-auto flex flex-col bg-gray-800 p-6 lg:p-6 overflow-y-auto">
      <div className="flex justify-between space-x-12 items-center mt-3 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-white">Upload History</span>
        <button
          type="button"
          className="btn-scanner"
          onClick={() => {
            navigate("/scanner");
          }}
        >
          Scanner
        </button>
      </div>
      <div className="w-full mt-4 flex justify-center">
        <div className="w-full">
          <ul className="flex flex-wrap items-center gap-4 justify-center w-full">
            {completedPickups.map((pickup) => (
              <li
                key={pickup.id}
                className="pickup-card flex flex-col items-start lg:w-1/2 justify-start w-full border-white border-2 rounded-xl p-4"
              >
                <div className="flex space-x-3 w-full justify-start items-start text-white">
                  <img
                    src={pickup.data.image}
                    alt="Pickup"
                    className="pickup-image w-full lg:w-1/2 rounded-lg"
                  />
                  <div className="flex items-start justify-start space-y-3 flex-col w-1/2">
                    <p>
                      <strong>Prediction:</strong> {pickup.data.prediction}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {pickup.data.latitude}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {pickup.data.longitude}
                    </p>
                    <p>
                      <strong>Description:</strong> {pickup.data.description}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {pickup.data.quantity}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={
                          pickup.data.status === "pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }
                      >
                        {pickup.data.status}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
