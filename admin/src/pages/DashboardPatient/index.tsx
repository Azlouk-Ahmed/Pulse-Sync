import React, { useState } from "react";
import {
  FaUser,
  FaVenus,
  FaArrowUp,
  FaTint,
  FaUserMd,
  FaVial,
} from "react-icons/fa";
import {
  PiHeartbeatBold,
  PiDropBold,
  PiPillBold,
} from "react-icons/pi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer, BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import photo1 from "../../assets/images/femme1.jpg";
import photo2 from "../../assets/images/femme2.jpg";
import photo3 from "../../assets/images/femme3.jpg";

const claimsData = [
  { name: "Jan", requested: 4000, approved: 2400 },
  { name: "Feb", requested: 3000, approved: 1398 },
  { name: "Mar", requested: 2000, approved: 980 },
  { name: "Apr", requested: 2780, approved: 2500 },
];
interface VisitData {
  date: string;
  value: number;
}

const expensesData = [
  { name: "Cash", value: 300 },
  { name: "Card", value: 700 },
];

const COLORS = ["#3b82f6", "#e5e7eb"];


interface PatientData {
  name: string;
  gender: string;
  age: number;
  bloodType: string;
  consultingDoctor: string;
  bpLevels: VisitData[];
  sugarLevels: VisitData[];
  heartRate: VisitData[];
  cholesterol: VisitData[];
}

const PatientDashboard: React.FC = () => {
  const [patientData] = useState<PatientData>({
    name: "Carole",
    gender: "Female",
    age: 68,
    bloodType: "O+",
    consultingDoctor: "Dr. David",
    bpLevels: [
      { date: "24/04/2024", value: 140 },
      { date: "16/04/2024", value: 190 },
      { date: "10/04/2024", value: 230 },
    ],
    sugarLevels: [
      { date: "24/04/2024", value: 140 },
      { date: "16/04/2024", value: 190 },
      { date: "10/04/2024", value: 230 },
    ],
    heartRate: [
      { date: "24/04/2024", value: 110 },
      { date: "16/04/2024", value: 120 },
      { date: "10/04/2024", value: 100 },
    ],
    cholesterol: [
      { date: "24/04/2024", value: 180 },
      { date: "16/04/2024", value: 220 },
      { date: "10/04/2024", value: 230 },
    ],
  });

  return (
    <div className="bg-[#f7f9fc] min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Patient Info */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-wrap items-center justify-between">
          <div className="flex gap-8 flex-wrap">
            <InfoItem icon={<FaUser />} label="Patient Name" value={patientData.name} />
            <InfoItem icon={<FaVenus />} label="Gender" value={patientData.gender} />
            <InfoItem icon={<FaArrowUp />} label="Patient Age" value={patientData.age.toString()} />
            <InfoItem icon={<FaTint />} label="Blood Type" value={patientData.bloodType} />
            <InfoItem icon={<FaUserMd />} label="Consulting Doctor" value={patientData.consultingDoctor} />
          </div>
          <div className="mt-4 md:mt-0">
            <img
              src={photo1}
              alt={patientData.consultingDoctor}
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "../../assets/images/default-doctor.jpg";
              }}
            />
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard icon={<PiPillBold size={28} />} title="BP Levels" color="red" data={patientData.bpLevels} />
          <MetricCard icon={<PiDropBold size={28} />} title="Sugar Levels" color="blue" data={patientData.sugarLevels} />
          <MetricCard icon={<PiHeartbeatBold size={28} />} title="Heart Rate" color="green" data={patientData.heartRate} />
          <MetricCard icon={<FaVial size={24} />} title="Cholesterol" color="yellow" data={patientData.cholesterol} />
        </div>

        {/* Health Insurance Claims & Medical Expenses */}
        <div className="flex space-x-6">
          {/* Insurance Claims Bar Chart */}
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={claimsData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requested" fill="#3b82f6" />
                <Bar dataKey="approved" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Medical Expenses Pie Chart */}
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>



        {/* Doctor Visits */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Doctor Visits</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-2">Doctor</th>
                <th className="p-2">Date</th>
                <th className="p-2">Department</th>
                <th className="p-2">Reports</th>
              </tr>
            </thead>
            <tbody>
              <DoctorVisitRow name="Dr. Hector" date="20/05/2024" department="Radiologie" img="/assets/images/femme2.jpg" />
              <DoctorVisitRow name="Dr. Mitchel" date="20/05/2024" department="Scanner" img="/assets/images/femme2.jpg" />
            </tbody>
          </table>
        </div>

        {/* Reports */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Reports</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-2">#</th>
                <th className="p-2">File</th>
                <th className="p-2">Reports Link</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <ReportRow number={1} link="Reports 1 clinical documentation" date="May-28, 2024" />
              <ReportRow number={2} link="Reports 2 random files documentation" date="Mar-20, 2024" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="bg-blue-600 text-white rounded-full p-3 text-xl">{icon}</div>
    <div>
      <h2 className="text-md font-semibold">{value}</h2>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const MetricCard = ({
  icon,
  title,
  color,
  data,
}: {
  icon: JSX.Element;
  title: string;
  color: "red" | "blue" | "green" | "yellow";
  data: VisitData[];
}) => {
  const colorMap = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`rounded-full p-3 ${colorMap[color]}`}>{icon}</div>
        <div>
          <h3 className="text-md font-semibold">{title}</h3>
          <p className="text-xs text-gray-500">Recent five visits</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-1 text-sm">
        {data.map((d, i) => (
          <div key={i} className="flex justify-between border-b pb-1 text-gray-700">
            <span>{d.date}</span>
            <span>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center space-x-1">
    <div className={`w-3 h-3 bg-${color} rounded-full`} />
    <span>{label}</span>
  </div>
);

const DoctorVisitRow = ({ name, date, department, img }: { name: string; date: string; department: string; img: string }) => (
  <tr className="border-b">
    <td className="p-2 flex items-center space-x-2">
      <img
        src={img}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
        onError={(e) => {
          // Remplacer l'image cassée par l'image par défaut
          (e.target as HTMLImageElement).src = "/assets/images/doctor1.jpg"; // Utiliser une image par défaut
        }}
      />
      <span>{name}</span>
    </td>
    <td className="p-2">{date}</td>
    <td className="p-2">{department}</td>
    <td className="p-2 space-x-2">
      <button className="bg-red-400 text-white px-2 py-1 rounded text-xs">Voir les rapports</button>
      <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">🔗</button>
    </td>
  </tr>
);


const ReportRow = ({ number, link, date }: { number: number; link: string; date: string }) => (
  <tr className="border-b">
    <td className="p-2">{number}</td>
    <td className="p-2">📄</td>
    <td className="p-2 text-blue-500 underline">{link}</td>
    <td className="p-2">{date}</td>
    <td className="p-2 space-x-2">
      <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">🗑️</button>
      <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">📥</button>
    </td>
  </tr>
);

export default PatientDashboard;
