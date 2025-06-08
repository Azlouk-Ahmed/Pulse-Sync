import clsx from "clsx";
import Lucide from "../../base-components/Lucide";
import BarChart from "../../components/BarChart";
import ReportDonutChart from "../../components/ReportDonutChart";
import { useFetchData } from "../../hooks/useFetchData";
import ReportPieChart from "../../components/ReportPieChart";
import { useAuthContext } from '../../hooks/useAuthContext.js';


function Main() {
  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  const {data, loading, error} = useFetchData("admin/stats",[],true);




  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="col-span-12 2xl:col-span-12">
        <div className="grid grid-cols-1 gap-6">
          {/* BEGIN: General Report */}
          {data &&<div className="col-span-12 mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
              Général
              </h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-success"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                     {data.totalMedecins ?? 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Médecins
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-primary"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {data.totalPatients ?? 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Patients
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
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
                      {data.totalRendezVous ?? 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Rendez-vous
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Monitor"
                        className="w-[28px] h-[28px] text-warning"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {data.totalExamens ?? 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Tests de examens
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
          {/* END: General Report */}
          
          {/* BEGIN: Sales Report - Full Width */}
          <div className="col-span-12 mt-8">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">
                Sales Report
              </h2>
            </div>
            <div className="p-5 mt-12 intro-y box sm:mt-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex">
                  <div>
                    <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                      $15,000
                    </div>
                    <div className="mt-0.5 text-slate-500">This Month</div>
                  </div>
                  <div className="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                  <div>
                    <div className="text-lg font-medium text-slate-500 xl:text-xl">
                      $10,000
                    </div>
                    <div className="mt-0.5 text-slate-500">Last Month</div>
                  </div>
                </div>
              </div>
              <div
                className={clsx([
                  "relative",
                  "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                  "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                ])}
              >
                <BarChart height={275} className="mt-6 -mb-6" />
              </div>
            </div>
          </div>
          {/* END: Sales Report */}
          
          {/* BEGIN: Charts Section - 50% Width Each (Patient Ages & Exam Status) */}
          <div className="col-span-12 mt-8 sm:col-span-6">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
              ages des patients
              </h2>
            </div>
            <div className="p-5 mt-5 intro-y box">
              <div className="mt-3">
                <ReportPieChart height={213} />
              </div>
            </div>
          </div>
   
          <div className="col-span-12 mt-8 sm:col-span-6">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
              status des rendez vous
              </h2>
            </div>
            <div className="p-5 mt-5 intro-y box">
              <div className="mt-3">
                <ReportDonutChart height={213} />
              </div>
            </div>
          </div>
          {/* END: Charts Section */}
        </div>
      </div>
    </div>
  );
}

export default Main;