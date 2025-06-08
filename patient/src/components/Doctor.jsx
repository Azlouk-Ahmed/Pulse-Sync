import { Dot, HeartPulse, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./center/center.css";

function Doctor({ data, showCenter = true }) {
  //─── time helper ─────────────────────────────────────────────────────────────
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = data.center.openTime.split(":").map(Number);
  const [closeH, closeM] = data.center.closingTime.split(":").map(Number);
  const openTotal = openH * 60 + openM;
  const closeTotal = closeH * 60 + closeM;

  const isOvernight = closeTotal <= openTotal;
  const isOpen = isOvernight
    ? nowMinutes >= openTotal || nowMinutes < closeTotal
    : nowMinutes >= openTotal && nowMinutes < closeTotal;

  return (
    <div className="center flex flex-col gap-5">
      {/* Header: avatar + name + specialization */}
      <div className="flex gap-5">
        <div className="center__img w-16 h-16 rounded-md overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={import.meta.env.VITE_UPLOADS_DIR +data.img}
            alt={`${data.firstName} ${data.lastName}`}
          />
        </div>
        <div className="center__info flex flex-1 flex-col justify-around">
          <h2 className="center__name font-bold text-xl">
            {data.firstName} {data.lastName}
          </h2>

          {data.specialization === "radiologue" ? (
            <p className="!text-orange-600 font-bold flex items-center gap-2">
              <Stethoscope size={16} /> Radiologue
            </p>
          ) : (
            <p className="!text-green-600 font-bold flex items-center gap-2">
              <HeartPulse size={16} /> {data.specialization}
            </p>
          )}

          <p className="text-xs">
            Joined{" "}
            {formatDistanceToNow(new Date(data.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm">{data.desc}</p>

      {/* Contact + Location */}
      <div className="flex justify-around text-sm">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-location-dot" />
          <span>{data.center.governorate}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-phone" />
          <span>{data.contactNumber}</span>
        </div>
      </div>

      {/* Center info + status */}
      {showCenter && data.center && (
        <div className="flex items-center w-fit mx-auto gap-5">
          <div className="center__img w-8 h-8 rounded-md overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={import.meta.env.VITE_UPLOADS_DIR + data.center.img}
              alt={data.center.name}
            />
          </div>
          <div className="center__info flex flex-1 flex-col justify-around">
            <h2 className="text-xs">
              works at{" "}
              <Link
                to={`/centers/${data.center._id}`}
                className="text-blue-600 underline"
              >
                {data.center.name}
              </Link>
            </h2>
            <p className="center__desc flex items-center gap-3">
              <span
                className={`font-bold flex items-center ${
                  isOpen ? "text-green-600" : "text-red-600"
                }`}
              >
                <Dot /> {isOpen ? "open" : "closed"}
              </span>
              {isOpen ? (
                <>- closes at {data.center.closingTime}</>
              ) : (
                <>- opens at {data.center.openTime}</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Appointment link */}
      <Link to={`/doctors/${data._id}`} className="btn2 mx-auto mt-2">
        make an appointment
      </Link>
    </div>
  );
}

export default Doctor;
