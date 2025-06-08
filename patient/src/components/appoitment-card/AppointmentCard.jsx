import { MapPin, Calendar } from "lucide-react";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { formatAppointmentDate } from "../../utils/functions";

function AppointmentCard({ data }) {
  const statusColorMap = {
    pending: "text-yellow-500",
    confirmed: "text-green-600",
    cancelled: "text-red-500",
    completed: "text-blue-500",
    ongoing: "text-purple-500",
    missed: "text-red-500 line-through",
    requested: "text-orange-500",
  };
  const statusMessageMap = {
    pending: "Please wait for confirmation.",
    confirmed: "Please arrive 10 minutes early to your appointment.",
    cancelled: "No further action is required.",
    completed: "",
    ongoing: "Your appointment is currently in progress.",
    missed: "Please contact us to reschedule.",
    requested: "Please await a response from the clinic.",
  };
  return (
    <div
      style={{ width: "32%" }}
      className=" bg-white rounded-lg flex flex-col shadow-md py-6 px-10"
    >
      {/* Confirmation Banner */}
      {data.status === "confirmed" && (
        <div className="flex items-center mb-6">
          <FaCircleCheck className="text-green-500 mr-2" />
          <span className="text-green-500 font-medium">
            Your appointment is confirmed
          </span>
        </div>
      )}

      {/* Appointment Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Appointment scheduled
      </h1>

      {/* Person Info */}
      <div className=" flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden flex-shrink-0">
          <img
            src={import.meta.env.VITE_UPLOADS_DIR + data.doctor.img}
            alt={data.doctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-gray-600">
          with {data.doctor.firstName} {data.doctor.lastName}
        </span>
      </div>
      <p className="!mb-6">
        your appointment with {data.doctor.firstName} {data.doctor.lastName} is{" "}
        <i>
          <strong className={statusColorMap[data.status] || "text-black"}>
            {data.status}
          </strong>
        </i>
        . {statusMessageMap[data.status] || ""} {data.status === "completed" && (<span>check your <Link to="/exams" className="text-blue-500">report</Link></span>)}
      </p>

      {/* Location */}
      <div className="flex gap-5 items-center">
        <div className="center__img w-10 h-10 rounded-md overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={import.meta.env.VITE_UPLOADS_DIR + data.center.img}
            alt={"center"}
          />
        </div>
        <div className="">
          <h2 className="font-bold text-gray-800 mb-1">{data.center.name}</h2>
          <div className="flex items-center text-xs text-blue-500">
            <MapPin size={18} className="mr-1" />
            <span>{data.center.address}</span>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-gray-50 py-4 rounded-lg mb-6 flex items-start">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
          <Calendar className="text-blue-500" size={20} />
        </div>
        <div>
          <div className="text-gray-500 text-sm mb-1">DATE & TIME</div>
          <div className="text-gray-800 text-xs">
            {formatAppointmentDate(data.appointmentDate, data.duration)}
          </div>
        </div>
      </div>

      {/* Reschedule Button */}
      {(data.status === "pending" ||
        data.status === "confirmed" ||
        data.status === "requested") && (
        <div className="flex gap-5 mt-auto justify-between">
          <button className="text-blue-500 border border-blue-500 rounded-md py-2 px-4 text-xs text-center">
            Reschedule appointment
          </button>
          <button className="text-white bg-red-500 border border-red-500 rounded-md py-2 px-4 text-center">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
