import clsx from "clsx";
import Lucide from "../../base-components/Lucide";
import RendezVous from "./RendezVous";
import Calendar from "../Calendar/index";
import { useFetchData } from "../../hooks/useFetchData";
import { useAuthContext } from '../../hooks/useAuthContext.js';


function Radiologues() {
  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  const {data, loading, error} = useFetchData(auth.user.role === "admin"?"rdv/admin" : "rdv/superAdmin", [],true)
  return (
    <div>
      sdfsdfsdf
      {data &&<div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="User"
                  className="w-[28px] h-[28px] text-success"
                />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">{data.count}</div>
              <div className="mt-1 text-base text-slate-500">Total</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="User"
                  className="w-[28px] h-[28px] text-primary"
                />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">{data.data.filter((el)=>el.status === "pending").length}</div>
              <div className="mt-1 text-base text-slate-500">pending</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="CreditCard"
                  className="w-[28px] h-[28px] text-pending"
                />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">{data.data.filter((el)=>el.status === "ongoing").length}</div>
              <div className="mt-1 text-base text-slate-500">ongoing</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div className={clsx(["relative zoom-in", ""])}>
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="Monitor"
                  className="w-[28px] h-[28px] text-warning"
                />
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">{data.data.filter((el)=>el.status === "canceled").length}</div>
              <div className="mt-1 text-base text-slate-500">canceled</div>
            </div>
          </div>
        </div>
      </div>}
      {data && data.data &&<RendezVous rdv={data.data} />}
      <Calendar />
    </div>
  );
}

export default Radiologues;
