import React, { useState, useEffect } from "react";
import axios from "axios";
import VendorNav from "../VendorNav";
import "../dashboard.css";
import { useLocation } from "react-router-dom";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { appAuth, appFirestore } from "../../config";

const Dashboard = ({ email }) => {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");
  const { state } = useLocation();
  const fetchPickups = async () => {
    try {
     
      const pickup = query(collectionGroup(appFirestore, "PICKUP"));
      const querySnapshot = await getDocs(pickup);
      let pick_ups = [];
      let completed = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        if (
          doc.data().status === "pending" &&
          doc.data().vendor === appAuth.currentUser.email
        ) {
          const pickup = { id: doc.id, data: doc.data() };
          pick_ups.push(pickup);
        }
        if (
          doc.data().status === "complete" &&
          doc.data().vendor === appAuth.currentUser.email
        ) {
          const complete = { id: doc.id, data: doc.data() };
          completed.push(complete);
        }
      });
      setAssignedPickups(pick_ups);
      setCompletedPickups(completed);
    } catch (error) {
      console.error("Error fetching pickups:", error);
    }
  };
  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    const pollPickups = async () => {
      try {
        // const response = await axios.get(
        //   `http://localhost:5000/poll-pickups/${email}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     },
        //   }
        // );
        // if (response.data.length > 0) {
        //   setAssignedPickups((prev) => [...prev, ...response.data]);
        //   const newNotifications = response.data.map((pickup) => ({
        //     message: "New Pickup Assigned! Please check Assigned Pickups tab!",
        //     timestamp: new Date().toLocaleString(),
        //     pickupId: pickup._id,
        //   }));
        //   setNotifications((prev) => [...prev, ...newNotifications]);
        // }
        // setTimeout(pollPickups, 5000);
      } catch (error) {
        console.error("Error polling pickups:", error);
        setTimeout(pollPickups, 5000);
      }
    };

    pollPickups();
  }, [state?.email]);

  const handleMarkAsDone = async (email, id) => {
    try {
      await setDoc(
        doc(appFirestore, "USER", email, "PICKUP", id),
        {
          status: "complete",
        },
        { merge: true }
      );
      fetchPickups();
    } catch (error) {
      console.error("Error marking pickup as done:", error);
    }
  };

  const handleNavigate = (pickupId) => {
    console.log("Navigate to pickup", pickupId);
  };

  const handleClearData = () => {
    setAssignedPickups([]);
    setCompletedPickups([]);
    setNotifications([]);
    localStorage.removeItem(`assignedPickups_${email}`);
    localStorage.removeItem(`completedPickups_${email}`);
    localStorage.removeItem(`notifications_${email}`);
  };

  return (
    <div className="dashboard container">
      <VendorNav />
      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === "assigned" ? "active" : ""}`}
            onClick={() => setActiveTab("assigned")}
          >
            Assigned Pickups
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Pickups
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "notifications" && (
            <div className="notification-list">
              <h2>Notifications</h2>
              {notifications.map((notification, index) => (
                <div key={index} className="notification-box">
                  <p>{notification.message}</p>
                  <p className="timestamp">{notification.timestamp}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "assigned" && (
            <div className="pickup-list">
              <h2>Assigned Pickups</h2>
              <ul>
                {assignedPickups.map((pickup) => (
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
                    <div className="w-full flex justify-end items-center space-x-3 mt-4">
                      <button
                        onClick={() => handleNavigate(pickup.id)}
                        className="text-base font-light hover:underline"
                      >
                        Navigate
                      </button>
                      <button
                        onClick={() =>
                          handleMarkAsDone(pickup.data.email, pickup.id)
                        }
                        className="text-base font-light hover:underline"
                      >
                        Complete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "completed" && (
            <div className="pickup-list">
              <h2>Completed Pickups</h2>
              <ul>
                {completedPickups.map((pickup) => (
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

export default Dashboard;
