import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  FiUsers,
  FiEdit,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
} from "react-icons/fi";
import { TbBed } from "react-icons/tb";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import * as XLSX from "xlsx";
import { api } from "../../../services/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Проверяем системные настройки темы при загрузке
  useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);

    // Добавляем/удаляем класс в зависимости от состояния
    if (prefersDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, []);

  // Функция для переключения темы
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    // Можно сохранить предпочтение в localStorage
    localStorage.setItem("darkMode", newDarkMode);
  };

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, roomsRes] = await Promise.all([
          api.getAdminMetrics(),
          api.getRoomsList(),
        ]);
        setMetrics(metricsRes.data);
        setRoomData(roomsRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOccupancyStatus = (room) => {
    const freeSpots = room.capacity - room.occupants.length;
    if (freeSpots === 0) return "full";
    if (freeSpots === room.capacity) return "free";
    return "partially";
  };

  const filteredStudents =
    statusFilter === "all"
      ? roomData
      : roomData.filter((room) => getOccupancyStatus(room) === statusFilter);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const exportToExcel = () => {
    const dataToExport = filteredStudents.map((room) => {
      const freeSpots = room.capacity - room.occupants.length;
      const status = getOccupancyStatus(room);
      return {
        "Room Number": room.number,
        "Total Spots": room.capacity,
        "Free Spots": freeSpots,
        Status: status.charAt(0).toUpperCase() + status.slice(1),
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Room Records");
    XLSX.writeFile(wb, "Room_Records.xlsx");
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container">Error: {error}</div>;

  const pieChartData = {
    labels: Object.keys(metrics.application_statuses),
    datasets: [
      {
        data: Object.values(metrics.application_statuses),
        backgroundColor: [
          "#81C784",
          "#FFD54F",
          "#E57373",
          "#90A4AE",
          "#BA68C8",
        ],
      },
    ],
  };

  const barChartData = {
    labels: metrics.analytics.priority_distribution.map(
      (p) => `Priority ${p.priority}`
    ),
    datasets: [
      {
        label: "Applications",
        data: metrics.analytics.priority_distribution.map((p) => p.count),
        backgroundColor: "rgba(67, 98, 238, 0.65)",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dormitory Management Dashboard</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers className="stat-icon" />
          <div className="stat-text-content">
            <h3>Total Students</h3>
            <p className="stat-value">{metrics.total_students}</p>
          </div>
        </div>
        <div className="stat-card">
          <TbBed className="stat-icon" />
          <div className="stat-text-content">
            <h3>Available Rooms</h3>
            <p className="stat-value">{metrics.available_rooms}</p>
          </div>
        </div>
        <div className="stat-card">
          <FiEdit className="stat-icon" />
          <div className="stat-text-content">
            <h3>Applications</h3>
            <p className="stat-value">{metrics.total_applications}</p>
          </div>
        </div>
        <div className="stat-card">
          <FiXCircle className="stat-icon" />
          <div className="stat-text-content">
            <h3>Rejected Applications</h3>
            <p className="stat-value">{metrics.rejected_applications}</p>
          </div>
        </div>
        <div className="stat-card">
          <TbBed className="stat-icon" />
          <div className="stat-text-content">
            <h3>Total Rooms</h3>
            <p className="stat-value">{metrics.room_stats.total_rooms}</p>
          </div>
        </div>
        <div className="stat-card">
          <TbBed className="stat-icon" />
          <div className="stat-text-content">
            <h3>Occupied Rooms</h3>
            <p className="stat-value">{metrics.room_stats.occupied_rooms}</p>
          </div>
        </div>
        <div className="stat-card">
          <TbBed className="stat-icon" />
          <div className="stat-text-content">
            <h3>Full Rooms</h3>
            <p className="stat-value">{metrics.room_stats.full_rooms}</p>
          </div>
        </div>
        <div className="stat-card">
          <TbBed className="stat-icon" />
          <div className="stat-text-content">
            <h3>Free Spots</h3>
            <p className="stat-value">{metrics.room_stats.free_spots}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Application Status Distribution</h3>
          <div className="chart-container">
            <Pie
              data={pieChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h3>Application Priority</h3>
          <div className="chart-container">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
                scales: {
                  x: {
                    ticks: {
                      autoSkip: false,
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="table-header">
            <h2>Room Records</h2>
            <div className="table-controls">
              <div className="status-filter">
                <label>Filter by Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="full">Full</option>
                  <option value="partially">Partially</option>
                  <option value="free">Free</option>
                </select>
              </div>
              <button onClick={exportToExcel} className="export-btn">
                <FiDownload /> Export
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Total Spots</th>
                  <th>Free Spots</th>
                  <th>Occupancy Status</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((room) => {
                  const freeSpots = room.capacity - room.occupants.length;
                  const status = getOccupancyStatus(room);

                  return (
                    <tr key={room.id}>
                      <td>{room.number}</td>
                      <td>{room.capacity}</td>
                      <td>{freeSpots}</td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="pagination-info">
              Showing {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length} records
            </div>
            <div className="pagination-controls">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <FiChevronLeft />
              </button>
              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span>Occupancy Rate</span>
              <span className="stat-number">92%</span>
            </div>
            <div className="stat-item">
              <span>Maintenance Requests</span>
              <span className="stat-number">5</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Recent Activity</h3>
            <div className="activity-item">
              <div className="activity-content">
                <div className="activity-text">
                  <p>New application received</p>
                </div>
                <small className="activity-time">10 minutes ago</small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <div className="activity-text">
                  <p>Room 101 maintenance completed</p>
                </div>
                <small className="activity-time">2 hours ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
