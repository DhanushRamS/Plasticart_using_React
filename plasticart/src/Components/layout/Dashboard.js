import React, { useState, useEffect } from "react";
import VendorNav from "../pageviews/VendorNav";
import "../pageviews/dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collectionGroup,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { appAuth, appFirestore } from "../../config";
import { requestForToken, onMessageListener } from "../../config";

const Dashboard = ({ email }) => {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    requestForToken();
    onMessageListener()
      .then((payload) => {
        console.log("Message received. ", payload);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          payload,
        ]);
      })
      .catch((err) => console.log("Failed to receive message. ", err));
  }, []);

  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    if (state?.successMessage) {
      alert(state.successMessage); // Show success message as an alert or any other way you prefer
    }
  }, [state]);

  const fetchPickups = async () => {
    try {
      const pickup = query(collectionGroup(appFirestore, "PICKUP"));
      const querySnapshot = await getDocs(pickup);
      let pick_ups = [];
      let completed = [];
      let notification = [];
      querySnapshot.forEach((doc) => {
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
        if (
          doc.data().status === "pending" &&
          doc.data().vendor === appAuth.currentUser.email &&
          doc.data().isSeen !== true
        ) {
          const _notification = {
            id: doc.id,
            data: doc.data(),
            timestamp: doc.data().timestamp,
          };
          notification.push(_notification);
        }
      });
      setAssignedPickups(pick_ups);
      setCompletedPickups(completed);
      setNotifications(notification);
    } catch (error) {
      console.error("Error fetching pickups:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      for (const notif of notifications) {
        try {
          await setDoc(
            doc(appFirestore, "USER", notif.data.email, "PICKUP", notif.id),
            { isSeen: true },
            { merge: true }
          );
        } catch (error) {
          console.error("Error marking notification as read:", notif, error);
        }
      }
      fetchPickups();
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  const handleMarkAsDone = (pickup) => {
    navigate("/vendor-scanner", { state: { pickup } });
  };

  const handleNavigate = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank");
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <button
                  type="button"
                  className="hover:underline hover:bg-transparent"
                  onMouseDown={markNotificationsAsRead}
                >
                  Mark as Read
                </button>
              </div>
              <table className="notification-table">
                <tbody>
                  {notifications.map((notification, index) => (
                    <tr key={index}>
                      <td>New Pickup Notification! Check Assigned Pickups</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "assigned" && (
            <div className="pickup-list">
              <h2 className="text-2xl font-bold">Assigned Pickups</h2>
              <ul>
                {assignedPickups.map((pickup) => (
                  <li
                    key={pickup.id}
                    className="flex flex-col item-start justify-start w-full"
                  >
                    <div className="flex flex-wrap space-x-3">
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
                        <p>Status: {pickup.data.status}</p>
                      </div>
                    </div>
                    <div className="w-full flex justify-end items-center space-x-3 mt-4">
                      <button
                        onClick={() =>
                          handleNavigate(
                            pickup.data.latitude,
                            pickup.data.longitude
                          )
                        }
                        className="text-base font-light hover:underline navigate"
                      >
                        Navigate
                      </button>
                      <button
                        onClick={() => handleMarkAsDone(pickup)}
                        className="text-base font-light hover:underline complete"
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
              <h2 className="text-2xl font-bold">Completed Pickups</h2>
              <ul>
                {completedPickups.map((pickup) => (
                  <li
                    key={pickup.id}
                    className="flex flex-col item-start justify-start w-full"
                  >
                    <div className="flex flex-wrap space-x-3">
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
