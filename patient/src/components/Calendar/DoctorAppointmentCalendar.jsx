import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { motion, AnimatePresence } from "framer-motion";
import "./calendar-styles.css";
import { useFetchData } from "../../hooks/useFetchData";
import { convertAppointmentsToEvents } from "../../utils/functions";
import {
  alertVariants,
  modalVariants,
  overlayVariants,
} from "../../utils/variantsData";
import apiService from "../../api/ApiService";

function DoctorAppointmentCalendar({ doctor, center }) {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    reason: "",
  });
  const { data, loading, error } = useFetchData(
    `/appointment/calendar?doctor=${doctor._id}&center=${center._id}`,
    [showModal],
    true
  );

  const currentDate = new Date();

  const businessHours = {
    daysOfWeek: [0, 1, 2, 3, 4, 5],
    startTime: center.openTime,
    endTime: center.closingTime,
  };

  const showAlertModal = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleDateClick = (info) => {
    if (info.view.type === "dayGridMonth") {
      return;
    }

    const clickedDate = new Date(info.date);
    const day = clickedDate.getDay();
    const hour = clickedDate.getHours();

    const now = new Date();
    if (clickedDate < now) {
      showAlertModal("Cannot schedule appointments in the past", "error");

      info.view.calendar.unselect();
      return;
    }

    if (day === 6 || hour < 8 || hour >= 17) {
      showAlertModal(
        "Appointments can only be scheduled during business hours (Sunday-Friday, 8AM-5PM)",
        "warning"
      );

      info.view.calendar.unselect();
      return;
    }

    const minutes = clickedDate.getMinutes();
    clickedDate.setMinutes(minutes < 30 ? 0 : 30);

    const endTime = new Date(clickedDate);
    endTime.setMinutes(endTime.getMinutes() + 30);

    setSelectedInfo({
      start: clickedDate,
      end: endTime,
      isNew: true,
    });

    setAppointmentForm({
      reason: "",
    });

    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const event = info.event;

    setSelectedInfo({
      id: event.id,
      start: event.start,
      end: event.end,
      isNew: false,
      patientName: event.title,
      reason: event.extendedProps.reason,
      status: event.extendedProps.status,
      isOwnAppointment: event.extendedProps.isOwnAppointment,
    });

    setAppointmentForm({
      reason: event.extendedProps.reason,
    });

    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm({
      ...appointmentForm,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const appointmentData = {
      doctor: doctor._id,
      center: center._id,
      reason: appointmentForm.reason,
      appointmentDate: selectedInfo.start.toISOString(),
    };

    await apiService.post("appointment", appointmentData);

    showAlertModal("Your appointment request has been submitted!", "success");
    setShowModal(false);
  };

  const handleCancelAppointment = () => {
    console.log("Cancelling appointment with ID:", selectedInfo.id);

    showAlertModal("Your appointment has been cancelled.", "success");
    setShowModal(false);
  };

  const options = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "timeGridWeek",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialDate: currentDate,
    slotMinTime: "08:00:00",
    slotMaxTime: "17:00:00",
    slotDuration: "00:15:00",
    slotLabelInterval: "00:30",
    allDaySlot: false,
    weekends: true,
    businessHours: businessHours,
    height: "auto",
    navLinks: true,
    editable: false,
    selectable: true,
    selectMirror: false,
    selectAllow: function (selectInfo) {
      const start = new Date(selectInfo.start);
      const day = start.getDay();
      const hour = start.getHours();

      const now = new Date();
      if (start < now) {
        return false;
      }

      if (day === 6 || hour < 8 || hour >= 17) {
        return false;
      }

      return true;
    },
    dayMaxEvents: true,
    nowIndicator: true,
    events: loading
      ? []
      : convertAppointmentsToEvents(data?.appointments || []),
    dateClick: handleDateClick,
    eventClick: handleEventClick,

    eventClassNames: function (info) {
      return [
        "appointment-event",
        `status-${info.event.extendedProps.status}`,
        info.event.extendedProps.isOwnAppointment ? "own-appointment" : "",
      ];
    },
    eventContent: function (info) {
      return {
        html: `
          <div class="event-content">
            <div class="event-title">${info.event.title}</div>
            <div class="event-time">${info.timeText}</div>
            <div class="event-status">${info.event.extendedProps.status}</div>
            ${
              info.event.extendedProps.isOwnAppointment
                ? '<div class="own-appointment-indicator">Your appointment</div>'
                : ""
            }
          </div>
        `,
      };
    },
  };

  if (loading) {
    return <div className="loading-container">Loading appointments...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        Error loading appointments: {error.message}
      </div>
    );
  }

  return (
    <div className="doctor-calendar-container">
      <div className="calendar-header">
        <h2>Dr. {doctor.firstName} {doctor.lastName}'s Appointment Calendar</h2>
        <p className="calendar-subtitle">
          Working Hours: Sun-Fri, {center.openTime} - {center.closingTime}
        </p>
        <p className="patient-instructions">
          Click on an available time slot to request an appointment
        </p>
      </div>

      <div className="doctor-calendar">
        <FullCalendar {...options} />
      </div>

      {}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            className={`alert-modal alert-${alertType}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={alertVariants}
          >
            <div className="alert-content">
              <p>{alertMessage}</p>
              <button
                className="close-button"
                onClick={() => setShowAlert(false)}
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="modal-header">
                <h3>
                  {selectedInfo.isNew
                    ? "Request Appointment"
                    : selectedInfo.isOwnAppointment
                    ? "Your Appointment"
                    : "Appointment Details"}
                </h3>
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="appointment-time">
                <strong>Time:</strong>{" "}
                {selectedInfo.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -
                {selectedInfo.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                , {selectedInfo.start.toLocaleDateString()}
              </div>

              {selectedInfo.isNew ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Reason for Visit:</label>
                    <select
                      name="reason"
                      value={appointmentForm.reason}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select reason</option>
                      <option value="Annual checkup">Annual checkup</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Flu symptoms">Flu symptoms</option>
                      <option value="Blood pressure check">
                        Blood pressure check
                      </option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Prescription renewal">
                        Prescription renewal
                      </option>
                      <option value="Consultation">Consultation</option>
                      <option value="Lab results review">
                        Lab results review
                      </option>
                      <option value="leg break">Leg break</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <motion.button
                      type="submit"
                      className="save-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Request Appointment
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div className="appointment-details">
                  <div className="detail-item">
                    <strong>Patient:</strong> {selectedInfo.patientName}
                  </div>
                  <div className="detail-item">
                    <strong>Reason:</strong> {selectedInfo.reason}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge ${selectedInfo.status}`}>
                      {selectedInfo.status}
                    </span>
                  </div>

                  {}
                  {selectedInfo.isOwnAppointment &&
                    (selectedInfo.status === "requested" ||
                      selectedInfo.status === "pending" ||
                      selectedInfo.status === "confirmed") && (
                      <div className="form-actions">
                        <motion.button
                          onClick={handleCancelAppointment}
                          className="cancel-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel Appointment
                        </motion.button>
                      </div>
                    )}

                  {!selectedInfo.isOwnAppointment && (
                    <div className="modal-note">
                      <p>Note: This is another patient's appointment.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {false && (
          <motion.div
            className="modal-overlay"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <motion.div
              className="modal-content confirmation-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="modal-header">
                <h3>Confirmation</h3>
                <button className="close-button" onClick={() => {}}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to proceed with this action?</p>
              </div>

              <div className="modal-footer">
                <motion.button
                  className="secondary-button"
                  onClick={() => {}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="primary-button"
                  onClick={() => {}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DoctorAppointmentCalendar;
