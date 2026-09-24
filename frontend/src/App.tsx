import { useEffect } from "react";
import { AppProvider, useAppState } from "./context/AppContext";
import { checkBackendHealth } from "./api";
import Background from "./components/Background";
import StickyNav from "./components/StickyNav";
import Hero from "./components/Hero";
import CBOMSection from "./components/CBOMSection";
import MoscaSection from "./components/MoscaSection";
import PQCRoadmap from "./components/PQCRoadmap";
import ExportPanel from "./components/ExportPanel";

function AppContent() {
  const { state, dispatch, enableDemoMode } = useAppState();

  useEffect(() => {
    checkBackendHealth()
      .then((online) => dispatch({ type: "SET_BACKEND_STATUS", status: online ? "online" : "offline" }))
      .catch(() => dispatch({ type: "SET_BACKEND_STATUS", status: "offline" }));
      
    // Auto-enable demo mode for immediate dashboard view
    enableDemoMode();
  }, [dispatch, enableDemoMode]);

  return (
    <div className="relative min-h-screen" style={{ background: "#0B1120" }}>
      <Background />
      <StickyNav />
      <div className="relative z-10">
        <Hero />
        {state.scanStatus === "success" && <CBOMSection />}
        <MoscaSection />
        <PQCRoadmap />
        <ExportPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
