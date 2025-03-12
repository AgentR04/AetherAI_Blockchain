import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import AetherAI from "../pages/AetherAI";
import Dashboard from "../pages/Dashboard";
import Investments from "../pages/Investments";
import MarketUpdate from "../pages/MarketUpdate";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="market" element={<MarketUpdate />} />
          <Route path="investments" element={<Investments />} />
          <Route path="ai" element={<AetherAI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
