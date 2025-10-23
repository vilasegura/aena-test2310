
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AirportListPage from './pages/AirportListPage';
import AirportDetailPage from './pages/AirportDetailPage';
import ActionListPage from './pages/ActionListPage';
import ActionDashboardPage from './pages/ActionDashboardPage';
import InformationRequirementsPage from './pages/InformationRequirementsPage';
import BimCategoriesPage from './pages/BimCategoriesPage';
import BimAttributesPage from './pages/BimAttributesPage';
import BimAttributeValuesPage from './pages/BimAttributeValuesPage';
import BimCategoryMappingPage from './pages/BimCategoryMappingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/aeropuertos" element={<AirportListPage />} />
        <Route path="/airport/:airportId" element={<AirportDetailPage />} />
        <Route path="/actuaciones" element={<ActionListPage />} />
        <Route path="/actuacion/:actuacionId" element={<ActionDashboardPage />} />
        <Route path="/requisitos" element={<InformationRequirementsPage />} />
        <Route path="/requisitos/bim/categorias" element={<BimCategoriesPage />} />
        <Route path="/requisitos/bim/atributos" element={<BimAttributesPage />} />
        <Route path="/requisitos/bim/atributos/:attributeId" element={<BimAttributeValuesPage />} />
        <Route path="/requisitos/bim/mapeo" element={<BimCategoryMappingPage />} />
      </Route>
    </Routes>
  );
}

export default App;