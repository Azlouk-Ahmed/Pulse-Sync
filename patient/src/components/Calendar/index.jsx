import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./calendar-styles.css"; // We'll create this file for custom styling

function Calendar() {
  const options = {
    plugins: [interactionPlugin, dayGridPlugin],
    initialView: "dayGridMonth", // Only month view
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "" // Removed other view options
    },
    initialDate: new Date(), // Current date
    navLinks: false, // Disable navigation links since we only have month view
    editable: false, // Not editable for patients
    dayMaxEvents: true,
    eventColor: "#4f46e5", // Default event color
    eventTextColor: "#ffffff",
    height: "auto",
    events: [
      // Holidays and closed days
      {
        title: "New Year Holiday - CLOSED",
        start: "2025-01-01",
        end: "2025-01-02",
        color: "#ef4444", // Red
      },
      {
        title: "Staff Training - CLOSED",
        start: "2025-01-15",
        end: "2025-01-17",
        color: "#ef4444", // Red
      },
      {
        title: "Easter Holiday - CLOSED",
        start: "2025-04-18",
        end: "2025-04-22",
        color: "#ef4444", // Red
      },
      // Special events
      {
        title: "AIDS Awareness Week",
        start: "2025-05-10",
        end: "2025-05-17",
        color: "#3b82f6", // Blue
      },
      {
        title: "Flu Vaccination Drive",
        start: "2025-10-01",
        end: "2025-10-31",
        color: "#10b981", // Green
      },
      {
        title: "Diabetes Awareness Month",
        start: "2025-11-01",
        end: "2025-11-30",
        color: "#8b5cf6", // Purple
      },
      {
        title: "Holiday Season - Modified Hours",
        start: "2025-12-24",
        end: "2025-12-31",
        color: "#f59e0b", // Orange
      },
    ],
    // Additional styling callbacks
    eventDidMount: function(info) {
      // Add hover effect
      info.el.addEventListener('mouseenter', function() {
        info.el.style.transform = 'scale(1.02)';
        info.el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        info.el.style.zIndex = '10';
      });
      info.el.addEventListener('mouseleave', function() {
        info.el.style.transform = 'scale(1)';
        info.el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        info.el.style.zIndex = '1';
      });
    },
    dayCellDidMount: function(info) {
      // Mark Saturdays as closed
      const dayOfWeek = info.date.getDay();
      if (dayOfWeek === 6) { // 6 is Saturday
        info.el.style.backgroundColor = '#fee2e2'; // Light red background
        info.el.style.color = '#991b1b'; // Darker red text
        
        // Add closed label
        const closedLabel = document.createElement('div');
        closedLabel.innerHTML = "CLOSED";
        closedLabel.style.fontWeight = "bold";
        closedLabel.style.fontSize = "0.8rem";
        closedLabel.style.color = "#991b1b";
        closedLabel.style.textAlign = "center";
        info.el.appendChild(closedLabel);
      }
      
      // Adding a subtle hover effect to day cells
      info.el.addEventListener('mouseenter', function() {
        if (dayOfWeek !== 6) { // Don't change hover effect for Saturdays
          info.el.style.backgroundColor = '#f9fafb';
        }
      });
      info.el.addEventListener('mouseleave', function() {
        if (dayOfWeek !== 6) { // Reset background for non-Saturdays
          info.el.style.backgroundColor = '';
        } else { // Reset to closed color for Saturdays
          info.el.style.backgroundColor = '#fee2e2';
        }
      });
    },
    // Handle date click to show info
    dateClick: function(info) {
      const clickedDate = new Date(info.dateStr);
      const dayOfWeek = clickedDate.getDay();
      
      // Check if it's a Saturday
      if (dayOfWeek === 6) {
        alert("The medical center is CLOSED on Saturdays.");
        return;
      }
      
      // Show center hours for the clicked date
      alert(`Medical Center Hours:\nMonday-Friday: 9:00 AM - 5:00 PM\nSaturday: CLOSED\nSunday: 10:00 AM - 2:00 PM`);
    }
  };

  return (
    <div className="calendar-container bg-white p-5 rounded-md shadow-md">
      <div className="calendar-header">
        <h2>Medical Center Calendar</h2>
        <p className="calendar-subtitle">Opening Hours: Monday-Friday 9:00 AM - 5:00 PM, Sunday 10:00 AM - 2:00 PM, Closed on Saturdays</p>
      </div>
      
      <div className="legend" style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', marginRight: '5px' }}></div>
          <span>Holiday/Closed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '5px' }}></div>
          <span>AIDS Awareness</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '5px' }}></div>
          <span>Flu Vaccination</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#fee2e2', borderRadius: '50%', marginRight: '5px' }}></div>
          <span>Saturday (Closed)</span>
        </div>
      </div>
      
      <div className="full-calendar">
        <FullCalendar {...options} />
      </div>
      
      <div className="calendar-footer" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> Click on any date to see center hours. The medical center is closed on all Saturdays and designated holidays.</p>
      </div>
    </div>
  );
}

export default Calendar;