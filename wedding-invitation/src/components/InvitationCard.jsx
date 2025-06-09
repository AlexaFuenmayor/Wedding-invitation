// src/components/InvitationCard.jsx
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/invitation-home.scss'
import codes from '../utils/codes'
function InvitationCard() {
  const navigate = useNavigate()
  const { familia } = useParams()



  // Si “familia” no está en nuestro objeto de códigos, mostramos mensaje de enlace inválido
if (!codes[familia]) {
  return (
    <div className="invalid-code">
      <div className="card">
        <p>😕 Lo sentimos, el enlace no es válido.</p>
        <p>Consulta con los novios para confirmar tu invitación.</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    </div>
  )
}


  // Si existe código, navegamos a /form?code=…
  const handleClick = () => {
    const code = codes[familia]
    navigate(`/form?code=${code}`)
  }

  return (
    <div className="envelope" style={{ cursor: 'pointer' }}>
      <button onClick={handleClick} role="button" tabIndex={0}>
        Confirma Aquí
      </button>
    </div>
  )
}

export default InvitationCard
