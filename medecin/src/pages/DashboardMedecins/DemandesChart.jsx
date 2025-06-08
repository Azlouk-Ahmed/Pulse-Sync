import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownRight } from "lucide-react";
import { useState } from "react";

function DemandesChart({ data }) {
  // Sample data if no data is provided
  const sampleData = [
    { day: 'Jeu', pendingAppointment: 2 },
    { day: 'Ven', pendingAppointment: 3 },
    { day: 'Sam', pendingAppointment: 1 },
    { day: 'Dim', pendingAppointment: 0 },
    { day: 'Lun', pendingAppointment: 2 },
    { day: 'Mar', pendingAppointment: 5 },
    { day: 'Mer', pendingAppointment: 4 },
  ];

  // Use provided data or sample data
  const chartData = data || sampleData;
  
  return (
    <div className="rounded-lg border box intro-y p-4 shadow">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">Demandes d'examens</h3>

      </div>
      
      <div className="mt-3 text-2xl font-bold">
        18 en attente
      </div>
      
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} demandes`, "Demandes"]}
              labelFormatter={(label) => `Jour : ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="pendingAppointment" 
              stroke="#8884d8" 
              name="Demandes"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DemandesChart;