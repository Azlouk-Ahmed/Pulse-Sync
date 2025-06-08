import "@fullcalendar/react/dist/vdom";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Slideover } from "../../base-components/Headless";
import { FormInput, FormSelect } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useFetchData } from "../../hooks/useFetchData";
import apiService from '../../api/ApiService.js';
import { toast, ToastContainer } from "react-toastify";
import { useAuthContext } from '../../hooks/useAuthContext.js';

function RadiologueCalendar({setSucc}) {
  const {auth} = useAuthContext();
  if(!auth) {
    return (
      <div>something is wrong</div>
    )
  }
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    patient: "",
    doctor: auth.user._id,
    center: auth.user.center,
    duration: 30,
    examen: "", // New field for examen
    appointmentDate: "",
    appointmentTime: "09:00",
    status: "pending"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(0); // For triggering refetch

  const {data:p} = useFetchData("patient");
  const {data:examens} = useFetchData("examen/radiology",[],true); // Fetch available examens


  const { data: apiData, loading, error } = useFetchData(`rdv/doc`, [successSubmit], true);
  console.log("Rendezvous data:", apiData);
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    if (apiData && apiData.success && apiData.data && apiData.data.length > 0) {
      const formattedAppointments = apiData.data.map(appointment => {
        // Extract patient and doctor names
        const patientName = appointment.patient ? 
          `${appointment.patient.firstName} ${appointment.patient.lastName}` : 
          'Unknown Patient';
        
        const doctorName = appointment.doctor ? 
          `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 
          'Unknown Doctor';

        const examenName = appointment.examen ? 
          appointment.examen.name : 
          'Unknown Exam';
        
        // Calculate end time based on duration
        const startTime = new Date(appointment.appointmentDate);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (appointment.duration || 30));
        
        // Create the event object for FullCalendar
        return {
          id: appointment._id,
          title: `${patientName} - ${examenName}`,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          extendedProps: {
            patient: appointment.patient ? appointment.patient._id : null,
            doctor: appointment.doctor ? appointment.doctor._id : null,
            center: appointment.center ? appointment.center._id : null,
            examen: appointment.examen ? appointment.examen._id : null,
            examenName: examenName,
            duration: appointment.duration || 30,
            status: appointment.status || "pending",
            // Additional properties if available
            notes: appointment.notes
          }
        };
      });
      
      setAppointments(formattedAppointments);
      console.log("Formatted appointments:", formattedAppointments);
    }
  }, [apiData]);

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    
    const year = clickedDate.getFullYear();
    const month = String(clickedDate.getMonth() + 1).padStart(2, '0');
    const day = String(clickedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    let hours = "09";
    let minutes = "00";
    
    if (info.view.type.includes("timeGrid")) {
      hours = String(clickedDate.getHours()).padStart(2, '0');
      minutes = String(clickedDate.getMinutes()).padStart(2, '0');
    }
    
    const formattedTime = `${hours}:${minutes}`;
    
    setSelectedDate(clickedDate);
    setFormData({
      ...formData,
      appointmentDate: formattedDate,
      appointmentTime: formattedTime
    });
    
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      patient: "",
      doctor: auth.user._id,
      center: auth.user.center,
      duration: 30,
      examen: "", // Reset examen as well
      appointmentDate: "",
      appointmentTime: "09:00",
      status: "pending"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
  
    const dateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    
    const dataToSend = {
      ...formData,
      appointmentDate: dateTime.toISOString(),
      doctor: auth.user._id,
      center: auth.user.center,
      exam: formData.examen
    };

    console.log("Submitting data:", dataToSend);
  
    try {
      apiService.post("rdv/createrdv", dataToSend, true, false);
      await apiService.post("sms/send",{body:`Votre rendez-vous avec le radiologue ${auth.user.firstName}  ${auth.user.lastName} est prévu le ${formData.appointmentDate} à ${dataToSend.appointmentTime} . Merci de vous présenter à l’heure.`,patientId:dataToSend.patient}, false,false);
      
      
      setSucc(Date.now());
      setIsOpen(false);
      resetForm();
      
      setSuccessSubmit(Date.now());
      toast.success("Appointment created successfully");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error toast with appropriate message
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEventClick = (info) => {
    const event = info.event;
    const extendedProps = event.extendedProps;
    console.log(extendedProps)
    
    // Create a detailed message
    let message = `Appointment: ${event.title}\n`;
    message += `Time: ${new Date(event.start).toLocaleString()}\n`;
    message += `Duration: ${extendedProps.duration} minutes\n`;
    message += `Status: ${extendedProps.status}\n`;
    message += `Exam: ${extendedProps.examenName}\n`;
    
    if (extendedProps.notes) {
      message += `Notes: ${extendedProps.notes}`;
    }
    
    //alert(message);
    // You could implement editing existing appointments here
  };

  const options = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "timeGridWeek",
    droppable: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "timeGridWeek,timeGridDay,listWeek",
    },
    navLinks: true,
    editable: true,
    dayMaxEvents: true,
    events: appointments,
    dateClick: handleDateClick,
    eventClick: handleEventClick,
    eventDrop: async function(info) {
      const newStartDate = info.event.start;
      console.log(info)
      
      const updatedAppointmentData = {
        appointmentDate: newStartDate.toISOString(),
      };
      
      try {
        await apiService.put(`rdv/change-date`, info.event.id, updatedAppointmentData, true, false);
        await apiService.post("sms/send",{body:`Votre rendez-vous avec le radiologue ${auth.user.firstName}  ${auth.user.lastName} est changé a ${info.event.start} . Merci de vous présenter à l’heure.`,patientId:info.event.extendedProps.patient}, false,false);
        
        setSucc(Date.now());
        toast.success("Appointment rescheduled");
      } catch (error) {
        console.log(error);
        toast.error('Failed to reschedule appointment');
      }
    },

    eventClassNames: function(arg) {
      const status = arg.event.extendedProps.status;
      switch(status) {
        case 'confirmed':
          return ['bg-success', 'border-success'];
        case 'cancelled':
          return ['bg-danger', 'border-danger'];
        case 'completed':
          return ['bg-info', 'border-info'];
        case 'ongoing':
          return ['bg-warning', 'border-warning'];
        case 'missed':
          return ['bg-slate-500', 'border-slate-500'];
        default:
          return ['bg-primary', 'border-primary']; // pending
      }
    },
    timezone: 'UTC',
  };

  return (
    <div className="full-calendar mt-9">
      {/* Toast Container */}
      <ToastContainer />
      
      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading appointments...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-danger p-4">
          <p>Error loading appointments. Please try again later.</p>
        </div>
      )}
      
      <FullCalendar {...options} />
      
      {/* Appointment Modal */}
      <Slideover open={isOpen} className="mr-auto intro-x sm:mr-6 !fixed top-[50%] left-[50%] !translate-x-[-50%] !translate-y-[-50%] z-50 " onClose={() => setIsOpen(false)}>
        <div className="bg-white p-6 rounded-lg dark:bg-darkmode-600 text-slate-800 dark:text-slate-200 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium intro-x">Schedule New Radiology Appointment</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="">
                Patient
              </label>
              {p && <FormSelect
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                className=""
                disabled={isSubmitting}
              >
                <option value="">Select Patient</option>
                {p.data.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </FormSelect>}
            </div>
            
            {/* New Exam Selection Field */}
            <div>
              <label className="">
                Exam
              </label>
              {examens && <FormSelect
                name="examen"
                value={formData.examen}
                onChange={handleInputChange}
                required
                className=""
                disabled={isSubmitting}
              >
                <option value="">Select Exam</option>
                {examens.data.map((examen) => (
                  <option key={examen._id} value={examen._id}>
                    {examen.patientId.firstName} with Dr.{examen.doctorId.firstName} 
                  </option>
                ))}
              </FormSelect>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                  className="transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                  className="transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block">
                Duration (minutes)
              </label>
              <FormInput
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="15"
                step="15"
                required
                className=""
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block">
                Status
              </label>
              <FormSelect
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="missed">Missed</option>
              </FormSelect>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outlineDanger"
                onClick={() => setIsOpen(false)}
                className="mr-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="relative"
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Save Appointment</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    </div>
                  </>
                ) : (
                  "Save Appointment"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Slideover>
    </div>
  );
}

export default RadiologueCalendar;