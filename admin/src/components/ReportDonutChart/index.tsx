import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useMemo } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import Chart from "../../base-components/Chart";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
}

function Main(props: MainProps) {
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  // Fetch the appointment status data
  const { data: stats, loading, error } = useFetchData("admin/status", [], true);

  // Custom chart colors
  const chartColors = () => [
    getColor("primary", 0.9),
    getColor("secondary", 0.9),
    getColor("success", 0.9),
    getColor("info", 0.9),
    getColor("warning", 0.9),
    getColor("pending", 0.9),
    getColor("danger", 0.9),
  ];

  // Ensure stats is not null or undefined before accessing its properties
  const total = stats?.data?.reduce((sum: number, val: number) => sum + val, 0) || 1;

  // Chart data configuration
  const data: ChartData = useMemo(() => {
    if (!stats || !stats.labels || !stats.data) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: stats.labels,
      datasets: [
        {
          data: stats.data,
          backgroundColor: chartColors(),
          hoverBackgroundColor: chartColors(),
          borderWidth: 5,
          borderColor: darkMode ? getColor("darkmode.700") : getColor("white"),
        },
      ],
    };
  }, [stats, colorScheme, darkMode]);

  // Chart options
  const options: ChartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Custom legend below the chart
      },
    },
  }), [colorScheme, darkMode]);

  // If data is still loading, show a loading state
  if (loading) return <div>Loading...</div>;

  // If there is an error, show an error message
  if (error) return <div>Error loading data</div>;

  return (
    <div className="max-w-4xl sm:max-w-full sm:w-auto">
      <Chart
        type="doughnut"
        width={props.width}
        height={props.height}
        data={data}
        options={options}
        className={props.className}
      />

      <div className="mt-8 w-52 sm:w-auto mx-auto">
        {stats?.labels?.map((label: string, idx: number) => (
          <div key={idx} className={`flex items-center ${idx !== 0 ? "mt-4" : ""}`}>
            <div
              className="w-2 h-2 mr-3 rounded-full"
              style={{ backgroundColor: data.datasets[0].backgroundColor?.[idx] }}
            ></div>
            <span className="truncate">{label}</span>
            <span className="ml-auto font-medium">
              {Math.round((stats.data[idx] / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
