import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import ModulePage from "./pages/ModulePage"
import Quiz from "./components/Quiz"
import PhaserSimulation from "./components/PhaserSimulation"
import FloodSimulation from "./components/FloodSimulation"
import FireSimulation from "./components/FireSimulation"
import Admin from "./pages/Admin"
import FAQ from "./pages/FAQ"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AlertBanner from "./components/AlertBanner"
import SOSButton from "./components/SOSButton"
import Awareness from "./pages/Awareness"
import Simulations from "./pages/Simulations"
import Auth from "./pages/Auth"
import DashboardStudent from "./pages/DashboardStudent"
import DashboardAdmin from "./pages/DashboardAdmin"
import AdminQuizzes from "./pages/AdminQuizzes"
import AdminDrills from "./pages/AdminDrills"
import Profile from "./pages/Profile"
import { getSession } from "./utils/auth"

function RequireAuth({ children }) {
  const session = getSession()
  if (!session) return <Navigate to="/auth" replace />
  return children
}

function App() {
  return (
    <Router>
      <Header />
      <main className="container main">
        <AlertBanner />
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/awareness" element={<RequireAuth><Awareness /></RequireAuth>} />
          <Route path="/simulations" element={<RequireAuth><Simulations /></RequireAuth>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard/student" element={<RequireAuth><DashboardStudent /></RequireAuth>} />
          <Route path="/dashboard/admin" element={<RequireAuth><DashboardAdmin /></RequireAuth>} />
          <Route path="/admin/quizzes" element={<RequireAuth><AdminQuizzes /></RequireAuth>} />
          <Route path="/admin/drills" element={<RequireAuth><AdminDrills /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/module/:moduleId" element={<RequireAuth><ModulePage /></RequireAuth>} />
          <Route path="/quiz/:quizFile" element={<RequireAuth><Quiz /></RequireAuth>} />
          <Route path="/simulation/earthquake" element={<RequireAuth><PhaserSimulation /></RequireAuth>} />
          <Route path="/simulation/flood" element={<RequireAuth><FloodSimulation /></RequireAuth>} />
          <Route path="/simulation/fire" element={<RequireAuth><FireSimulation /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/faq" element={<RequireAuth><FAQ /></RequireAuth>} />
        </Routes>
      </main>
      <Footer />
      <SOSButton />
    </Router>
  )
}

export default App
