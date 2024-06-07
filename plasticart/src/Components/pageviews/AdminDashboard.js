import React, { useEffect, useState } from "react";
import {
  collectionGroup,
  doc,
  getDocs,
  increment,
  query,
  setDoc,
} from "firebase/firestore";
import { appAuth, appFirestore } from "../../config";
import venStyles from "./Vendor.module.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const AdminDashboard = () => {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [pointsAssignedPickups, setPointsAssignedPickups] = useState([]);
  const [setError] = useState(null);
  const [activeTab, setActiveTab] = useState("completed");
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const [totalPointsValues, setTotalPointsValues] = useState({});

  const handleInputChange = (id, value) => {
    setTotalPointsValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleAssignPoints = async (id, email, docID) => {
    const totalPointsValue = totalPointsValues[id];
    if (totalPointsValue === undefined) {
      return;
    }

    await setDoc(
      doc(appFirestore, "USER", email),
      {
        points: increment(totalPointsValue),
      },
      { merge: true }
    );
    await setDoc(
      doc(appFirestore, "USER", email, "PICKUP", docID),
      {
        pointsAssigned: true,
      },
      { merge: true }
    );
    await fetchCompletedPickups();
  };

  const handleLogout = async () => {
    await signOut(appAuth).then(() => {
      navigate("/");
    });
  };

  const fetchCompletedPickups = async () => {
    try {
      const pickup = query(collectionGroup(appFirestore, "PICKUP"));
      const querySnapshot = await getDocs(pickup);
      let completed = [];
      let pointsAssigned = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().status === "complete") {
          const complete = { id: doc.id, data: doc.data() };
          if (doc.data().pointsAssigned) {
            pointsAssigned.push(complete);
          } else {
            completed.push(complete);
          }
        }
      });
      setCompletedPickups(completed);
      setPointsAssignedPickups(pointsAssigned);
    } catch (error) {
      setError("Error fetching completed pickups");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompletedPickups();
  }, []);

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
            className={`tab ${activeTab === "pointsAssigned" ? "active" : ""}`}
            onClick={() => setActiveTab("pointsAssigned")}
          >
            Points Assigned
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "completed" && (
            <div className="pickup-list">
              <h1 className="comp">Completed Pickups</h1>
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
                        <p>User: {pickup.data.email}</p>
                        <p>Prediction: {pickup.data.prediction}</p>
                        <p>Latitude: {pickup.data.latitude}</p>
                        <p>Longitude: {pickup.data.longitude}</p>
                        <p>Description: {pickup.data.description}</p>
                        <p>Quantity: {pickup.data.quantity}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-1/3 flex justify-end items-center space-x-3 mt-4">
                      <input
                        type="number"
                        id={i}
                        value={totalPointsValues[i] || 0}
                        step={5}
                        min={0}
                        onChange={(e) => handleInputChange(i, e.target.value)}
                        className="w-1/3 !bg-gray-100 !border-blue-200 !text-black"
                      />
                      <button
                        onClick={() =>
                          handleAssignPoints(i, pickup.data.email, pickup.id)
                        }
                        className="text-base font-light bg-gray-500 hover:bg-gray-800 p-3 text-white w-1/2 mt-[20px]"
                      >
                        Assign Point
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "pointsAssigned" && (
            <div className="pickup-list">
              <h1 className="comp">Points Assigned</h1>
              <ul>
                {pointsAssignedPickups.map((pickup) => (
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
                        <p>User: {pickup.data.email}</p>
                        <p>Prediction: {pickup.data.prediction}</p>
                        <p>Latitude: {pickup.data.latitude}</p>
                        <p>Longitude: {pickup.data.longitude}</p>
                        <p>Description: {pickup.data.description}</p>
                        <p>Quantity: {pickup.data.quantity}</p>
                        <p className="!text-sm !font-bold !text-green-800">
                          Points Successfully Assigned
                        </p>
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

export default AdminDashboard;
