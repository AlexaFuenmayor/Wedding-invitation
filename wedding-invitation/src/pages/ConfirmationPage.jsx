import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/ConfirmationPage.scss'

function ConfirmationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state || typeof state.confirmacion !== 'boolean') {
    return <p>Información no disponible.</p>
  }

  const { confirmacion, familia, telefono, asistentesConfirmados } = state

  return (
    <div className="confirmation-page">
      <div className="confirmation-title">
        <h2>
          {confirmacion
            ? '¡Gracias por confirmar tu asistencia!'
            : 'Gracias por informarnos'}
        </h2>
      </div>

      <section className="confirmation-card">
        {confirmacion ? (
          <>
            <h3>¡Prepárate para Celebrar con Nosotros!</h3>
            <p><strong>Familia:</strong> {familia}</p>
            <p><strong>Asistentes confirmados:</strong> {asistentesConfirmados}</p>
            <h4>Detalles importantes:</h4>
            <p><strong>📅 Fecha:</strong> 10/10/2025</p>
            <p><strong>📍 Lugar:</strong> Calle 75a #24-35 Iglesia Bautista Soberana Gracia</p>
            <p><strong>🎁 Si desean darnos un presente:</strong> la lluvia de sobres será una opción muy apreciada.</p>
            <p><strong>🎩 Código de vestimenta:</strong> Semi Formal</p>
            <p><strong>🚫 Abstenerse de vestir:</strong> Azul, dorado, blanco</p>
            <p className="last">¡Les esperamos!</p>

          </>
        ) : (
          <>
            <p>Pocos días antes enviaremos el enlace al número : <strong>{telefono}</strong></p>

            <p className="last">¡Abrazos!</p>
          </>
        )}
      </section>

      <div className="confirmation-button">
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    </div>
  )
}

export default ConfirmationPage
