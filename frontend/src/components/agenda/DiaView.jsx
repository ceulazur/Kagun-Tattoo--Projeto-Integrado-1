import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { HOURS, WEEK_DAYS } from "../../utils/constants";

const DiaView = ({ currentDate }) => {
  const weekDays = WEEK_DAYS;
  const hours = HOURS;
  const dayOfWeekIndex = format(currentDate, "i") % 7;
  const dayOfWeek = weekDays[dayOfWeekIndex];

  return (
    <div className="bg-white rounded d-flex flex-column h-100">
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
              style={{ width: "50px" }}
            >
              {`${hour}:00`}
            </div>
            <div className="flex-fill text-center d-flex justify-content-center align-items-center w-100">
              {/* Conteúdo da célula */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaView;
