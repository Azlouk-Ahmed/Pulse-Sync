import { FC } from "react";
import clsx from "clsx";
import Lucide from "../../base-components/Lucide";

interface CenterData {
  _id: string;
  img: string;
  name: string;
  governorate: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closingTime: string;
}

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  ratings: number;
  available: boolean;
}

interface CenterProps {
  data: CenterData;
}

const Center: FC<CenterProps> = ({ data }) => {
  


  
  const isOpenNow = () => {
    
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    
    
    const [openH, openM] = data.openTime.split(":").map(Number);
    const [closeH, closeM] = data.closingTime.split(":").map(Number);
    const openTotal = openH * 60 + openM;
    const closeTotal = closeH * 60 + closeM;
    
    
    const isOvernight = closeTotal <= openTotal;
    return isOvernight
      ? nowMinutes >= openTotal || nowMinutes < closeTotal
      : nowMinutes >= openTotal && nowMinutes < closeTotal;
  };

  const isOpen = isOpenNow();



  return (
    <>
      <div className="intro-x sm:w-[30%] min-w-80 w-full">
        <div
          className={clsx([
            "relative zoom-in",
            "",
          ])}
        >
          <div className="p-5 box">
            {}
            <div className="intro-y flex items-center gap-4">
              <div className="w-16 h-16 rounded-md overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${data.img}`}
                  alt={data.name}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium">{data.name}</h2>
                <div className="flex items-center mt-1">
                  <Lucide
                    icon="Circle"
                    className={`w-3 h-3 mr-1  ${isOpen ? "text-green-700" : "text-red-700"}`}
                  />
                  <span className={`text-xs font-bold ${isOpen ? "!text-green-700" : "!text-red-700"}`}>
                    {isOpen 
                      ? `Open - Closes at ${data.closingTime}` 
                      : `Closed - Opens at ${data.openTime}`}
                  </span>
                </div>
              </div>
            </div>
            
            {}
            <div className="mt-4 text-sm text-slate-500">
              <p>{data.address}</p>
              <p className="mt-1">{data.email}</p>
            </div>
            
            {}
            <div className="flex justify-between mt-4 text-sm text-slate-500">
              <div className="flex items-center">
                <Lucide icon="MapPin" className="w-4 h-4 mr-1 text-primary" />
                <span>{data.governorate}</span>
              </div>
              <div className="flex items-center">
                <Lucide icon="Phone" className="w-4 h-4 mr-1 text-primary" />
                <span>{data.phone}</span>
              </div>
            </div>
            

          </div>
        </div>
      </div>


    </>
  );
};

export default Center;