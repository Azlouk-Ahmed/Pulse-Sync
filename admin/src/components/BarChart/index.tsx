import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useMemo } from "react";
import { useFetchData } from "../../hooks/useFetchData";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
}

function Main(props: MainProps) {
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const { data: stats, loading, error } = useFetchData("admin/appointment-stats", [], true);

  // Status-color map
  const statusColors: Record<string, string> = {
    pending: getColor("warning", 0.6),
    confirmed: getColor("success", 0.6),
    completed: getColor("primary", 0.6),
    cancelled: getColor("danger", 0.6),
    missed: getColor("danger", 0.3),
    ongoing: getColor("secondary", 0.6),
    requested: getColor("info", 0.6),
  };

  // Calculate total across all datasets for label percentage
  const total = useMemo(() => {
    if (!stats?.datasets) return 1;
    return stats.datasets.reduce((sum: number, ds: any) => {
      return sum + ds.data.reduce((a: number, b: number) => a + b, 0);
    }, 0);
  }, [stats]);

  const data: ChartData<"bar"> = useMemo(() => {
    if (!stats || !stats.labels || !stats.datasets) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: stats.labels,
      datasets: stats.datasets.map((ds: any) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: statusColors[ds.label] || getColor("slate.400", 0.5),
        borderRadius: 5,
        borderWidth: 2,
        borderSkipped: false,
      })),
    };
  }, [stats, colorScheme, darkMode]);

  const options: ChartOptions<"bar"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll show custom labels
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          color: getColor("slate.600", 0.8),
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          color: getColor("slate.600", 0.8),
        },
        grid: {
          color: darkMode ? getColor("slate.500", 0.2) : getColor("slate.300"),
          drawBorder: false,
        },
      },
    },
  }), [colorScheme, darkMode]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading chart data.</div>;

  return (
    <div className="max-w-4xl sm:max-w-full sm:w-auto">
        <div className="mt-8 gap-5 w-full sm:w-auto ml-auto flex justify-center">
        {data.datasets.map((ds, idx) => {
          const sum = ds.data.reduce((a, b) => a + b, 0);
          const percent = Math.round((sum / total) * 100);
          return (
            <div key={idx} className={`flex items-center`}>
              <div
                className="w-2 h-2 mr-3 rounded-full"
                style={{ backgroundColor: ds.backgroundColor as string }}
              ></div>
              <span className="truncate">{ds.label}</span>
              <span className="ml-auto font-medium">{percent}%</span>
            </div>
          );
        })}
      </div>
      <Chart
        type="bar"
        width={props.width}
        height={props.height}
        data={data}
        options={options}
        className={props.className}
      />

      {/* Custom Legend */}
      
    </div>
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
