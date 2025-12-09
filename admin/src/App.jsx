import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";

import Announce from "./ANNOUNCEMENT/announcement";
import Cenro from "./BACKROOM/CENRO/cenro";
import Cho from "./BACKROOM/CHO/cho";
import Cmswo from "./BACKROOM/CMSWO/cmswo";
import Obo from "./BACKROOM/OBO/obo";
import Zoning from "./BACKROOM/ZONING/zoning";
import Dashboard from "./DASHBOARD/dashboard";
import Login from "./LOGIN/login";
import New_records from "./NEW_RECORDS/new_records";
import Renew_records from "./RENEW_RECORDS/renew_records";
import Examiners from "./TREASURER/examiners/examiners";
import BusinessTax from "./TREASURER/businessTax/businessTax";
import Treasurers from "./TREASURER/treasurers/treasurers";
import BusinessProfile from "./BUSINESSPROFILE/businessProfile";
import Forbidden from "./ERRORPAGE/errorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedOffices={["BPLO", "SUPERADMIN"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/new_records"
          element={
            <RoleRoute allowedOffices={["BPLO", "SUPERADMIN"]}>
              <New_records />
            </RoleRoute>
          }
        />

        <Route
          path="/cenro"
          element={
            <RoleRoute allowedOffices={["CENRO", "SUPERADMIN"]}>
              <Cenro />
            </RoleRoute>
          }
        />

        <Route
          path="/cho"
          element={
            <RoleRoute allowedOffices={["CHO", "SUPERADMIN"]}>
              <Cho />
            </RoleRoute>
          }
        />

        <Route
          path="/cmswo"
          element={
            <RoleRoute allowedOffices={["CSWMO", "SUPERADMIN"]}>
              <Cmswo />
            </RoleRoute>
          }
        />

        <Route
          path="/zoning"
          element={
            <RoleRoute allowedOffices={["ZONING", "SUPERADMIN"]}>
              <Zoning />
            </RoleRoute>
          }
        />

        <Route
          path="/obo"
          element={
            <RoleRoute allowedOffices={["OBO", "SUPERADMIN"]}>
              <Obo />
            </RoleRoute>
          }
        />

        <Route
          path="/examiners"
          element={
            <RoleRoute allowedOffices={["EXAMINERS", "SUPERADMIN"]}>
              <Examiners />
            </RoleRoute>
          }
        />

        <Route
          path="/businessTax"
          element={
            <RoleRoute allowedOffices={["BUSINESS TAX", "SUPERADMIN"]}>
              <BusinessTax />
            </RoleRoute>
          }
        />

        <Route
          path="/treasurers"
          element={
            <RoleRoute allowedOffices={["TREASURER", "SUPERADMIN"]}>
              <Treasurers />
            </RoleRoute>
          }
        />
        <Route path="/error" element={<Forbidden />} />

        {/* Common Protected Page */}
        <Route
          path="/businessProfile"
          element={
            <ProtectedRoute>
              <BusinessProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcement"
          element={
            <ProtectedRoute>
              <Announce />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
