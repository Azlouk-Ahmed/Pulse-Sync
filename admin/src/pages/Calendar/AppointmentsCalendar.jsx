import { useState, useRef } from "react";
import "@fullcalendar/react/dist/vdom";
import Lucide from "../../base-components/Lucide";
import { Menu } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import GeneralisteCalendar from "../../components/Calendar/GeneralisteCalendar";

function Main() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "VueJS Amsterdam",
      minutes: 2,
      color: "bg-pending",
      time: "10:00 AM",
    },
    {
      id: 2,
      title: "Vue Fes Japan 2024",
      minutes: 3,
      color: "bg-warning",
      time: "07:00 AM",
    },
    {
      id: 3,
      title: "Laracon 2025",
      minutes: 4,
      color: "bg-pending",
      time: "11:00 AM",
    },
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    minutes: 0,
    color: "bg-pending",
    time: "",
  });

  // Store draggable options as a ref to prevent recreation on every render
  const dragableOptionsRef = useRef({
    itemSelector: ".event",
    eventData(eventEl) {
      const getMinutes = () => {
        const minutes = eventEl.querySelector(".event__minutes")?.textContent;
        return minutes ? parseInt(minutes) : 0;
      };
      return {
        title: eventEl.querySelector(".event__title")?.textContent,
        duration: { minutes: getMinutes() },
      };
    },
  });

  const handleAddEvent = () => {
    const nextId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    setEvents([
      ...events,
      {
        id: nextId,
        title: newEvent.title || "Untitled Event",
        minutes: newEvent.minutes || 0,
        color: newEvent.color || "bg-pending",
        time: newEvent.time || "12:00 PM",
      },
    ]);
    setNewEvent({ title: "", minutes: 0, color: "bg-pending", time: "" });
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Calendar</h2>
        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
          <Button variant="primary" className="mr-2 shadow-md">
            generaliste calendar
          </Button>
          <Menu className="ml-auto sm:ml-0">
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Share2" className="w-4 h-4 mr-2" /> Share
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="Settings" className="w-4 h-4 mr-2" /> Settings
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      <div className=" mt-5">

        <div className="">
          <div className="p-5 box">
            sdfsdfsdfsdf
            <GeneralisteCalendar />
          </div>
        </div>
        {/* END: Calendar Content */}
      </div>
    </>
  );
}

export default Main;