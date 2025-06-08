// Fixed index.tsx file
import clsx from "clsx";
import { useFetchData } from "../../hooks/useFetchData";
import Lucide from "../../base-components/Lucide/index";
import DocList from "../../components/DocList";
import { useAuthContext } from '../../hooks/useAuthContext.js';


// Define a type for your doctor data
interface Doctor {
  specialization: string;
  // Add other properties as needed
}

interface DoctorResponse {
  count: number;
  data: Doctor[];
}

function Index() {  
  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  const { data, loading, error } = useFetchData<DoctorResponse>(auth.user.role === "superAdmin"? "doctor" : "doctor/staff",[],auth.user.role === "admin");
  
  // Add proper loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Only render when data is available
  if (!data) return null;
  
  // Calculate counts
  const radiologueCount = data.data.filter((el) => el.specialization === "radiologue").length;
  const nonRadiologueCount = data.data.filter((el) => el.specialization !== "radiologue").length;
  
  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide icon="User" className="w-[28px] h-[28px] text-success" />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">
                {data.count}
              </div>
              <div className="mt-1 text-base text-slate-500">Médecins</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide icon="User" className="w-[28px] h-[28px] text-primary" />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">
                {radiologueCount}
              </div>
              <div className="mt-1 text-base text-slate-500">Radiologues</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="CreditCard"
                  className="w-[28px] h-[28px] text-pending"
                />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">
                {nonRadiologueCount}
              </div>
              <div className="mt-1 text-base text-slate-500">Autres médecins</div>
            </div>
          </div>
        </div>
      </div>

      <DocList />            
     

    </>
  );
}

export default Index;