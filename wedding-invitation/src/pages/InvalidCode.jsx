import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/InvalidCode.scss'


function InvalidCode() {
  const navigate = useNavigate()

  return (
    <div className="invalid-code-container">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>😕 Código inválido</h2>
        <p className="error">
          El código ingresado no es válido.
        </p>
        <p>Por favor verifica el enlace o comunícate con los novios.</p>

        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </motion.div>
    </div>
  )
}

export default InvalidCode
