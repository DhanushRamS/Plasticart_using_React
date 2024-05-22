import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedPickups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/completed-pickups",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCompletedPickups(response.data);
      } catch (error) {
        setError("Error fetching completed pickups");
        console.error(error);
      }
    };

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
    <div className={styles.adminDashboardContainer}>
      <h1>Admin Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.completedPickups}>
        {completedPickups.map((pickup) => (
          <div key={pickup._id} className={styles.pickupItem}>
            <img
              src={pickup.image}
              alt="Pickup"
              className={styles.pickupImage}
            />
            <p>Prediction: {pickup.prediction}</p>
            <p>Latitude: {pickup.latitude}</p>
            <p>Longitude: {pickup.longitude}</p>
            <p>Description: {pickup.description}</p>
            <p>Quantity: {pickup.quantity}</p>
            <button
              onClick={() =>
                handleAssignPoints(pickup.userId, pickup.quantity * 10)
              }
            >
              Assign Points
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
