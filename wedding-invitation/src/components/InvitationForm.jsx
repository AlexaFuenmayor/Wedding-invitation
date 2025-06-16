import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/InvitationForm.scss'
import Layout from './Layout'
import InvalidCode from '../pages/InvalidCode.jsx'

function InvitationForm() {
  const API_URL = import.meta.env.VITE_API_URL
  const [guest, setGuest] = useState(null)
  const [form, setForm] = useState({
    asistira: '',
    asistentesConfirmados: 0,
    mensaje: '',
    telefono: ''
  })
  const [status, setStatus] = useState({ loading: true, error: null })
  const [formError, setFormError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [code, setCode] = useState(null)

  // Extraer el código una vez que location.search esté disponible
  useEffect(() => {
    const searchCode = new URLSearchParams(location.search).get('code')
    if (searchCode) setCode(searchCode)
  }, [location.search])

  // Hacer fetch de los datos del invitado cuando ya haya código
  useEffect(() => {
    if (!code) return

    fetch(`${API_URL}/api/guests/codigo/${code}`)
      .then(async res => {
        const text = await res.text()
        let data

        try {
          data = JSON.parse(text)
        } catch (err) {
          throw new Error(text || 'Respuesta inválida del servidor')
        }

        if (data.estadoConfirmacion && data.estadoConfirmacion !== 'PENDIENTE') {
          navigate('/already-confirmed', {
            state: {
              confirmacion: data.estadoConfirmacion,
              familia: data.nombre || data.familia,
              telefono: data.telefono || '',
              asistentesConfirmados: data.asistentesConfirmados
            }
          })
        } else {
          setGuest(data)
          setStatus({ loading: false, error: null })
        }
      })
      .catch(err => {
        setStatus({ loading: false, error: err.message })
      })
  }, [code])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const telefonoLimpio = form.telefono.replace(/\D/g, '')

    if (!form.asistira) {
      setFormError('Por favor selecciona si asistirás.')
      return false
    }

    if (form.asistira === 'si' && Number(form.asistentesConfirmados) < 1) {
      setFormError('Indica al menos 1 asistente.')
      return false
    }

    if (form.asistira === 'no' && telefonoLimpio.length < 10) {
      setFormError('Por favor ingresa un número de teléfono válido (mínimo 10 dígitos).')
      return false
    }

    setFormError(null)
    return true
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validateForm()) return

    const telefonoLimpio = form.telefono.replace(/\D/g, '')
    setStatus({ loading: true, error: null })

    const cuerpo = {
      asistira: form.asistira === 'si',
      asistentesConfirmados: form.asistira === 'si' ? Number(form.asistentesConfirmados) : 0,
      mensaje: form.mensaje,
      telefono: telefonoLimpio
    }

    fetch(`${API_URL}/api/guests/codigo/${code}/confirmar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    })
      .then(async res => {
        const text = await res.text()
        let data = null

        try {
          data = JSON.parse(text)
        } catch (error) {
          throw new Error(text || 'Error al confirmar')
        }

        if (!res.ok) {
          if (data.estadoConfirmacion && data.estadoConfirmacion !== 'PENDIENTE') {
            navigate('/already-confirmed', {
              state: {
                confirmacion: data.estadoConfirmacion,
                familia: data.familia || 'Invitado',
                telefono: data.telefono || form.telefono,
                asistentesConfirmados: data.asistentesConfirmados
              }
            })
          } else {
            throw new Error(data.message || 'Error al confirmar')
          }
          return
        }

        navigate('/confirmacion', {
          state: {
            confirmacion: form.asistira === 'si',
            familia: data.familia || 'Invitado',
            telefono: data.telefono || form.telefono,
            asistentesConfirmados: data.asistentesConfirmados
          }
        })
      })
      .catch(err => {
        setStatus({ loading: false, error: err.message })
      })
  }

  if (status.loading) {
    return (
      <Layout>
        <div className="loading-box"></div>
      </Layout>
    )
  }

  if (status.error) {
    return <InvalidCode mensaje={status.error} />
  }

  if (!guest) {
    return (
      <Layout>
        <div className="loading-box"></div>
      </Layout>
    )
  }

  return (
    <div className="invitation-container">
      <section style={{ marginBottom: '20px' }}>
        <h1>Familia {guest.familia} <br /> ¡Están cordialmente invitados a nuestra boda!</h1>
        <p>Queremos que sean parte de este momento tan especial</p>
      </section>

      <form onSubmit={handleSubmit}>
        <h2>Confirma tu asistencia</h2>

        <div>
          <label>
            ¿Asistirás?
            <select
              name="asistira"
              value={form.asistira}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        {form.asistira === 'si' && (
          <div>
            <label>
              Número de asistentes confirmados:
              <input
                type="number"
                name="asistentesConfirmados"
                min="1"
                max={guest.maxAsistentes}
                value={form.asistentesConfirmados}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        )}

        {form.asistira === 'no' && (
          <div className="zoom-card" style={{
            border: '1px solid #ccc',
            padding: '1em',
            borderRadius: '10px',
            margin: '1em 0'
          }}>
            <p>Sentimos mucho que no puedas estar presente en esta fecha tan importante.</p>
            <p>
              Aún así tendremos <strong>transmisión vía Zoom</strong> para la ceremonia.
              Por favor, déjanos tu número de teléfono para enviarte el link por WhatsApp. ¡Abrazos!
            </p>
            <label>
              Tu número de teléfono:
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                inputMode="numeric"
                pattern="\d*"
                maxLength="15"
                required
              />
            </label>
          </div>
        )}

        <div>
          <label>
            Mensaje para los novios:
            <textarea
              name="mensaje"
              rows="3"
              value={form.mensaje}
              onChange={handleChange}
            />
          </label>
        </div>

        {formError && <p className="input-error">{formError}</p>}

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Enviando...' : 'Enviar confirmación'}
        </button>
      </form>
    </div>
  )
}

export default InvitationForm
