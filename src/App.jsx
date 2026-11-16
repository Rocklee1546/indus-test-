import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Common Layout
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Toast from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFound from './components/common/NotFound';

// Modals
import AddPatientModal from './components/modals/AddPatientModal';
import BookCheckInModal from './components/modals/BookCheckInModal';
import BookAppointmentModal from './components/modals/BookAppointmentModal';
import AddLeadModal from './components/modals/AddLeadModal';
import ConvertLeadModal from './components/modals/ConvertLeadModal';
import Patient360Drawer from './components/modals/Patient360Drawer';
import NewInvoiceModal from './components/modals/NewInvoiceModal';
import NewLabOrderModal from './components/modals/NewLabOrderModal';
import StockTransferModal from './components/modals/StockTransferModal';
import LeadDetailsDrawer from './components/modals/LeadDetailsDrawer';
import WhatsAppComposerModal from './components/modals/WhatsAppComposerModal';
import RescheduleFollowupModal from './components/modals/RescheduleFollowupModal';
import LostLeadModal from './components/modals/LostLeadModal';
import RescheduleAppointmentModal from './components/modals/RescheduleAppointmentModal';
import CancelAppointmentModal from './components/modals/CancelAppointmentModal';
import TokenSlipModal from './components/modals/TokenSlipModal';
import FollowupOutcomeModal from './components/modals/FollowupOutcomeModal';
import AddPatientFollowupModal from './components/modals/AddPatientFollowupModal';

// Modules
import DashboardModule from './components/modules/DashboardModule';
import LeadsModule from './components/modules/LeadsModule';
import PatientsModule from './components/modules/PatientsModule';
import AppointmentsModule from './components/modules/AppointmentsModule';
import FollowupsModule from './components/modules/FollowupsModule';
import WhatsAppModule from './components/modules/WhatsAppModule';
import DrawAndExplainModule from './components/modules/DrawAndExplainModule';
import BillingModule from './components/modules/BillingModule';
import StaffRolesModule from './components/modules/StaffRolesModule';
import InventoryModule from './components/modules/InventoryModule';
import AnalyticsModule from './components/modules/AnalyticsModule';
import SettingsModule from './components/modules/SettingsModule';

function MainLayout() {
  const { activeModule, setActiveModule } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL changes to AppContext activeModule (supports direct URL access, refresh, back/forward)
  useEffect(() => {
    const rawPath = location.pathname.replace(/^\//, '').toLowerCase();
    const pathToId = {
      '': 'dashboard',
      'dashboard': 'dashboard',
      'leads': 'leads',
      'followups': 'followups',
      'appointments': 'appointments',
      'patients': 'patients',
      'whatsapp': 'whatsapp',
      'campaigns': 'whatsapp',
      'draw-explain': 'draw_explain',
      'draw_explain': 'draw_explain',
      'billing': 'billing',
      'analytics': 'analytics',
      'settings': 'settings',
      'staff': 'staff',
      'inventory': 'inventory'
    };
    const matchedId = pathToId[rawPath];
    if (matchedId && activeModule !== matchedId) {
      setActiveModule(matchedId);
    }
  }, [location.pathname]);

  // Sync programmatic activeModule changes to browser URL
  useEffect(() => {
    const moduleToPath = {
      dashboard: '/dashboard',
      leads: '/leads',
      followups: '/followups',
      appointments: '/appointments',
      patients: '/patients',
      whatsapp: '/whatsapp',
      draw_explain: '/draw-explain',
      billing: '/billing',
      analytics: '/analytics',
      settings: '/settings',
      staff: '/staff',
      inventory: '/inventory'
    };
    const targetPath = moduleToPath[activeModule];
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [activeModule]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F9FD]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Header */}
        <Header />

        {/* Scrollable Viewport with Router Routes */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-[1600px] mx-auto">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardModule />} />
                <Route path="/leads" element={<LeadsModule />} />
                <Route path="/followups" element={<FollowupsModule />} />
                <Route path="/appointments" element={<AppointmentsModule />} />
                <Route path="/patients" element={<PatientsModule />} />
                <Route path="/whatsapp" element={<WhatsAppModule />} />
                <Route path="/campaigns" element={<Navigate to="/whatsapp" replace />} />
                <Route path="/draw-explain" element={<DrawAndExplainModule />} />
                <Route path="/draw_explain" element={<Navigate to="/draw-explain" replace />} />
                <Route path="/billing" element={<BillingModule />} />
                <Route path="/analytics" element={<AnalyticsModule />} />
                <Route path="/settings" element={<SettingsModule />} />
                <Route path="/staff" element={<StaffRolesModule />} />
                <Route path="/inventory" element={<InventoryModule />} />
                {/* 404 Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <AddPatientModal />
      <BookCheckInModal />
      <BookAppointmentModal />
      <AddLeadModal />
      <ConvertLeadModal />
      <Patient360Drawer />
      <NewInvoiceModal />
      <NewLabOrderModal />
      <StockTransferModal />
      <LeadDetailsDrawer />
      <WhatsAppComposerModal />
      <RescheduleFollowupModal />
      <LostLeadModal />
      <RescheduleAppointmentModal />
      <CancelAppointmentModal />
      <TokenSlipModal />
      <FollowupOutcomeModal />
      <AddPatientFollowupModal />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
