import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { WEEK_DAYS } from "../../utils/constants";
import CalendarPopUp from "./modals/CalendarPopUp";

const MesView = ({ currentDate, apoointments }) => {
  const [monthAppointments, setMonthAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpCoordinates, setPopUpCoordinates] = useState(null);
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const startWeek = startOfWeek(start, { locale: ptBR });
  const endWeek = endOfWeek(end, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: startWeek, end: endWeek });

  const weekDays = WEEK_DAYS;

  const weeks = [];
  let week = [];

  calendarDays.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0) {
      weeks.push(week);
      week = [];
    }
  });

  useEffect(() => {
    const filteredAppointments = apoointments.filter(
      (apoointment) =>
        format(new Date(apoointment.data), "MM") === format(currentDate, "MM")
    );

    setMonthAppointments(filteredAppointments);
  }, [apoointments, currentDate]);

  return (
    <div className="bg-white rounded d-flex flex-column h-100">
      <CalendarPopUp
        coordinates={popUpCoordinates}
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        appointment={selectedAppointment}
      />
      <div className="d-flex w-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex-fill text-center fw-bold fs-7 border-bottom py-1"
            style={{ width: "14.28%" }}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        {weeks.map((week, index) => (
          <div key={index} className="d-flex w-100 flex-grow-1">
            {week.map((day, dayIndex) => (
              <div
                key={day}
                className={`text-center border-right border-bottom d-flex flex-column align-items-center justify-content-between p-1 
                   ${
                     format(day, "MM") !== format(currentDate, "MM")
                       ? "text-muted"
                       : ""
                   } `}
                style={{
                  width: "14.28%",
                  height: "170px",
                  borderRight: dayIndex === 6 ? "none" : "1px solid #dee2e6",
                  borderBottom:
                    index === weeks.length - 1 ? "none" : "1px solid #dee2e6",
                }}
              >
                <span
                  className={` d-flex p-1 rounded-circle aspect-ratio-1  justify-content-center align-items-center 
                    ${isToday(day) ? "bg-custom-primary text-white" : ""}`}
                  style={{ width: "32px", height: "32px" }}
                >
                  {format(day, "d", { locale: ptBR })}
                </span>

                <div
                  className="d-flex flex-column align-items-center  w-100"
                  style={{ overflow: "auto" }}
                >
                  {monthAppointments.map((appointment) =>
                    format(new Date(appointment.data), "dd") ===
                    format(day, "dd") ? (
                      <div
                        key={appointment.id}
                        className="button button-primary text-left mb-1"
                        style={{
                          cursor: "pointer",
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
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesView;
