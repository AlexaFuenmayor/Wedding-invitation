// src/App.jsx
import React, { useEffect } from 'react'; // ✅ Importar aquí
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import InvitationCard from './components/InvitationCard'
import InvitationForm from './components/InvitationForm'
import ConfirmationPage from './pages/ConfirmationPage'
import AlreadyConfirmed from './pages/AlreadyConfirmed'
import InvalidCode from './pages/InvalidCode'

function App() {
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API_URL}/api/guests/ping`)
      .then(res => res.text())
      .then(text => console.log('Backend despierto:', text))
      .catch(err => console.error('No se pudo hacer ping al backend:', err))
  }, []) // [] para que se ejecute solo una vez

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
