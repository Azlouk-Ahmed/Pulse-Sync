import { Dot } from "lucide-react";
import { Link } from "react-router-dom";
import "./center.css";

function Center({ data }) {
  // Compute current time in minutes since midnight
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse open/close times ("H:mm" or "HH:mm")
  const [openH, openM] = data.openTime.split(":").map(Number);
  const [closeH, closeM] = data.closingTime.split(":").map(Number);
  const openTotal = openH * 60 + openM;
  const closeTotal = closeH * 60 + closeM;

  // Determine open/closed, accounting for overnight spans
  const isOvernight = closeTotal <= openTotal;
  const isOpen = isOvernight
    ? nowMinutes >= openTotal || nowMinutes < closeTotal
    : nowMinutes >= openTotal && nowMinutes < closeTotal;

  return (
    <div className="center flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="center__img w-16 h-16 rounded-md overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={import.meta.env.VITE_UPLOADS_DIR + data.img}
            alt={data.name}
          />
        </div>
        <div className="center__info flex flex-1 flex-col justify-around">
          <h2 className="center__name font-bold text-xl">{data.name}</h2>
          <p className="center__desc flex items-center gap-3">
            <span
              className={`font-bold flex items-center ${
                isOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              <Dot /> {isOpen ? "open" : "closed"}
            </span>
            {isOpen ? (
              <>- closes at {data.closingTime}</>
            ) : (
              <>- opens at {data.openTime}</>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <p>{data.address}</p>
        <p>{data.email}</p>
      </div>

      <div className="flex justify-around text-sm">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-location-dot"></i>
          <span>{data.governorate}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-phone"></i>
          <span>{data.phone}</span>
        </div>
      </div>

      <Link to={`/centers/${data._id}`} className="btn ml-auto mt-2">
        view doctors
      </Link>
    </div>
  );
}

export default Center;
