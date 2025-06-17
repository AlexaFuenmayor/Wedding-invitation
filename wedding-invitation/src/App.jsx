// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import InvitationCard from './components/InvitationCard'
import InvitationForm from './components/InvitationForm'
import ConfirmationPage from './pages/ConfirmationPage'
import AlreadyConfirmed from './pages/AlreadyConfirmed'
import InvalidCode from './pages/InvalidCode'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/familia/familia" replace />} />
        <Route path="/familia/:familia" element={<InvitationCard />} />
        <Route path="/form" element={<InvitationForm />} />
        <Route path="/confirmacion" element={<ConfirmationPage />} />
        <Route path="/already-confirmed" element={<AlreadyConfirmed />} />
        <Route path="/invalid-code" element={<InvalidCode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
