import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useFetchData } from "../../hooks/useFetchData";
import Center from "../../components/Center/Center.tsx";
import Button from "../../base-components/Button";
import { Calendar, FileText, Plus, Stethoscope } from "lucide-react";
import { Menu, Dialog } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide/index.tsx";
import apiService from "../../api/ApiService.js";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { User } from "lucide-react";
import AppointmentExam from "./AppointmentExam.jsx";
import RadiologyReportForm from "./RadiologyReportForm.jsx";
import RadiologyReport from "./RadiologyReport.jsx";
import {
  FormCheck,
  FormInput,
  FormTextarea,
  FormHelp,
  FormInline,
  FormLabel,
  FormSelect,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";


function Appointments() {
  const { id } = useParams();
  const { auth } = useAuthContext();
  const [successDate, setSuccessDate] = useState(null);
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [examFormData, setExamFormData] = useState({
    symptoms: "",
    diagnosis: "",
    needsRadiology: false,
    radiologyTypes: [],
    prescriptions: [{ medication: "", dosage: "", duration: "" }],
    notes: "",
  });

  if (!auth) {
    return (
      <div className="p-4 text-red-500">
        Something is wrong with authentication
      </div>
    );
  }

  const { data: appointmentData } = useFetchData(
    auth.user.specialization === "prescripteur"
      ? `appointment/details/${id}`
      : `rdv/details/${id}`,
    [successDate],
    false
  );

  const { data: examen } = useFetchData(
    auth.user.specialization === "prescripteur"
      ? `examen/appointment/${id}`
      : `examen/radiologue/details/${id}`,
    [successDate],
    false
  );



  // If no appointment data, show loading or error state
  if (!appointmentData || !appointmentData.data) {
    return <div className="p-4">Error Loading appointment details...</div>;
  }

  const { data: appointment } = appointmentData;
  const { patient, doctor, center } = appointment;

  // Format date and time
  const appointmentDate = new Date(appointment.appointmentDate);
  const formattedDate = appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const changeStatus = async (el) => {
    try {
      await apiService.put(auth.user.specialization === "prescripteur"
      ? "appointment/status" : "rdv/status", id, { status: el }, true);
      setSuccessDate(Date.now());
      toast.success("Le statut est changé avec succès");
      await apiService.post("sms/send",{body:`votre status rendez-vous est changé a ${el}`,patientId:patient._id}, false,false);
      
    } catch (error) {
      console.log(error);
      toast.error(error.error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExamFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRadiologyTypeChange = (type) => {
    setExamFormData((prev) => {
      const radiologyTypes = prev.radiologyTypes.includes(type)
        ? prev.radiologyTypes.filter((t) => t !== type)
        : [...prev.radiologyTypes, type];
      return { ...prev, radiologyTypes };
    });
  };

  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
    const newPrescriptions = [...examFormData.prescriptions];
    newPrescriptions[index] = {
      ...newPrescriptions[index],
      [name]: value,
    };
    setExamFormData((prev) => ({
      ...prev,
      prescriptions: newPrescriptions,
    }));
  };

  const addPrescription = () => {
    setExamFormData((prev) => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions,
        { medication: "", dosage: "", duration: "" },
      ],
    }));
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();

    // Prepare exam data
    try {
      const examData = {
        patientId: patient._id,
        appointment: id,
        center: center._id,
        ...examFormData,
        symptoms: examFormData.symptoms.split(",").map((s) => s.trim()),
      };

      await apiService.post("examen", examData, true, false);
      await apiService.post("sms/send",{body:`votre examen est prét , vous pouvez le consulter en connectant a votre espace patient`,patientId:patient._id}, false,false);
      setSuccessDate(Date.now())

      toast.success("Examen cree avec success");
      setIsExamDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="header">Appointments details</h1>

      <div className="p-6 flex flex-col md:flex-row-reverse gap-5 w-full">
        {/* Center Information */}
        {center && <Center data={center} />}
        <ToastContainer />

        {/* Exam Creation Dialog */}
        <Dialog
          open={isExamDialogOpen}
          onClose={() => setIsExamDialogOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl box p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Create Exam
              </Dialog.Title>

              <form onSubmit={handleExamSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Symptoms (comma-separated)
                  </label>
                  <FormInput
                    type="text"
                    name="symptoms"
                    value={examFormData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Enter symptoms separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Diagnosis
                  </label>
                  <FormTextarea
                    name="diagnosis"
                    value={examFormData.diagnosis}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter diagnosis"
                    rows={3}
                  />
                </div>

                <div className="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                  <FormCheck.Input
                    type="checkbox"
                    name="needsRadiology"
                    checked={examFormData.needsRadiology}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Needs Radiology
                  </FormLabel>
                </div>

                {examFormData.needsRadiology && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radiology Types
                    </label>
                    <div className="flex space-x-4">
                      {["X-ray", "CT scan", "MRI", "Ultrasound"].map((type) => (
                        <label key={type} className="inline-flex items-center">
                          <FormCheck.Input
                            type="checkbox"
                            checked={examFormData.radiologyTypes.includes(type)}
                            onChange={() => handleRadiologyTypeChange(type)}
                            className="mr-2"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Prescriptions
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addPrescription}
                      className="flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> Add Prescription
                    </Button>
                  </div>
                  {examFormData.prescriptions.map((prescription, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        name="medication"
                        value={prescription.medication}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        placeholder="Medication"
                        className="rounded-md border-gray-300 shadow-sm"
                      />
                      <input
                        type="text"
                        name="dosage"
                        value={prescription.dosage}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        placeholder="Dosage"
                        className="rounded-md border-gray-300 shadow-sm"
                      />
                      <input
                        type="text"
                        name="duration"
                        value={prescription.duration}
                        onChange={(e) => handlePrescriptionChange(index, e)}
                        placeholder="Duration"
                        className="rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={examFormData.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsExamDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Exam
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Appointment Details Card */}
        <div className="intro-y box shadow-lg rounded-lg p-6 flex-1">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold">Appointment Details</h1>
            {appointment.status === "completed" && (
              <Button
                variant="primary"
                onClick={() => {auth.user.specialization ==="prescripteur"?setIsExamDialogOpen(true):setIsFormOpen(true)}}
              >
                {auth.user.specialization ==="prescripteur"?"Create Exam":"add radiology report"}
                
              </Button>
            )}
          </div>

          <div className="mb-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <User className="mr-3 text-blue-500" size={24} />
              Patient Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Contact</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <Calendar className="mr-3 text-green-500" size={24} />
              Appointment Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-medium">{formattedTime}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">
                  {appointment.appointmentDuration} minutes
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>

                <Menu>
                  <Button variant="secondary" className="w-full">
                    <Menu.Button
                      as="div"
                      className="w-full flex justify-between items-center text-left"
                    >
                      {appointment.status}{" "}
                      <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                    </Menu.Button>
                  </Button>
                  <Menu.Items placement="top-start">
                    {[
                      "pending",
                      "confirmed",
                      "cancelled",
                      "completed",
                      "ongoing",
                      "missed",
                      "requested",
                    ].map((el, index) => (
                      <Menu.Item
                        key={index}
                        //onClick={() => handleCenterSelect(center._id, center.name)}
                      >
                        <div className="flex gap-5 items-center">
                          <div
                            className="text-base text-slate-500"
                            onClick={() => changeStatus(el)}
                          >
                            {el}
                          </div>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>

          {/* ... Rest of the existing component remains the same ... */}

          {/* Status Menu */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <Stethoscope className="mr-3 text-purple-500" size={24} />
              Doctor Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">
                  {doctor.firstName} {doctor.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Specialization</p>
                <p className="font-medium">{doctor.specialization}</p>
              </div>
              <div>
                <p className="text-gray-600">Experience</p>
                <p className="font-medium">{doctor.experience} years</p>
              </div>
              <div>
                <p className="text-gray-600">Contact</p>
                <p className="font-medium">{doctor.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
         {auth.user.specialization === "prescripteur"&& <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FileText className="mr-3 text-red-500" size={24} />
              Additional Details
            </h2>
            <div>
              <p className="text-gray-600">Reason for Visit</p>
              <p className="font-medium">
                {appointment.reason || "No specific reason provided"}
              </p>
            </div>
          </div>}
        </div>
      </div>
      <div className="div">
        <h1 className="header">Appointment Exam</h1>

        {examen && examen.data && examen.data != "still waiting for an exam" && <AppointmentExam examen={examen.data}/>}
        {examen && !examen.success && 
        <div className="p-5 w-full my-5 rounded-lg font-bold bg-yellow-200 text-yellow-700">{examen.data}</div>
        }
      </div>
      {examen &&examen.data&& examen.data.needsRadiology&&<div className="div">
        <h1 className="header">Radiology Report</h1>
        
          <RadiologyReport exam={examen.data._id} />
      </div>}
      {auth.user.specialization!=="prescripteur"&&examen &&examen.data&&<RadiologyReportForm isFormOpen={isFormOpen} doctor={auth.user._id} patient={examen.data.patientId._id} examen={examen.data._id} appointment={id}  setIsFormOpen={setIsFormOpen} />}
    </div>
  );
}

export default Appointments;
