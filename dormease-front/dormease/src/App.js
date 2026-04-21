import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WithSidebarLayout from "./layout/WithSidebarLayout";
import WithAdminSidebarLayout from "./layout/WithAdminSidebarLayout";
import WithAitusaSidebarLayout from "./layout/WithAitusaSidebarLayout";

// Pages
import LoginForm from "./components/Auth/SignIn/LoginForm";
import ResetPassword from "./components/Auth/ForgotPassword/ResetPassword";
import SignUp from "./components/Auth/SignUp/SignUp";
import SupportList from "./components/Aitusa/Support/SupportList";
import LandingPage from "./pages/LandingPage/LandingPage";
import StudentHomePage from "./pages/HomePage/StudentHomePage";
import DormApplicationPage from "./pages/DormAppilcation/DormApplicationPage";
import RoomSelectionPage from "./pages/RoomSelection/RoomSelectionPage";
import EventsPage from "./pages/Events/EventsPage";
import SupportPage from "./components/User/Support/SupportPage";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import DormerTable from "./components/Admin/Application/ApplicationTable";
import StudentTable from "./components/Admin/Students/StudentTable";
import RoomsPage from "./components/User/Room/Page/RoomsPage";
import Payment from "./components/User/Payment/Payment";
import Events from "./components/Events/EventsStaff/Events-staff";
import AitusaDashboard from "./components/Aitusa/Dashboard/AitusaDashboard";
import FileUpload from "./components/User/Sign/DocumentUploadPage";
import CheckEmailPage from "./components/Auth/SignUp/CheckEmailPage";


import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Contracts from "./components/Admin/Contract/Contracts";
import EmailVerifyPage from "./components/Auth/VerifyAccount/EmailVerifyPage";
import TwoFAVerifyPage from "./components/Auth/SignIn/TwoFAVerifyPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user/verify-email" element={<EmailVerifyPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/2fa-verify" element={<TwoFAVerifyPage />} />

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route element={<WithSidebarLayout />}>
            <Route path="/student" element={<StudentHomePage />} />
            <Route path="/application" element={<DormApplicationPage />} />
            <Route path="/room-selection" element={<RoomSelectionPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/signed" element={<FileUpload />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<WithAdminSidebarLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/application" element={<DormerTable />} />
            <Route path="/students" element={<StudentTable />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/admin/contracts" element={<Contracts />} />
          </Route>
        </Route>

        {/* Aitusa routes */}
        <Route element={<ProtectedRoute allowedRoles={["aitusa"]} />}>
          <Route element={<WithAitusaSidebarLayout />}>
            <Route path="/aitusa/dashboard" element={<AitusaDashboard />} />
            <Route path="/aitusa/application" element={<DormerTable />} />
            <Route path="/aitusa/students" element={<StudentTable />} />
            <Route path="/aitusa/rooms" element={<RoomsPage />} />
            <Route path="/aitusa/events" element={<Events />} />
            <Route path="/aitusa/support" element={<SupportList />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
