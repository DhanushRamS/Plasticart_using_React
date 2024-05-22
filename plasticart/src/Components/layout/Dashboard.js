import React, { useState, useEffect } from "react";
import axios from "axios";
import VendorNav from "../VendorNav";
import "../dashboard.css";

const Dashboard = ({ email }) => {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/vendor/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAssignedPickups(
          response.data.filter((pickup) => pickup.status === "pending")
        );
        setCompletedPickups(
          response.data.filter((pickup) => pickup.status === "completed")
        );
      } catch (error) {
        console.error("Error fetching pickups:", error);
      }
    };

    fetchPickups();
  }, [email]);

  useEffect(() => {
    const pollPickups = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/poll-pickups/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.length > 0) {
          setAssignedPickups((prev) => [...prev, ...response.data]);
          const newNotifications = response.data.map((pickup) => ({
            message: "New Pickup Assigned! Please check Assigned Pickups tab!",
            timestamp: new Date().toLocaleString(),
            pickupId: pickup._id,
          }));
          setNotifications((prev) => [...prev, ...newNotifications]);
        }
        setTimeout(pollPickups, 5000);
      } catch (error) {
        console.error("Error polling pickups:", error);
        setTimeout(pollPickups, 5000);
      }
    };

    pollPickups();
  }, [email]);

  const handleMarkAsDone = async (pickupId) => {
    const completedPickup = assignedPickups.find(
      (pickup) => pickup._id === pickupId
    );
    if (completedPickup) {
      try {
        const response = await axios.post(
          `http://localhost:5000/vendor/${email}/pickups/${pickupId}/complete`,
          {
            userEmail: completedPickup.userEmail,
            image: completedPickup.image,
            prediction: completedPickup.prediction,
            latitude: completedPickup.latitude,
            longitude: completedPickup.longitude,
            description: completedPickup.description,
            quantity: completedPickup.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Completion response:", response.data);

        setAssignedPickups((prev) =>
          prev.filter((pickup) => pickup._id !== pickupId)
        );
        setCompletedPickups((prev) => [...prev, completedPickup]);
      } catch (error) {
        console.error("Error marking pickup as done:", error);
      }
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
                  <li key={pickup._id}>
                    <img
                      src={`http://localhost:5000/uploads/${pickup.image}`}
                      alt="Pickup"
                      className="pickup-image"
                    />
                    <p>Prediction: {pickup.prediction}</p>
                    <p>Latitude: {pickup.latitude}</p>
                    <p>Longitude: {pickup.longitude}</p>
                    <p>Description: {pickup.description}</p>
                    <p>Quantity: {pickup.quantity}</p>
                    <button onClick={() => handleNavigate(pickup._id)}>
                      Navigate
                    </button>
                    <button onClick={() => handleMarkAsDone(pickup._id)}>
                      Complete
                    </button>
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
                  <li key={pickup._id}>
                    <img
                      src={`http://localhost:5000/uploads/${pickup.image}`}
                      alt="Pickup"
                      className="pickup-image"
                    />
                    <p>Prediction: {pickup.prediction}</p>
                    <p>Latitude: {pickup.latitude}</p>
                    <p>Longitude: {pickup.longitude}</p>
                    <p>Description: {pickup.description}</p>
                    <p>Quantity: {pickup.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button className="clear-data-button" onClick={handleClearData}>
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
