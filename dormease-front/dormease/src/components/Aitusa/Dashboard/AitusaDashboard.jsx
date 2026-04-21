import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { api } from "../../../services/api";
import {
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const AitusaDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await api.getAitusaMetrics();
        setMetrics(response.data);
      } catch (error) {
        console.error("Error loading Aitusa metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!metrics) {
    return <div className="dashboard-container">Failed to load metrics.</div>;
  }

  const cards = [
    {
      icon: <FiMessageSquare />,
      label: "Total Messages",
      value: metrics.total_messages,
      color: "#3f51b5",
    },
    {
      icon: <FiAlertTriangle />,
      label: "Unanswered",
      value: metrics.unanswered,
      color: "#f44336",
    },
    {
      icon: <FiCheckCircle />,
      label: "Answered",
      value: metrics.answered,
      color: "#4caf50",
    },
    {
      icon: <FiClock />,
      label: "New Today",
      value: metrics.new_today,
      color: "#ff9800",
    },
  ];

  const barData = {
    labels: ["Average Response Time (min)"],
    datasets: [
      {
        label: "Avg Response Time",
        data: [metrics.avg_response_minutes],
        backgroundColor: "#3f51b5",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Aitusa Support Dashboard</h1>
      </header>

      <div className="stats-grid">
        {cards.map((card, idx) => (
          <div
            className="stat-card"
            key={idx}
            style={{ borderLeft: `5px solid ${card.color}` }}
          >
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-text-content">
              <h3>{card.label}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Average Response Time</h3>
          <div className="chart-container">
            <Bar
              data={{
                labels: [""],
                datasets: [
                  {
                    label: "Avg Response Time (min)",
                    data: [metrics.avg_response_minutes || 0],
                    backgroundColor: "linear-gradient(90deg, #3f51b5, #7986cb)",
                    borderRadius: 12,
                    barThickness: 40,
                  },
                ],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` ${ctx.raw} minutes`,
                    },
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value} min`,
                    },
                    grid: { drawTicks: false, drawOnChartArea: false },
                  },
                  y: {
                    grid: { display: false },
                    ticks: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AitusaDashboard;
