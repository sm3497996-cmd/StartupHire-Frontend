import { createBrowserRouter, useNavigate } from "react-router-dom";

import Home from "../pages/home/Home";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PublicCompany from "../pages/company/PublicCompany";
import { doLogout } from "../services/authService";

/* =========================================
   ROUTES — saare URLs yahin se
   har sidebar option ka apna route hai:
   /candidate-dashboard/find, /employer-dashboard/team, /admin/users ...
========================================= */

const CandidateRoute = () => {
  const navigate = useNavigate();
  return <CandidateDashboard onLogout={() => doLogout(navigate)} />;
};

const EmployerRoute = () => {
  const navigate = useNavigate();
  return <EmployerDashboard onLogout={() => doLogout(navigate)} />;
};

/* NEW: Super Admin route wrapper */
const AdminRoute = () => {
  const navigate = useNavigate();

  return (
    <AdminDashboard
      onExit={() => {
        navigate("/");
        window.scrollTo(0, 0);
      }}
    />
  );
};

/* =========================================
   ROUTES (const App se pehle)
========================================= */

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/candidate-dashboard", element: <CandidateRoute /> },
  { path: "/candidate-dashboard/:section", element: <CandidateRoute /> },
  { path: "/employer-dashboard", element: <EmployerRoute /> },
  { path: "/employer-dashboard/:section", element: <EmployerRoute /> },

  // NEW: public company page (bina login ke khulta hai)
  { path: "/company/:id", element: <PublicCompany /> },

  // NEW: super admin
  { path: "/admin", element: <AdminRoute /> },
  { path: "/admin/:section", element: <AdminRoute /> },
]);

export default router;
