import React from "react";
import styles from "../styles/styles";
import EventCard from "../components/Events/EventCard";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import Header from "../components/Layout/Header";
 import { useSelector } from "react-redux"; // Uncomment if you want to fetch from redux state

const EventsPage = () => {
  // You can switch to Redux by uncommenting this:
   const { allEvents, isLoading } = useSelector((state) => state.event);

 console.log("this is all events" ,allEvents)
  return (


<>
{!allEvents ? (
  <Loader />
) : (
  <div>
    <Header activeHeading={2} />
    <br />
    <br />
    <div className={`${styles.section} mt-8`}>
  <div className="w-full">
    <h1 className="text-3xl font-bold text-center mb-8">All Events</h1>
    <div className="flex flex-col gap-6">
      {allEvents.map((item, index) => (
        <EventCard key={index} data={item} />
      ))}
    </div>
  </div>
</div>
    <Footer />
  </div>
)}
</>

  );
};

export default EventsPage;
