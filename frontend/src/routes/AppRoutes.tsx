import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MarketAnalysis from '../pages/MarketAnalysis';
import Investments from '../pages/Investments';
import AetherAI from '../pages/AetherAI';
import Profile from '../pages/Profile';
import { useWallet } from '../contexts/WalletContext';

const AppRoutes = () => {
  const { account } = useWallet();

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/market-analysis" element={<MarketAnalysis />} />
      <Route path="/investments" element={<Investments />} />
      <Route path="/ai" element={<AetherAI />} />
      <Route path="/profile" element={
        account ? <Profile /> : <Navigate to="/dashboard" replace />
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
