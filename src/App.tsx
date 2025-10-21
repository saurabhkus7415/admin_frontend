import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Upload from "./pages/Upload";
import Approvals from "./pages/Approvals";
import Audit from "./pages/Audit";

const getInitialToken = () => localStorage.getItem("token");

function App() {
  const [token, setToken] = useState(getInitialToken());

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {!token && <Route path="/*" element={<Navigate to="/login" />} />}

        {token && (
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Approvals />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="upload" element={<Upload />} />
            <Route path="audit" element={<Audit />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
