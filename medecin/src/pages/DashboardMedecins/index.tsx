import { useState } from "react";
import { CheckCircle2, XCircle, Pencil } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useFetchData } from "../../hooks/useFetchData";
import { StatCard } from "../../base-components/Statcard";
import IncomeChart from "./IncomeChart.jsx";
import DemandesChart from "./DemandesChart.jsx";
import { format, formatDistanceToNow, isFuture, isToday, parseISO } from 'date-fns';


import {
  Clock,
  Calendar,
  MapPin,
  Stethoscope,
  MessageCircle,
  Check,
  X,
  CheckCircle,
  Loader,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";










function DashboardMedecins() {
  const { auth } = useAuthContext();
  if (!auth) {
    return <div>someting is worng</div>;
  }
 
  const { data, loading, error } = useFetchData("doctor/docs", [], true);
  const { data:stats} = useFetchData(auth.user.specialization ==="prescripteur"?"appointment/stats": "rdv/stats", [], true);
  const { data:requested} = useFetchData(auth.user.specialization ==="prescripteur"?"appointment/stats/requested":"rdv/stats/pending", [], true);
  const { data: a } = useFetchData(
    auth.user.specialization === "prescripteur" ? "appointment/doc" : "rdv/doc",
    [],
    true
  );
  console.log("/////",a)


 const statusConfig = {
  pending: {
    label: "En attente",
    indicator: "bg-yellow-800",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmés",
    indicator: "bg-green-800",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle2,
  },
  cancelled: {
    indicator: "bg-red-800",
    label: "Annulés",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: XCircle,
  },
  completed: {
    indicator: "bg-blue-800",
    label: "Terminés",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: CheckCircle2,
  },
  ongoing: {
    indicator: "bg-purple-800",
    label: "En cours",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: Clock,
  },
  missed: {
    indicator: "bg-gray-800",
    label: "Manqués",
    color: "bg-gray-100 -800 dark:bg-gray-800 dark:-200",
    icon: XCircle,
  },
  requested: {
    indicator: "bg-indigo-800",
    label: "Demandés",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    icon: MessageCircle,
  },
};




  return (
    <div className="p-6 font-sans min-h-screen">
      {/* En-tête avec photo et informations du médecin */}
      <div className="relative intro-x mb-12">
        <div className="bg-primary h-60 rounded-xl"></div>
        <div className="absolute top-8 left-8 flex items-center">
          <div className="w-40 h-40 shadow-xl overflow-hidden mr-8">
            <img
              src={`${import.meta.env.VITE_UPLOADS_DIR || ""}${auth.user.img}`}
              alt={auth.user.name}
              className="w-full h-full object-cover"
           
            />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-light mb-1">Bonjour,</h1>
            <h2 className="text-4xl font-semibold mb-2">
              {auth?.user?.firstName + " " + auth?.user?.lastName}
            </h2>
            <h3 className="text-2xl font-light mb-1">
              Votre emploi du temps aujourd'hui.
            </h3>
          </div>
        </div>
      </div>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome back👋</h1>
        </section>

        {a&&a.data&&<section className="admin-stat my-5">
          <StatCard
            type="appointments"
            count={a.data.length}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={a.data.filter((a)=>a.status==="pending").length}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={a.data.filter((a)=>a.status==="cancelled").length}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>}
      </main>
      <div className="flex md:flex-col items-stretch gap-6">
        {/* Income Chart */}
        {stats&&stats.data&&<IncomeChart data={stats.data} />}
        {requested && requested.data &&<DemandesChart data={requested.data} />}

        {/* Demandes d'examens */}
        
      </div>

      {/* Deuxième ligne - Available Doctors et Upcoming Surgeries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Available Doctors */}
        {data && data.data && (
          <div className="p-5 mt-12 intro-y box sm:mt-5">
            <h3 className="text-xl font-semibold -800 mb-6 pb-2 border-b border-gray-100">
              Médecins dans votre centre
            </h3>
            <div className="space-y-5">
              {data.data.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {/* Conteneur photo avec fallback */}
                  <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden relative">
                    {doctor.img ? (
                      <img
                        src={`${import.meta.env.VITE_UPLOADS_DIR || ""}${
                          doctor.img
                        }`}
                        alt={`${doctor.name} - ${doctor.specialty}`}
                        className="w-full h-full object-cover"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          doctor.photo ? "hidden" : ""
                        } bg-gradient-to-br from-blue-100 to-purple-100`}
                      >
                        <span className="text-blue-600 font-bold text-lg">
                          {doctor.firstName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-5 flex-grow">
                    <h4 className="font-semibold -800">
                      {doctor.lastName}
                    </h4>
                    <p className="-500 text-sm">
                      {doctor.specialization}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <span className="-400 text-sm">
                      {doctor.center.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Surgeries */}
        <div className="p-5 mt-12 intro-y box sm:mt-5 box rounded-xl shadow-sm">
          <div className="flex flex-col gap-5 items-center mb-6 pb-2 border">
     <h3 className="text-xl font-semibold">Les rendez-vous les plus proches</h3>

     
      <div className="flex items-center text-sm flex-wrap gap-x-6">
  {Object.entries(statusConfig).map(([key, { label, color,indicator }]) => {
    const bgColor = color.split(" ")[0]; // Extract only the bg-* class
    return (
      <span key={key} className="flex items-center mr-4 mb-2">
        <div className={`w-3 h-3 rounded-full ${indicator} mr-1`}></div>
        <span className="-600 dark:-400">{label}</span>
      </span>
    );
  })}
</div>

    </div>

    {a && a.data && a.data.length > 0 ? (
  <div className="space-y-4">
    {a.data
      .filter((appointment) => {
        const appointmentDate = parseISO(appointment.appointmentDate);
        const now = new Date();
        
        // Check if the appointment is today and in the future
        return (
          isToday(appointmentDate) && 
          appointmentDate > now
        );
      })
       .sort((a, b) => {
        // Sort by appointment date (earliest first)
        return parseISO(a.appointmentDate) - parseISO(b.appointmentDate);
      })
      .map((appointment) => {
        const status = appointment.status || 'requested';
        const StatusIcon = statusConfig[status]?.icon || Clock;
        const appointmentDate = parseISO(appointment.appointmentDate);

        const timeIndicator = isToday(appointmentDate)
          ? `Starts ${formatDistanceToNow(appointmentDate, { addSuffix: true })}`
          : `Starts on ${format(appointmentDate, 'MMM d')}`;

        return (
          <div
            key={appointment._id}
            className="flex items-center border shadow-md py-5 px-4 rounded-xl transition-all intro-x"
          >
            <div className="flex-grow">
              
              
              <div className="flex items-center gap-5 mb-3">
                <h4 className="font-medium -800 dark:text-white">
                  {appointment.patient?.firstName || ''}{' '}
                  {appointment.patient?.lastName || ''}
                </h4>
                <span
                  className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]?.color}`}
                >
                  <StatusIcon className="w-3 h-3 mr-1 inline" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {timeIndicator}
                </span>
              </div>

              <div className="flex flex-wrap items-center text-sm -500 dark:-400">
                <span className="flex items-center mr-4 mb-1">
                  <Stethoscope className="w-4 h-4 mr-1 -400 dark:-500" />
                  {appointment.reason || 'Consultation'}
                </span>
                <span className="flex items-center mr-4 mb-1">
                  <Clock className="w-4 h-4 mr-1 -400 dark:-500" />
                  {appointment.appointmentDuration || 30} min
                </span>

                {appointment.center && (
                  <span className="flex items-center mb-1">
                    <MapPin className="w-4 h-4 mr-1 -400 dark:-500" />
                    {appointment.center.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-2 ml-2">
              <button
                className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-400 transition-colors"
                title="Modifier"
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>
        );
      })}
  </div>
) : (
  <div className="flex flex-col items-center justify-center py-8 text-center -500 dark:-400">
    <Calendar className="w-16 h-16 mb-4 -400 dark:-600" />
    <p className="text-lg font-medium">Aucun rendez-vous aujourd'hui</p>
    <p className="text-sm mt-1">
      Vous n'avez pas de rendez-vous programmés pour aujourd'hui.
    </p>
  </div>
)}


            <div className="mt-4 text-right">
              <Link to={"/appointments"} className="btn btn-sm btn-primary bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Voir tous les rendez-vous
              </Link>
            </div>
          
        </div>
      </div>

      
    </div>
  );
}
export default DashboardMedecins;
