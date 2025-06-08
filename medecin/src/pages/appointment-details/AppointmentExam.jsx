import { format } from "date-fns";

function AppointmentExam({ examen }) {
    console.log("oooooooooooooooo",examen)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP p"); // Format: Apr 29, 2025, 6:07 PM
  };

  return (
    <div className="bg-white dark:bg-darkmode-600 mt-5 shadow-md rounded-lg overflow-hidden w-full">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h2 className="text-lg font-bold">Medical Examination</h2>
        </div>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {formatDate(examen?.dateExamen)}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Patient Info */}
          <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg">
            <h3 className="text-primary font-medium mb-3 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">{`${examen.patientId.firstName} ${examen.patientId.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Age/Sex</p>
                <p className="font-medium">{`${examen.patientId.age} / ${examen.patientId.sex === 'male' ? 'M' : 'F'}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">{examen.patientId.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium truncate">{examen.patientId.email}</p>
              </div>
            </div>
          </div>
          
          {/* Doctor Info */}
          <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg">
            <h3 className="text-primary font-medium mb-3 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              Doctor Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${examen.doctorId.img}`}
                  alt={examen.doctorId.name}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">{`Dr. ${examen.doctorId.firstName} ${examen.doctorId.lastName}`}</p>
              </div>
                </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Specialization</p>
                <p className="font-medium capitalize">{examen.doctorId.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                <p className="font-medium">{`${examen.doctorId.experience} years`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                <p className="font-medium">{examen.doctorId.contactNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Center Info */}
        <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg mb-6">
          <h3 className="text-primary font-medium mb-3 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            Medical Center
          </h3>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.VITE_UPLOADS_DIR || ''}${examen.center.img}`}
                  alt={examen.center.name}
                />
              </div>

            <div>
              <p className="text-lg font-medium">{examen.center.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{examen.center.address}</p>
              <p className="text-gray-500 dark:text-gray-400">{examen.center.governorate}</p>
            </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
                {examen.center.phone}
              </p>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                {examen.center.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                {`${examen.center.openTime} - ${examen.center.closingTime}`}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Symptoms */}
          <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg">
            <h3 className="text-primary font-medium mb-3 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {examen.symptoms && examen.symptoms.map((symptom, index) => (
                <span 
                  key={index} 
                  className="bg-secondary/30 dark:bg-darkmode-300 px-3 py-1 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
          
          {/* Diagnosis */}
          <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg">
            <h3 className="text-primary font-medium mb-3 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
              Diagnosis
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{examen.diagnosis || "No diagnosis provided"}</p>
          </div>
        </div>

        {/* Radiology */}
        {examen.needsRadiology && (
          <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-lg mb-6">
            <h3 className="text-warning font-medium mb-2 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
                />
              </svg>
              Radiology Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {examen.radiologyTypes && examen.radiologyTypes.map((type, index) => (
                <span 
                  key={index} 
                  className="bg-warning/20 px-3 py-1 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prescriptions */}
        <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg mb-6">
          <h3 className="text-primary font-medium mb-3 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
              />
            </svg>
            Prescriptions
          </h3>
          {examen.prescriptions && examen.prescriptions.length > 0 && examen.prescriptions[0].medication ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-secondary/20 dark:bg-darkmode-300">
                    <th className="px-4 py-2 text-left text-sm font-medium">Medication</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Dosage</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {examen.prescriptions.map((prescription, index) => (
                    <tr key={index} className="border-b dark:border-darkmode-300">
                      <td className="px-4 py-3">{prescription.medication || "N/A"}</td>
                      <td className="px-4 py-3">{prescription.dosage || "N/A"}</td>
                      <td className="px-4 py-3">{prescription.duration || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No prescriptions provided</p>
          )}
        </div>

        {/* Notes */}
        <div className="bg-light/30 dark:bg-darkmode-400/30 p-4 rounded-lg">
          <h3 className="text-primary font-medium mb-3 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
            Additional Notes
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{examen.notes || "No additional notes"}</p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentExam;