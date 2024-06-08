import React, { useRef, useEffect, useState } from "react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";

export function Locations({ pickups }) {
  const mapElement = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const map = tt.map({
        key: "PTjG7SqhY4KvAtoCVvtVi1X0lxKMqhKF",
        container: mapElement.current,
        center: [77.59369, 12.97194],
        zoom: 12,
      });

      setMap(map);

      return () => map.remove();
    };

    if (!map) {
      initializeMap();
    } else {
      const createMarker = (lat, long, isCompleted, img) => {
        const el = document.createElement("div");
        el.className = "marker";

        if (isCompleted) {
          el.style.backgroundColor = "green";
          el.style.borderRadius = "50%";
          el.style.width = "30px";
          el.style.height = "30px";
          el.style.display = "flex";
          el.style.justifyContent = "center";
          el.style.alignItems = "center";
          el.innerHTML = "&#10003;"; // Unicode character for a tick
          el.style.color = "white";
          el.style.fontWeight = "bold";
        } else {
          el.style.backgroundColor = "#ff4a18";
          el.style.borderRadius = "50%";
          el.style.width = "20px";
          el.style.height = "20px";
        }

        const marker = new tt.Marker({ element: el })
          .setLngLat([long, lat])
          .addTo(map);

        const popup = new tt.Popup({ offset: [0, -30] }).setHTML(
          `<img src=${img} alt="uploaded image" style="width:100px;height:100px;"/>`
        );
        marker.setPopup(popup);
      };

      pickups.forEach((pickup) => {
        if (pickup.data.latitude && pickup.data.longitude) {
          createMarker(
            parseFloat(pickup.data.latitude),
            parseFloat(pickup.data.longitude),
            pickup.data.status === "complete",
            pickup.data.image
          );
        }
      });
    }
  }, [pickups, map]);

  return (
    <div style={{ height: "78vh", width: "100%" }}>
      <div ref={mapElement} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
