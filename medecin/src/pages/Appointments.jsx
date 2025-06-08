import { useAuthContext } from '../hooks/useAuthContext.js';
import { useFetchData } from "../hooks/useFetchData";
import "react-toastify/dist/ReactToastify.css";
import AppointmentTable from '../components/appointmentlist/AppointmentTable.jsx';
import GeneralisteCalendar from '../components/Calendar/GeneralisteCalendar.jsx';
import RadiologueCalendar from '../components/Calendar/RadiologueCalendar.jsx';
import { useState } from 'react';


function Appointments() {
  const { auth } = useAuthContext();

  if (!auth) {
    return (
      <div className="p-4 text-red-500">Something is wrong with authentication</div>
    );
  }

  const [succDate,setSucc] = useState(null)

  const { data: appointments } = useFetchData(
    auth.user.specialization === "prescripteur" ? "appointment/doc" : "rdv/doc",
    [succDate],
    true
  );


  return (
    <>
      {appointments &&<AppointmentTable appointments={appointments} />}
      {auth.user.specialization ==="prescripteur" &&<GeneralisteCalendar setSucc={setSucc} />}
      {auth.user.specialization !=="prescripteur"&&<RadiologueCalendar setSucc={setSucc} />}

      
    </>
  );
}

export default Appointments;