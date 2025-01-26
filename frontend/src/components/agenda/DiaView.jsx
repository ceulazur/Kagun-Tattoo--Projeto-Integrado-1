import { differenceInMinutes, format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { HOURS, WEEK_DAYS } from "../../utils/constants";
import CalendarPopUp from "./modals/CalendarPopUp";

const DiaView = ({ currentDate, apoointments }) => {
  const [dayAppointments, setDayAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpCoordinates, setPopUpCoordinates] = useState(null);

  const weekDays = WEEK_DAYS;
  const hours = HOURS;
  const dayOfWeekIndex = format(currentDate, "i") % 7;
  const dayOfWeek = weekDays[dayOfWeekIndex];

  useEffect(() => {
    const filteredAppointments = apoointments.filter(
      (appointment) =>
        format(new Date(appointment.data), "yyyy-MM-dd") ===
        format(currentDate, "yyyy-MM-dd")
    );

    setDayAppointments(filteredAppointments);
  }, [apoointments, currentDate]);

  return (
    <div className="bg-white rounded d-flex flex-column h-100">
      <CalendarPopUp
        coordinates={popUpCoordinates}
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        appointment={selectedAppointment}
      />
      <div className="d-flex w-100 border-bottom py-1">
        <div className=" text-center fw-bold fs-7 mx-2">
          <div>{dayOfWeek}</div>
          <div
            className={`d-flex p-1 rounded-circle aspect-ratio-1 justify-content-center align-items-center 
              ${isToday(currentDate) ? "bg-custom-primary text-white" : ""}`}
            style={{ width: "32px", height: "32px" }}
          >
            {format(currentDate, "d", { locale: ptBR })}
          </div>
        </div>
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        {hours.map((hour) => (
          <div key={hour} className="d-flex w-100 flex-grow-1 border-bottom">
            <div
              className="flex-fill text-center border-right d-flex justify-content-center align-items-center"
              style={{ width: "50px", height: "70px" }}
            >
              {`${hour}:00`}
            </div>
            <div
              className="flex-fill text-center d-flex justify-content-center w-100"
              style={{ height: "70px" }}
            >
              <div className="d-flex flex-column align-items-center w-100">
                {dayAppointments.map((appointment) => {
                  const appointmentHourMatches =
                    format(appointment.horario, "HH") == hour;

                  if (appointmentHourMatches) {
                    const duration = appointment.termino
                      ? differenceInMinutes(
                          new Date(appointment.termino),
                          new Date(appointment.horario)
                        )
                      : 1;
                    return (
                      <div
                        key={appointment.id}
                        className="button button-primary text-left"
                        style={{
                          cursor: "pointer",
                          zIndex: 10,
                          marginTop: "5px",
                          minHeight:
                            duration / 60 > 1
                              ? (70 * duration) / 60 - 5 + "px"
                              : "70px",
                        }}
                        onClick={(e) => {
                          setSelectedAppointment(appointment);
                          setPopUpCoordinates({
                            x: e.clientX,
                            y: e.clientY,
                          });
                          setOpenPopUp(true);
                        }}
                      >
                        <p>{appointment?.nomeCliente}</p>
                        {appointment?.horario.toLocaleTimeString()}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaView;
