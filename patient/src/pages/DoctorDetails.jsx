import { useParams } from "react-router-dom";
import DoctorAppointmentCalendar from "../components/Calendar/DoctorAppointmentCalendar";
import DoctorBanner from "../components/doctor-banner/Doctor-Banner";
import { useFetchData } from "../hooks/useFetchData";

function DoctorDetails() {
    const { id } = useParams();
    const {data, loading, error} = useFetchData(`/doctor/${id}`);
  return (
    <div>
        {data &&<DoctorBanner data={data.data} />}
        {data &&<DoctorAppointmentCalendar doctor={data.data} center={data.data.center} />}
    </div>
  )
}

export default DoctorDetails