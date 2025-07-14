import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.event);

  return (
    <div>
      {allEvents && (
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <div className="w-full flex items-center justify-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold font-[Poppins] text-emerald-700 drop-shadow-lg tracking-wide">
              Popular <span className="text-amber-500">Events</span>
            </h1>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-6">
            {allEvents.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]} />
            )}
            <h4 className="text-slate-400 font-semibold">{allEvents?.length === 0 && "No Events have!"}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;