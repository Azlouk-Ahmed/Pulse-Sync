import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function IncomeChart({ data }) {
  return (
    <div className="p-6 rounded-xl box intro-x shadow-sm border">
      <h3 className="text-xl font-semibold  mb-6">rendez vous</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value, name) => {
                if (name === "newPatients") {
                  return [`${value} patients`, "New Patients"];
                } else if (name === "appointments") {
                  return [`${value}`, "Appointments"];
                }
                return [value, name];
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={10}
            />
            <Line
              name="Appointments"
              type="monotone"
              dataKey="appointments"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
              activeDot={{
                r: 6,
                stroke: "#10B981",
                strokeWidth: 1,
                fill: "#ffffff",
              }}
            />
            <Line
              name="New Patients"
              type="monotone"
              dataKey="newPatients"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
              activeDot={{
                r: 6,
                stroke: "#3B82F6",
                strokeWidth: 1,
                fill: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeChart;