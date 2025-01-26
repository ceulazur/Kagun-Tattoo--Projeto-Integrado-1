import React, { useEffect, useRef } from "react";
import { BsPencil, BsTrash, BsXLg } from "react-icons/bs";

const CalendarPopUp = ({
  coordinates,
  openPopUp,
  setOpenPopUp,
  appointment,
}) => {
  const popUpRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setOpenPopUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenPopUp]);

  return (
    openPopUp && (
      <div
        ref={popUpRef}
        className="bg-custom-light-gray rounded p-3 shadow-lg"
        style={{
          top: coordinates.y,
          left: coordinates.x,
          position: "absolute",
          width: "300px",
          zIndex: 100,
        }}
      >
        <div className="w-100 justify-content-end align-items-center d-flex mb-2">
          <div className="d-flex gap-3">
            <BsTrash size={16} className="button-icon" />
            <BsPencil size={16} className="button-icon" />
            <BsXLg
              size={16}
              className="button-icon"
              onClick={() => setOpenPopUp(false)}
            />
          </div>
        </div>
        <div>
          <p>
            <strong>Cliente:</strong> {appointment.nomeCliente}
          </p>
          <p>
            <strong>Data:</strong> {appointment.horario.toLocaleDateString()}
          </p>
          <p>
            <strong>Hora:</strong> {appointment.horario.toLocaleTimeString()}
          </p>
        </div>
      </div>
    )
  );
};

export default CalendarPopUp;
