// src/components/AlreadyConfirmed.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/AlreadyConfirmed.scss'

function AlreadyConfirmed() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state

  if (!data) {
    return (
      <div className="already-confirmed-container">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="error">No hay información de confirmación disponible.</p>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="already-confirmed-container">
      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2>¡Gracias, Familia {data.familia}!</h2>
        <p>Ya hemos recibido tu confirmación 💌.<br></br> Detalles registrados:</p>

        <p><strong>¿Asistirá?:</strong> {data.confirmacion ? 'Sí' : 'No'}</p>

        {data.confirmacion ? (
          <p><strong>Asistentes confirmados:</strong> {data.asistentesConfirmados}</p>
        ) : (
          <p><strong>Teléfono para enviar el link de Zoom:</strong> {data.telefono}</p>
        )}

        {data.mensaje && (
          <p><strong>Mensaje enviado:</strong><br />"{data.mensaje}"</p>
        )}

        <p className="success">
          No necesitas volver a registrarte. Si deseas hacer un cambio, por favor contáctanos. <br></br>¡Gracias!
        </p>

        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </motion.div>
    </div>
  )
}

export default AlreadyConfirmed
