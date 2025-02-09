import {
  differenceInMinutes,
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { HOURS, WEEK_DAYS } from "../../utils/constants";
import CalendarPopUp from "./modals/CalendarPopUp";

const SemanaView = ({
  currentDate,
  appointments,
  handleEdit,
  handleDelete,
}) => {
  const [weekAppointments, setWeekAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpCoordinates, setPopUpCoordinates] = useState(null);

  const start = startOfWeek(currentDate, { locale: ptBR });
  const end = endOfWeek(currentDate, { locale: ptBR });
  const days = eachDayOfInterval({ start, end });

  const weekDays = WEEK_DAYS;
  const hours = HOURS;

  useEffect(() => {
    console.log("appointments", appointments);
    if (appointments) {
      const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.horario);
        return (
          // format(appointmentDate, "MM") === format(currentDate, "MM") &&
          format(appointmentDate, "yyyy") === format(currentDate, "yyyy")
        );
      });

      console.log("filteredAppointments", filteredAppointments);
      setWeekAppointments(filteredAppointments);
    }
  }, [appointments, currentDate]);

  return (
    <div className="bg-white rounded d-flex flex-column h-100">
      <CalendarPopUp
        coordinates={popUpCoordinates}
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        appointment={selectedAppointment}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <div className="d-flex w-100">
        <div
          className="flex-fill text-center fw-bold fs-7 border-bottom py-1"
          style={{ width: "50px" }}
        ></div>
        {days.map((day, index) => (
          <div
            key={day}
            className="flex-fill text-center fw-bold fs-7 border-bottom py-1 d-flex flex-column justify-content-center align-items-center"
            style={{ width: "14.28%" }}
          >
            <div>{weekDays[index]}</div>

            <div
              className={`d-flex p-1 rounded-circle aspect-ratio-1 justify-content-center align-items-center 
                    ${isToday(day) ? "bg-custom-primary text-white" : ""}`}
              style={{ width: "32px", height: "32px" }}
            >
              {format(day, "d", { locale: ptBR })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        {hours.map((hour) => (
          <div key={hour} className="d-flex w-100 flex-grow-1">
            <div
              className="flex-fill text-center border-right border-bottom d-flex justify-content-center align-items-center"
              style={{ width: "50px", height: "70px" }}
            >
              {`${hour}:00`}
            </div>
            {days.map((day, dayIndex) => (
              <div
                key={day}
                className="flex-fill text-center border-right border-bottom d-flex justify-content-center"
                style={{
                  width: "14.28%",
                  height: "70px",
                  borderRight: dayIndex === 6 ? "none" : "1px solid #dee2e6",
                  borderBottom: "none",
                }}
              >
                <div className="d-flex flex-column align-items-center w-100">
                  {weekAppointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.horario);

                    const appointmentDayMatches =
                      format(appointmentDate, "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd");

                    const appointmentHourMatches =
                      appointmentDate.getUTCHours() === parseInt(hour, 10);

                    if (appointmentDayMatches && appointmentHourMatches) {
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
                            marginTop: "2px",
                            minHeight:
                              duration / 60 > 1
                                ? (70 * duration) / 60 - 2 + "px"
                                : "68px",
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
                          {appointmentDate.toLocaleTimeString("pt-BR", {
                            timeZone: "UTC",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemanaView;
