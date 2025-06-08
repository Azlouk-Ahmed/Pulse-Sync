import { useParams } from "react-router-dom";
import Calendar from "../components/Calendar";
import Doctor from "../components/Doctor";
import CenterBanner from "../components/doctor-banner/CetnerBanner";
import { useFetchData } from "../hooks/useFetchData";

function CenterDocs() {
  const { id } = useParams();  
  const {data, loading, error} = useFetchData(`/doctor/centers/${id}`); 
  const {data:center, loading:ld, error:e} = useFetchData(`/center/${id}`); 

  return (
    <div>
        {center &&<CenterBanner center={center.data} />}
        {ld && <p>Loading...</p>}
        {e && <p>Error: {e}</p>}
      <Calendar />
      <h1>related docs for this center</h1>
      <div className="flex flex-wrap mt-4 showCenter={false} gap-y-10 justify-between px-5">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {data && data.data.length > 0 && data.data.map((doctor) => (
              <Doctor key={doctor._id} data={doctor} showCenter={false} />
            ))}
            {data && data.data.length === 0 && <p>No doctors found.</p>}
        </div>
    </div>
  );
}

export default CenterDocs;
