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
  
  const { data: stats, loading, error } = useFetchData("admin/age",[], true);   
  
  // Custom chart colors   
  const chartColors = () => [     
    getColor("primary", 0.9),     
    getColor("pending", 0.9),     
    getColor("warning", 0.9),     
    getColor("success", 0.9),     
    getColor("danger", 0.9),   
  ];    
  
  // Handle total value and avoid division by zero   
  const total = stats?.data?.reduce((sum: number, val: number) => sum + val, 0) || 1;    
  
  // Ensure stats has labels and data   
  const data: ChartData = useMemo(() => {     
    if (!stats?.labels || !stats?.data || stats?.labels.length === 0 || stats?.data.length === 0) {       
      return { labels: [], datasets: [] }; // Return empty chart data if no data is available     
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
    responsive: true,
    plugins: {       
      legend: {         
        display: false, // We will render our custom legend       
      },     
    },   
  }), [colorScheme, darkMode]);    
  
  // Loading state   
  if (loading) return <div className="flex items-center justify-center h-48">Loading...</div>;    
  
  // Error state   
  if (error) return <div className="flex items-center justify-center h-48">Error loading data</div>;    
  
  // If no data is available, show a message   
  if (!stats?.labels || !stats?.data || stats?.labels.length === 0 || stats?.data.length === 0) {     
    return <div className="flex items-center justify-center h-48">No data available</div>;   
  }    
  
  return (     
    <div className="max-w-4xl sm:max-w-full sm:w-auto">
      <div className="mb-6">
        <Chart         
          type="doughnut"         
          width={props.width}
          height={props.height}
          data={data}         
          options={options}         
          className={props.className}       
        />
      </div>        
      
      {/* Display custom legend with better spacing */}       
      {stats.labels && (         
        <div className="mt-8 w-52 sm:w-auto mx-auto">           
          {stats.labels.map((label: string, idx: number) => (             
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
      )}     
    </div>
  );  
}  

Main.defaultProps = {   
  width: "auto",   
  height: 300,   
  className: "", 
};  

export default Main;