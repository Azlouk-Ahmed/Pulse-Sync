import { Dot } from "lucide-react";


function CetnerBanner({center}) {
    const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse open/close times ("H:mm" or "HH:mm")
  const [openH, openM] = center.openTime.split(":").map(Number);
  const [closeH, closeM] = center.closingTime.split(":").map(Number);
  const openTotal = openH * 60 + openM;
  const closeTotal = closeH * 60 + closeM;

  // Determine open/closed, accounting for overnight spans
  const isOvernight = closeTotal <= openTotal;
  const isOpen = isOvernight
    ? nowMinutes >= openTotal || nowMinutes < closeTotal
    : nowMinutes >= openTotal && nowMinutes < closeTotal;
  return (
    <div className="w-full flex justify-center bg-white p-5 gap-5 mb-5">
      <div className="flex flex-1/4 gap-5">
        <div className="center__img w-25  h-25 rounded-md overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={import.meta.env.VITE_UPLOADS_DIR + center.img}
            alt=""
          />
        </div>
        <div className="center__info flex flex-1 flex-col justify-around">
          <h2 className="center__name font-bold text-xl">{center.name}</h2>
          <p className="center__desc flex items-center gap-3">
            <span
              className={`font-bold flex items-center ${
                isOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              <Dot /> {isOpen ? "open" : "closed"}
            </span>
            {isOpen ? (
              <>- closes at {center.closingTime}</>
            ) : (
              <>- opens at {center.openTime}</>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <div>{center.address} </div>
        <div>{center.email} </div>
      </div>

      <div className="flex flex-1/4 justify-around">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-location-dot"></i>
          <p className="text-sm">{center.governorate}</p>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-phone"></i>
          <p className="text-sm">{center.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default CetnerBanner;
