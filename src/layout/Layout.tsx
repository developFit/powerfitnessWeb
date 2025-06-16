import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#121212" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <Box sx={{ flex: 1, p: 2, color: "#FFA726" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
