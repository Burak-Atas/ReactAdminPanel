import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { options } from "../BarChart/BarChartOptions"; // Bar grafiği için özel seçenekler

Chart.register(...registerables);

const campUsers = [10, 20, 15];

const camps = ["kamp1", "kamp2", "kamp3"];
// Etiketler: Ay isimlerini kullanarak döngü oluştur
const labels = campUsers.map((_, index) => camps[index%12]);

// Grafik verileri
export const data = {
  labels,

  datasets: [
    {
      backgroundColor: "#5052ff",
      data: campUsers,
      barPercentage: 1,
      borderRadius: 100,
      borderSkipped: true,
    },
  ],
};

const Dashboard = () => {
  const graphStyle = {
    minHeight: "10rem",
    maxWidth: "540px",
    width: "100%",
    border: "1px solid #C4C4C4",
    borderRadius: "0.375rem",
    padding: "30px",
  };

  return (
    <div>
      <div className="h-32 flex items-center">
        <h2 className="text-6xl">DASHBOARD</h2>
      </div>
      <div style={graphStyle}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
