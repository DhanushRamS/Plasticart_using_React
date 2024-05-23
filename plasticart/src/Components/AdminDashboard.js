import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import {
  collectionGroup,
  doc,
  getDocs,
  increment,
  query,
  setDoc,
} from "firebase/firestore";
import { appAuth, appFirestore } from "../config";
import venStyles from "./Vendor.module.css";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const AdminDashboard = () => {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("completed");
  const [openDropdown, setOpenDropdown] = useState(false);
  // const [pointsAdded, setPointsAdded] = useState(false);
  const navigate = useNavigate();
  const [totalPointsValue, setTotalPointsValue] = useState(0);
  const handleLogout = async () => {
    await signOut(appAuth).then(() => {
      navigate("/admin-auth");
    });
  };
  const fetchCompletedPickups = async () => {
    try {
      const pickup = query(collectionGroup(appFirestore, "PICKUP"));
      const querySnapshot = await getDocs(pickup);
      let completed = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().status === "complete") {
          const complete = { id: doc.id, data: doc.data() };
          completed.push(complete);
        }
      });
      setCompletedPickups(completed);
    } catch (error) {
      setError("Error fetching completed pickups");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCompletedPickups();
  }, []);

  const handleAssignPoints = async (userId, points) => {
    try {
      await axios.post(
        `http://localhost:5000/admin/assign-points/${userId}`,
        { points },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Optionally, update the UI or provide feedback to the user
    } catch (error) {
      console.error("Error assigning points:", error);
    }
  };

  return (
    <div className="dashboard container">
      <header className={venStyles.header}>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <nav>
          <ul className={venStyles.navigation}>
            <li className={venStyles.hamburger}>
              <a href="#" onClick={() => setOpenDropdown(!openDropdown)}>
                <div className={venStyles.bar}></div>
                <div className={venStyles.bar}></div>
                <div className={venStyles.bar}></div>
              </a>
              {openDropdown && (
                <ul>
                  <li>
                    <button
                      onClick={handleLogout}
                      className={venStyles.logoutButton}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Pickups
          </button>
          <button
            disabled
            className={`tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          ></button>
          <button
            disabled
            className={`tab ${activeTab === "assigned" ? "active" : ""}`}
            onClick={() => setActiveTab("assigned")}
          ></button>
        </div>
        <div className="tab-content">
          {activeTab === "completed" && (
            <div className="pickup-list">
              <h2>Completed Pickups</h2>
              <ul>
                {completedPickups.map((pickup, i) => (
                  <li
                    key={pickup.id}
                    className="flex flex-col item-start justify-start w-full"
                  >
                    <div className="flex space-x-3">
                      <img
                        src={pickup.data.image}
                        alt="Pickup"
                        className="pickup-image"
                      />
                      <div className="flex items-start justify-start space-y-3 flex-col">
                        <p>Prediction: {pickup.data.prediction}</p>
                        <p>Latitude: {pickup.data.latitude}</p>
                        <p>Longitude: {pickup.data.longitude}</p>
                        <p>Description: {pickup.data.description}</p>
                        <p>Quantity: {pickup.data.quantity}</p>
                      </div>
                    </div>
                    {pickup.data.pointsAssigned ? (
                      <>
                        <span className="!text-sm !font-bold !text-green-800">Points Successfully Assigned</span>
                      </>
                    ) : (
                      <div className="w-full lg:w-1/3 flex justify-end items-center space-x-3 mt-4">
                        <input
                          type="number"
                          id={i}
                          value={totalPointsValue}
                          step={5}
                          min={0}
                          onChange={(e) => setTotalPointsValue(e.target.value)}
                          className="w-1/3 !bg-gray-100 !border-blue-200 !text-black"
                        />
                        <button
                          onClick={async () => {
                            await setDoc(
                              doc(appFirestore, "USER", pickup.data.email),
                              {
                                points: increment(totalPointsValue),
                              },
                              { merge: true }
                            );
                            await setDoc(
                              doc(
                                appFirestore,
                                "USER",
                                pickup.data.email,
                                "PICKUP",
                                pickup.id
                              ),
                              {
                                pointsAssigned: true,
                              },
                              { merge: true }
                            );
                            await fetchCompletedPickups();
                          }}
                          className="text-base font-light bg-gray-500 hover:bg-gray-800 p-3 text-white w-1/2"
                        >
                          Assign Point
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
