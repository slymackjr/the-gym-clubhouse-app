import { LoadingComponent, Sidebar } from "../components";
import { Calendar, Clock, FileText, User } from "lucide-react";
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Permission } from "../hooks";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);



export default function Dashboard() {
  const [period, setPeriod] = useState("daily"); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const barChartRef = useRef(null);

  const { data: totals = [], isPending: isloading } = useQuery({
    queryKey: ["totals"],  
    onError: (error) => {
      toast.error("An error occurred: " + (error.response?.data?.message || "Unknown error"), {
        position: "top-center",
      });
    },
  });

  const { data: reportData = [], isPending: reportLoading } = useQuery({
    queryKey: [`/monthly-reports?year=${selectedYear}`, selectedYear], 
      onError: (error) => {
        toast.error(
          "An error occurred: " + (error.response?.data?.message || "Unknown error"),
          { position: "top-center" }
        );
      }
  });

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const barData = {
    labels: reportData?.members?.length
      ? reportData.members.map((item) => `${item.month}`)
      : [], 
    datasets: [
      reportData?.members?.length && {
        label: "NewMembers",
        data: reportData.members.map((item) => item.total),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      reportData?.paid?.length && {
        label: "PaidMembers",
        data: reportData.paid.map((item) => item.total),
        borderColor: "rgba(26, 4, 230,1)",
        backgroundColor: "rgba(26, 4, 230, 0.8)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      reportData?.invoices?.length && {
        label: "Amount",
        data: reportData.invoices.map((item) => item.total),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.8)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ].filter(Boolean), 
  };

  const chartData =
  period === "daily"
    ? totals?.daily
    : period === "weekly"
    ? totals?.weekly
    : totals?.monthly;


  const labels = chartData ? Object.values(chartData.labels || {}) : [];
  const membersData = chartData ? Object.values(chartData.members || {}) : [];
  const invoicesData = chartData ? Object.values(chartData.invoices || {}) : [];
  const paidMembersData = chartData ? Object.values(chartData.paid_members || {}) : [];


 const chartConfig = {
  labels,
   datasets: [
     {
       label: "Member Registrations",
       data: membersData, 
       borderColor: "rgba(255, 159, 64, 1)",
       backgroundColor: "rgba(255, 159, 64, 0.8)",
       fill: true,
       tension: 0.4,
       borderWidth: 2,
     },
     {
       label: "Invoices",
       data: invoicesData, 
       borderColor: "rgba(54, 162, 235, 1)",
       backgroundColor: "rgba(54, 162, 235, 0.8)",
       fill: true,
       tension: 0.4,
       borderWidth: 2,
     },
     {
       label: "Paid Members",
       data: paidMembersData, 
       borderColor: "rgba(75, 192, 192, 1)",
       backgroundColor: "rgba(75, 192, 192, 0.8)",
       fill: true,
       tension: 0.4,
       borderWidth: 2,
     },
   ],
 };


  if (isloading && reportLoading) {
    return <LoadingComponent />;
  }

  return (
    <Sidebar activePage="dashboard" alertPages={"dashboard"}>
      <div className="flex flex-col p-6 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Members"
            icon={<User  size={40} className="text-green-500" />}
            number={totals?.members || 0}
            description="Members"
          />
          <Card
            title="Invoices"
            icon={<FileText size={40} className="text-blue-500" />}
            number={totals?.invoices || 0}
            description="Invoices"
          />
          <Card
            title="Packages"
            icon={<Calendar size={40} className="text-yellow-500" />}
            number={totals?.packages || 0}
            description="Packages"
          />
          <Card
            title="Discounts"
            icon={<Clock size={40} className="text-red-500" />}
            number={totals?.discounts || 0}
            description="Discounts"
          />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6 flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white">
            Member and Invoice Statistics
          </h2>
        </div>
        <div className="flex justify-between items-center mb-4">
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              className={`px-4 py-2 text-sm font-semibold rounded-lg mx-2 transition-colors ${
                period === p
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <Bar 
          ref={barChartRef} 
          data={chartConfig} 
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              x: {
                ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
            },
          }} 
        />
      </div>

      <Permission role="admin">
      <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
      <div className="mb-6 flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white">
          Monthly Member Registered, Paid & Invoice Amount
        </h2>
      </div>

        <div className="flex justify-end gap-4 mb-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full md:w-auto px-4 py-2 border rounded-lg"
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full h-80 md:h-96">
          <Bar
           ref={barChartRef}
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: { mode: "index", intersect: false },
              },
              scales: {
                x: {
                  ticks: {
                    autoSkip: false, 
                    maxRotation: 90, 
                    minRotation: 90,
                  }
                }
              }
            }}
          />
        </div>
      </div>
      </Permission>
    </Sidebar>
  );
}

const Card = ({ title, icon, number, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-start transition-transform hover:scale-105">
      <div className="flex items-center space-x-4 w-full">
        {icon}
        <div className="text-right flex-1">
          <span className="text-3xl font-bold text-gray-800">{number}</span>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-between items-center">
        <span className="text-gray-600 font-medium">{title}</span>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  number: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};