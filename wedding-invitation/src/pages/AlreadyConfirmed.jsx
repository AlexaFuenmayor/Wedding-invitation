import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/AlreadyConfirmed.scss'

function AlreadyConfirmed() {
  const location = useLocation()
  const navigate = useNavigate()
  const confirmationData = location.state

  console.log('🚀 Datos de confirmación recibidos:', confirmationData)

  if (!confirmationData) {
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

  const {
    familia = 'Invitado',
    confirmacion,
    asistentesConfirmados,
    telefono,
    mensaje
  } = confirmationData

  return (
    <div className="already-confirmed-container">
      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2>¡Gracias, Familia {familia}!</h2>
        <p>Ya hemos recibido tu confirmación 💌</p>

        <div className="confirmation-details">
          <p><strong>¿Asistirá?:</strong> {confirmacion === 'CONFIRMADO' ? 'Sí' : 'No'}</p>

          {confirmacion === 'CONFIRMADO' && asistentesConfirmados > 0 && (
            <p><strong>Asistentes confirmados:</strong> {asistentesConfirmados}</p>
          )}

          {confirmacion === 'NEGADO' && telefono && (
            <p><strong>Teléfono para enviar el link de Zoom:</strong> {telefono}</p>
          )}

          {mensaje && (
            <div className="mensaje">
              <strong>Mensaje enviado:</strong>
              <p>"{mensaje}"</p>
            </div>
          )}
        </div>

        <p className="success">
          No necesitas volver a registrarte. Si deseas hacer un cambio, por favor contáctanos. <br />¡Gracias!
        </p>

        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </motion.div>
    </div>
  )
}

export default AlreadyConfirmed
