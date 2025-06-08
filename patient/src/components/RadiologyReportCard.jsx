import { useState } from 'react';
import { MapPin, User } from 'lucide-react';

// This would be populated by your actual data from the schema
const sampleReport = {
  _id: "60d21b4667d0d8992e610c85",
  studyType: "MRI",
  studyDate: new Date('2025-04-15'),
  bodyPart: "Brain",
  contrastUsed: true,
  contrastDetails: "Gadolinium, 10ml",
  status: "final",
  patient: {
    firstName: "Jane",
    lastName: "Doe"
  },
  radiologist: {
    firstName: "Robert",
    lastName: "Smith",
    specialization: "radiologue"
  },
  center: {
    name: "Memorial Imaging Center",
    address: "123 Medical Blvd"
  },
  examen: {
    name: "Brain MRI with contrast"
  }
};

export default function RadiologyReportCard() {
  const [report] = useState(sampleReport);

  return (
    <div style={{width: "32%"}} className=" bg-white rounded-lg shadow-md p-6">
      {/* Confirmation Badge */}
      <div className="flex items-center mb-5">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <span className="text-green-500 font-medium">Your radiology report is ready</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {report.studyType} Report
      </h1>

      {/* With Radiologist */}
      <div className="flex items-center mb-5">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-500">
          <User className="w-6 h-6" />
        </div>
        <span className="text-gray-600">
          with Dr. {report.radiologist.firstName} {report.radiologist.lastName}
        </span>
      </div>

      {/* Medical Center */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{report.center.name}</h2>
      <div className="flex items-center text-blue-500 mb-6">
        <MapPin className="w-5 h-5 mr-1" />
        <span>{report.center.address}</span>
      </div>

    

  


      {/* Action Button */}
      <button className="w-full text-blue-500 border border-blue-500 rounded-md py-3 px-4 text-center font-medium">
        View Full Report
      </button>
    </div>
  );
}