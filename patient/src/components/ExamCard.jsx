import {
  User,
  UserRound,
  Clock,
  MapPin,
  Stethoscope,
  Pill,
  NotebookPen,
  XCircle,
  CheckCircle,
} from "lucide-react";

export default function ExaminationCard({data}) {
  // Static data based on the schema
  const examinationData = {
    patientName: "Sarah Johnson",
    patientId: "P-2023094",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Cardiologist",
    dateExamen: "April 28, 2025 • 10:30 am",
    centerName: "Northside Medical Center",
    centerAddress: "123 Health Avenue, Suite 302",
    symptoms: ["Chest pain", "Shortness of breath", "Dizziness"],
    diagnosis: "Hypertension with mild arrhythmia",
    needsRadiology: true,
    radiologyTypes: ["X-ray", "Ultrasound"],
    prescriptions: [
      {
        medication: "Lisinopril",
        dosage: "10mg",
        duration: "Once daily for 30 days"
      },
      {
        medication: "Metoprolol",
        dosage: "25mg",
        duration: "Twice daily for 30 days"
      }
    ],
    notes: "Patient should return for follow-up in 2 weeks. Advised to monitor blood pressure daily and maintain low sodium diet."
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Medical Examination Record</h1>
        <div className="flex items-center text-gray-500">
          <Clock size={16} className="mr-1" />
          <span className="text-sm">{data.dateExamen}</span>
        </div>
      </div>

      {/* Patient and Doctor Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <UserRound size={20} className="text-blue-600 mr-2" />
            <h2 className="font-semibold text-blue-800">Patient Information</h2>
          </div>
          <p className="text-gray-700 font-medium">{data.patientId.firstName} {data.patientId.lastName}</p>
          <p className="text-gray-500 text-sm">ID: {data.patientId._id}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <User size={20} className="text-green-600 mr-2" />
            <h2 className="font-semibold text-green-800">Doctor Information</h2>
          </div>
          <p className="text-gray-700 font-medium">{data.doctorId.firstName} {data.doctorId.lastName}</p>
          <p className="text-gray-500 text-sm">{data.doctorId.specialization}</p>
        </div>
      </div>

      {/* Medical Center */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <MapPin size={18} className="text-gray-600 mr-2" />
          <h2 className="font-semibold text-gray-800">Medical Center</h2>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-gray-700">{data.center.name}</p>
          <p className="text-gray-500 text-sm">{examinationData.centerAddress}</p>
        </div>
      </div>

      {/* Clinical Information */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Stethoscope size={18} className="text-gray-600 mr-2" />
          <h2 className="font-semibold text-gray-800">Clinical Information</h2>
        </div>
        
        {/* Symptoms */}
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">SYMPTOMS</h3>
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((symptom, index) => (
              <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                {symptom}
              </span>
            ))}
          </div>
        </div>
        
        {/* Diagnosis */}
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">DIAGNOSIS</h3>
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="text-gray-800 font-medium">{data.diagnosis}</p>
          </div>
        </div>
        
        {/* Radiology */}
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">RADIOLOGY NEEDED</h3>
          <div className="flex items-center mb-2">
            {data.needsRadiology ? 
              <CheckCircle size={18} className="text-green-600 mr-2" /> : 
              <XCircle size={18} className="text-red-600 mr-2" />
            }
            <span className="text-gray-700">
              {data.needsRadiology ? "Yes" : "No"}
            </span>
          </div>
          
          {data.needsRadiology && (
            <div className="flex flex-wrap gap-2 ml-6">
              {data.radiologyTypes.map((type, index) => (
                <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescriptions */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Pill size={18} className="text-gray-600 mr-2" />
          <h2 className="font-semibold text-gray-800">Prescriptions</h2>
        </div>
        
        <div className="space-y-3">
          {data.prescriptions.map((prescription, index) => (
            <div key={index} className="bg-blue-50 p-3 rounded-md">
              <p className="font-medium text-gray-800">{prescription.medication} {prescription.dosage}</p>
              <p className="text-gray-600 text-sm">{prescription.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center mb-3">
          <NotebookPen size={18} className="text-gray-600 mr-2" />
          <h2 className="font-semibold text-gray-800">Doctor's Notes</h2>
        </div>
        <div className="bg-gray-50 p-3 rounded-md italic text-gray-700">
          {data.notes}
        </div>
      </div>
    </div>
  );
}