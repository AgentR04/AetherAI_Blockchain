import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import MarketUpdate from '../pages/MarketUpdate';
import Investments from '../pages/Investments';
import AetherAI from '../pages/AetherAI';

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
