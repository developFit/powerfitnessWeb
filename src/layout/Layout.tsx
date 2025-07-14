import React from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#121212" }}>
      {!isLoginPage && <Sidebar />}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!isLoginPage && <Topbar />}
        <Box sx={{ flex: 1, p: isLoginPage ? 0 : 2, color: "#FFA726" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;