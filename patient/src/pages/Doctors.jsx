import Doctor from "../components/Doctor";
import { useFetchData } from "../hooks/useFetchData";

function Doctors() {
  const {loading, error, data} = useFetchData("/doctor")
  console.log("doctors data", data);
  
  return (
    <div className="flex flex-col gap-10">
      {/* Search + Select */}
      <div className="flex items-Doctor gap-5 justify-between">
        {/* Search Input */}
        <div className="field flex input-field items-Doctor w-1/3 bg-white h-10">
          <i className="fa-solid fa-magnifying-glass w-10 text-Doctor"></i>
          <input
            type="text"
            className="!border-0 w-full"
            placeholder="Search for Doctor name"
          />
        </div>

        {/* Select Dropdown */}

        <div className="btn">
            search
        </div>
      </div>

      {/* Doctors List */}
      <div className="flex flex-wrap gap-y-10 justify-between px-5">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data && data.data.length>0 && data.data.map((doctor) => (
          <Doctor key={doctor.id} data={doctor} showCenter={true}/>
        ))}
        {data && data.data.length === 0 && <p>No doctors found.</p>}
        </div>
    </div>
  )
}

export default Doctors