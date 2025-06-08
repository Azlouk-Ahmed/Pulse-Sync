import { formatDistanceToNow } from "date-fns";
import { HeartPulse, Stethoscope } from "lucide-react";
import { GrMail } from "react-icons/gr";

function DoctorBanner({ data }) {
return (
    <div className="w-full flex justify-center bg-white p-5 gap-5">
        <div className="flex flex-1/4 gap-5">
            <div className="center__img w-16  h-16 rounded-md overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={import.meta.env.VITE_UPLOADS_DIR + data.img}
                    alt=""
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
        <p className="flex justify-center items-center text-center">
            {data.desc}
        </p>

        <div className="flex flex-1/4 justify-around">
            <div className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i>
                <p className="text-sm">{data.center.governorate}</p>
            </div>
            <div className="flex items-center gap-2">
                <i className="fa-solid fa-phone"></i>
                <p className="text-sm">{data.contactNumber}</p>
            </div>
        </div>
        <div className="flex flex-1/4 items-center w-fit mx-auto gap-5">
            <div className="center__img w-8 h-8 rounded-md overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={import.meta.env.VITE_UPLOADS_DIR + data.center.img}
                    alt=""
                />
            </div>
            <div className="center__info flex flex-1 flex-col justify-around">
                <h2 className="center__name font-bold text-xl">{data.center.name}</h2>
                <a 
                    href={`mailto:${data.center.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="center__desc open flex items-center !text-blue-500 gap-3"
                >
                 <GrMail /> {data.center.email}
                </a>
            </div>
        </div>
    </div>
);
}

export default DoctorBanner;
