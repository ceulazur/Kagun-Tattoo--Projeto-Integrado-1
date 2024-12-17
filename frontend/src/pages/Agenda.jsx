import {
  addDays,
  addMonths,
  addWeeks,
  format,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import DiaView from "../components/agenda/DiaView";
import MesView from "../components/agenda/MesView";
import SemanaView from "../components/agenda/SemanaView";

const Agenda = () => {
  const [view, setView] = useState(() => {
    return localStorage.getItem("agendaView") || "month";
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("agendaView", view);
  }, [view]);

  const handleDateChange = (operation) => {
    const operationMap = {
      prev: {
        day: subDays,
        week: subWeeks,
        month: subMonths,
      },
      next: {
        day: addDays,
        week: addWeeks,
        month: addMonths,
      },
    };
    const selectedOperation = operationMap[operation][view];
    setCurrentDate(selectedOperation(currentDate, 1));
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const formatDate = () => {
    if (view === "day") {
      return format(currentDate, "dd/MM/yyyy", { locale: ptBR });
    } else if (view === "week") {
      return `Semana de ${format(currentDate, "dd/MM/yyyy", { locale: ptBR })}`;
    } else {
      return capitalizeFirstLetter(
        format(currentDate, "MMMM yyyy", { locale: ptBR })
      );
    }
  };

  return (
    <div className="d-flex flex-column h-100 w-100">
      <section className="bg-white px-3 py-2 ant-rounded d-flex mb-3">
        <div className="d-flex align-items-center justify-content-around w-50">
          <button onClick={() => handleDateChange("prev")}>
            <BsChevronLeft />
          </button>
          <div className="w-50 text-center">{formatDate()}</div>
          <button onClick={() => handleDateChange("next")}>
            <BsChevronRight />
          </button>
        </div>
        <span className="border"></span>
        <div className="d-flex align-items-center justify-content-around w-100 ">
          <button
            className={
              view === "month" ? "button-text-primary" : "button-text-gray"
            }
            onClick={() => setView("month")}
          >
            Mês
          </button>
          <button
            className={
              view === "week" ? "button-text-primary" : "button-text-gray"
            }
            onClick={() => setView("week")}
          >
            Semana
          </button>
          <button
            className={
              view === "day" ? "button-text-primary" : "button-text-gray"
            }
            onClick={() => setView("day")}
          >
            Dia
          </button>
        </div>
        <span className="border"></span>
        <div className="d-flex align-items-center justify-content-around w-50 pl-3">
          <button className="button button-primary w-100">
            <BsPlus size={24} /> Novo agendamento
          </button>
        </div>
      </section>

      {view === "month" && <MesView currentDate={currentDate} />}
      {view === "week" && <SemanaView currentDate={currentDate} />}
      {view === "day" && <DiaView currentDate={currentDate} />}
    </div>
  );
};

export default Agenda;
