export const convertAppointmentsToEvents = (appointments) => {
    if (!appointments) return [];
    
    return appointments.map(appointment => {
      
      let color;
      if (appointment.isOwnAppointment && appointment.status === "requested") {
        color = "#f97316"; 
      } else {
        switch(appointment.status) {
          case "confirmed":
            color = "#4f46e5"; 
            break;
          case "completed":
            color = "#10b981"; 
            break;
          case "cancelled":
            color = "#ef4444"; 
            break;
          case "ongoing":
            color = "#3b82f6"; 
            break;
          case "missed":
            color = "#6b7280"; 
            break;
          default:
            color = "#4f46e5"; 
        }
      }
      
      
      const startTime = new Date(appointment.appointmentDate);
      const endTime = new Date(startTime.getTime() + (appointment.appointmentDuration * 60000));
      
      return {
        id: appointment._id,
        title: appointment.patientName,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        color: color,
        extendedProps: {
          reason: appointment.reason,
          status: appointment.status,
          isOwnAppointment: appointment.isOwnAppointment
        }
      };
    });
  };
  

 export function formatAppointmentDate(dateString, durationMinutes) {
  
  const date = new Date(dateString);
  
  
  const duration = typeof durationMinutes === 'number' ? durationMinutes : 30;
  
  
  const startHours = date.getHours();
  const startMinutes = date.getMinutes();
  
  
  const endDate = new Date(date);
  endDate.setMinutes(date.getMinutes() + duration);
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateFormatted = date.toLocaleDateString('en-US', options);
  
  
  const startTimePeriod = startHours >= 12 ? 'pm' : 'am';
  const endTimePeriod = endHours >= 12 ? 'pm' : 'am';
  
  const start12Hour = startHours % 12 || 12; 
  const end12Hour = endHours % 12 || 12;
  
  
  const startTimeFormatted = `${start12Hour}:${startMinutes.toString().padStart(2, '0')}`;
  const endTimeFormatted = `${end12Hour}:${endMinutes.toString().padStart(2, '0')}`;
  
  
  let formattedDate = '';
  
  if (startTimePeriod === endTimePeriod) {
    
    formattedDate = `${dateFormatted} • ${startTimeFormatted} - ${endTimeFormatted} ${startTimePeriod}`;
  } else {
    
    formattedDate = `${dateFormatted} • ${startTimeFormatted} ${startTimePeriod} - ${endTimeFormatted} ${endTimePeriod}`;
  }
  
  return formattedDate;
}
  