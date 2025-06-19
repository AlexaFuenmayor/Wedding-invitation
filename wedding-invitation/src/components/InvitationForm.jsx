import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/InvitationForm.scss'
import Layout from '../components/Layout.jsx'
import InvalidCode from '../pages/InvalidCode.jsx'

function InvitationForm() {
  const API_URL = import.meta.env.VITE_API_URL
  const location = useLocation()
  const navigate = useNavigate()

  const [guest, setGuest] = useState(null)
  const [code, setCode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [form, setForm] = useState({
    asistira: '',
    asistentesConfirmados: 0,
    mensaje: '',
    telefono: ''
  })

  // Obtener el código de la URL
  useEffect(() => {
    const searchCode = new URLSearchParams(location.search).get('code')
    if (!searchCode) {
      navigate('/invalid-code', { replace: true })
    } else {
      setCode(searchCode)
    }
  }, [location.search])

  // Cargar datos del invitado por código
  useEffect(() => {
    if (!code) return

    const fetchGuest = async () => {
      try {
        const res = await fetch(`${API_URL}/api/guests/codigo/${code}`)
        const text = await res.text()

        if (!res.ok) throw new Error(text || 'Código inválido')
        const data = JSON.parse(text)

        if (!data || typeof data !== 'object') throw new Error('Invitado no encontrado')

        if (data.estadoConfirmacion && data.estadoConfirmacion !== 'PENDIENTE') {
          navigate('/already-confirmed', {
            state: {
              confirmacion: data.estadoConfirmacion,
              familia: data.familia || 'Invitado',
              telefono: data.telefono,
              asistentesConfirmados: data.asistentesConfirmados
            }
          })
        } else {
          setGuest(data)
        }
      } catch (err) {
        console.error('Error al cargar invitado:', err)
        setError(err.message || 'No se pudo cargar la invitación.')
      } finally {
        setLoading(false)
      }
    }

    fetchGuest()
  }, [code])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const telefonoLimpio = form.telefono.replace(/\D/g, '')

    if (!form.asistira) {
      setFormError('Selecciona si asistirás.')
      return false
    }

    if (form.asistira === 'si' && Number(form.asistentesConfirmados) < 1) {
      setFormError('Debe haber al menos 1 asistente.')
      return false
    }

    if (form.asistira === 'no' && telefonoLimpio.length < 10) {
      setFormError('Teléfono inválido. Mínimo 10 dígitos.')
      return false
    }

    setFormError(null)
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    const telefonoLimpio = form.telefono.replace(/\D/g, '')
    setLoading(true)

    const payload = {
      asistira: form.asistira === 'si',
      asistentesConfirmados: form.asistira === 'si' ? Number(form.asistentesConfirmados) : 0,
      mensaje: form.mensaje,
      telefono: telefonoLimpio
    }

    try {
      const res = await fetch(`${API_URL}/api/guests/codigo/${code}/confirmar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const text = await res.text()
      const data = JSON.parse(text)

      if (!res.ok) {
        if (data.estadoConfirmacion && data.estadoConfirmacion !== 'PENDIENTE') {
          navigate('/already-confirmed', {
            state: {
              confirmacion: data.estadoConfirmacion,
              familia: data.familia || 'Invitado',
              telefono: data.telefono || payload.telefono,
              asistentesConfirmados: data.asistentesConfirmados
            }
          })
        } else {
          throw new Error(data.message || 'Error al confirmar asistencia.')
        }
        return
      }

      navigate('/confirmacion', {
        state: {
          confirmacion: payload.asistira,
          familia: data.familia || 'Invitado',
          telefono: data.telefono || payload.telefono,
          asistentesConfirmados: data.asistentesConfirmados
        }
      })
    } catch (err) {
      console.error('Error al enviar confirmación:', err)
      setError(err.message || 'No se pudo enviar la confirmación.')
      setLoading(false)
    }
  }

  // CARGANDO / ERROR / FORMULARIO
  if (loading) return <Layout showLoader={true} />
  if (error || !guest) return <InvalidCode mensaje={error || 'Invitado no válido'} />

  return (
    <div className="invitation-container">
      <section style={{ marginBottom: '20px' }}>
        <h1>Familia {guest.familia} <br /> ¡Están invitados a nuestra boda!</h1>
        <p>Nos encantaría contar con su presencia</p>
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
              <option value="">Selecciona</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        {form.asistira === 'si' && (
          <div>
            <label>
              ¿Cuántos asistirán?
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
              Aun así tendremos <strong>transmisión</strong> para la ceremonia.
              Déjanos tu número para enviarte el link por WhatsApp.
            </p>
            <label>
              Tu teléfono:
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
              maxLength="1000"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="¡Escribe Aquí!"
            />
          </label>
        </div>

        {formError && <p className="input-error">{formError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}

export default InvitationForm
