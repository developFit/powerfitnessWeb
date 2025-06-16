import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import GroupIcon from "@mui/icons-material/Group";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card sx={{ backgroundColor: "#fff", height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {icon}
        <Box>
          <Typography variant="h6" sx={{ color: "#000" }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: "#000" }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const dataCumplimiento = [
  { mes: "Ene", cumplimiento: 78 },
  { mes: "Feb", cumplimiento: 82 },
  { mes: "Mar", cumplimiento: 69 },
  { mes: "Abr", cumplimiento: 91 },
  { mes: "May", cumplimiento: 87 },
  { mes: "Jun", cumplimiento: 74 },
];

const dataAsistencia = [
  { name: "Asistencias", value: 85 },
  { name: "Inasistencias", value: 15 },
];
const COLORS = ["#FFA726", "#333"];

const dataSocios = [
  { mes: "Ene", nuevos: 12, bajas: 4 },
  { mes: "Feb", nuevos: 18, bajas: 6 },
  { mes: "Mar", nuevos: 10, bajas: 8 },
  { mes: "Abr", nuevos: 22, bajas: 4 },
  { mes: "May", nuevos: 15, bajas: 5 },
  { mes: "Jun", nuevos: 20, bajas: 3 },
];

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#000", minHeight: "100vh", p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#FFA726" }}>
        Hola Gabriela
      </Typography>

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alumnos Activos"
            value="128"
            icon={<GroupIcon fontSize="large" htmlColor="#FFA726" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rutinas Creadas"
            value="45"
            icon={<FitnessCenterIcon fontSize="large" htmlColor="#FFA726" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Platos Nutricionales"
            value="76"
            icon={<FastfoodIcon fontSize="large" htmlColor="#FFA726" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ingresos del Mes"
            value="$152,000"
            icon={<MonetizationOnIcon fontSize="large" htmlColor="#FFA726" />}
          />
        </Grid>
      </Grid>

    <Card sx={{ backgroundColor: "#ffffff", mb: 4 }}>
  <CardContent>
    <Typography variant="h6" gutterBottom sx={{ color: "#000000" }}>
      Asistencias Mensual de Alumnos 
    </Typography>
    <Select defaultValue="Ene" size="small" sx={{ mb: 2, color: "#000000" }}>
      <MenuItem value="Ene">Enero</MenuItem>
      <MenuItem value="Feb">Febrero</MenuItem>
      <MenuItem value="Mar">Marzo</MenuItem>
      <MenuItem value="Abr">Abril</MenuItem>
      <MenuItem value="May">Mayo</MenuItem>
      <MenuItem value="Jun">Junio</MenuItem>
    </Select>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataCumplimiento}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="mes" stroke="#000000" />
        <YAxis stroke="#000000" />
        <Tooltip />
        <Bar dataKey="cumplimiento" fill="#FFA726" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#fffff", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#fffff" }}>
                Asistencia Promedio de Alumnos
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={dataAsistencia} dataKey="value" outerRadius={80} label>
                    {dataAsistencia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#fff", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#fffff" }}>
                altas y bajas de Alumnos/mes
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dataSocios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="mes" stroke="#fffff" />
                  <YAxis stroke="#fffff" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="nuevos" stroke="#FFA726" />
                  <Line type="monotone" dataKey="bajas" stroke="#FF7043" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
