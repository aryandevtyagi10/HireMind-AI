import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing         from './pages/Landing'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import InterviewPlan   from './pages/InterviewPlan'
import PlanReport      from './pages/PlanReport'
import AIInterview     from './pages/AIInterview'
import SessionReport   from './pages/SessionReport'
import History         from './pages/History'
import Pricing         from './pages/Pricing'

function Private({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"           element={<Landing />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/dashboard"  element={<Private><Dashboard /></Private>} />
          <Route path="/plan"       element={<Private><InterviewPlan /></Private>} />
          <Route path="/plan/:id"   element={<Private><PlanReport /></Private>} />
          <Route path="/interview"  element={<Private><AIInterview /></Private>} />
          <Route path="/report/:id" element={<Private><SessionReport /></Private>} />
          <Route path="/history"    element={<Private><History /></Private>} />
          <Route path="/pricing"    element={<Private><Pricing /></Private>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
