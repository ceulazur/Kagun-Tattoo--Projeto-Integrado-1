import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { HOURS, WEEK_DAYS } from "../../utils/constants";

const SemanaView = ({ currentDate }) => {
  const start = startOfWeek(currentDate, { locale: ptBR });
  const end = endOfWeek(currentDate, { locale: ptBR });
  const days = eachDayOfInterval({ start, end });

  const weekDays = WEEK_DAYS;

  const hours = HOURS;

  return (
    <div className="bg-white rounded d-flex flex-column h-100">
      <div className="d-flex w-100">
        <div
          className="flex-fill text-center fw-bold fs-7 border-bottom py-1"
          style={{ width: "50px" }}
        >
          {/* Horas */}
        </div>
        {days.map((day, index) => (
          <div
            key={day}
            className="flex-fill text-center fw-bold fs-7 border-bottom py-1 d-flex flex-column justify-content-center align-items-center"
            style={{ width: "14.28%" }}
          >
            <div>{weekDays[index]}</div>

            <div
              className={` d-flex p-1 rounded-circle aspect-ratio-1  justify-content-center align-items-center 
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
              style={{ width: "50px" }}
            >
              {`${hour}:00`}
            </div>
            {days.map((day, dayIndex) => (
              <div
                key={day}
                className="flex-fill text-center border-right border-bottom d-flex justify-content-center align-items-center"
                style={{
                  width: "14.28%",
                  borderRight: dayIndex === 6 ? "none" : "1px solid #dee2e6",
                  borderBottom: "none",
                }}
              >
                {/* Conteúdo da célula */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemanaView;
