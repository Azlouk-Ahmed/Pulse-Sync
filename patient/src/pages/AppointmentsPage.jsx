import AppointmentCard from "../components/appoitment-card/AppointmentCard";
import { useFetchData } from "../hooks/useFetchData";

function AppointmentsPage() {
    const {loading, error, data} = useFetchData("/appointment/user",[],true)
    console.log("appointments data", data);
    
  return (
    <div className="flex flex-wrap gap-y-10 justify-between">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}    
        {data && data.data.length>0 && data.data.map((appointment) => (
            <AppointmentCard key={appointment.id} data={appointment}/>
        ))}
        {data && data.data.length === 0 && <p>No appointments found.</p>}
    </div>
  )
}

export default AppointmentsPage