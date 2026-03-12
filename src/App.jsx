import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SignUpConfirmationPage from "./pages/SignUpConfirmationPage";
import DashboardHome from "./pages/DashboardHome";
import AboutPage from "./pages/AboutPage";
import ThemePreviewPage from "./pages/ThemePreviewPage";
import ProgressIndicatorPreview from "./pages/ProgressIndicatorPreview";
import BusinessComingSoon from "./pages/business/BusinessComingSoon";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import PropertiesPage from "./pages/business/PropertiesPage";
import PropertyDetailPage from "./pages/business/PropertyDetailPage";
import AddPropertyPage from "./pages/business/AddPropertyPage";
import FleetPage from "./pages/business/FleetPage";
import VehicleDetailPage from "./pages/business/VehicleDetailPage";
import AddVehiclePage from "./pages/business/AddVehiclePage";
import FileClaimPage from "./pages/business/FileClaimPage";
import MakePaymentPage from "./pages/business/MakePaymentPage";
import MapPage from "./pages/business/MapPage";

// Financial Dashboard Prototypes
import DashboardSelector from "./pages/dashboards/DashboardSelector";
import ConservativeDashboard from "./pages/dashboards/ConservativeDashboard";
import ConservativeAssetDetail from "./pages/dashboards/ConservativeAssetDetail";
import ModernDashboard from "./pages/dashboards/ModernDashboard";
import ModernAssetDetail from "./pages/dashboards/ModernAssetDetail";
import CreativeDashboard from "./pages/dashboards/CreativeDashboard";
import CreativeAssetDetail from "./pages/dashboards/CreativeAssetDetail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/confirmation" element={<SignUpConfirmationPage />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/theme-preview" element={<ThemePreviewPage />} />
        <Route path="/progress-preview" element={<ProgressIndicatorPreview />} />

        {/* Business Routes */}
        <Route path="/business" element={<Navigate to="/business/dashboard" replace />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/properties" element={<PropertiesPage />} />
        <Route path="/business/properties/add" element={<AddPropertyPage />} />
        <Route path="/business/properties/:propertyId" element={<PropertyDetailPage />} />
        <Route path="/business/fleet" element={<FleetPage />} />
        <Route path="/business/fleet/add" element={<AddVehiclePage />} />
        <Route path="/business/fleet/:vehicleId" element={<VehicleDetailPage />} />
        <Route path="/business/map" element={<MapPage />} />
        <Route path="/business/claims" element={<BusinessComingSoon />} />
        <Route path="/business/payments" element={<BusinessComingSoon />} />
        <Route path="/business/file-claim" element={<FileClaimPage />} />
        <Route path="/business/make-payment" element={<MakePaymentPage />} />

        {/* Financial Dashboard Prototypes */}
        <Route path="/dashboards" element={<DashboardSelector />} />
        <Route path="/dashboard-conservative" element={<ConservativeDashboard />} />
        <Route path="/dashboard-conservative/:assetId" element={<ConservativeAssetDetail />} />
        <Route path="/dashboard-modern" element={<ModernDashboard />} />
        <Route path="/dashboard-modern/:assetId" element={<ModernAssetDetail />} />
        <Route path="/dashboard-creative" element={<CreativeDashboard />} />
        <Route path="/dashboard-creative/:assetId" element={<CreativeAssetDetail />} />
      </Routes>
    </Layout>
  );
}
