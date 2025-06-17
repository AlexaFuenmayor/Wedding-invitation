import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/InvitationForm.scss'
import Layout from '../components/Layout.jsx'
import InvalidCode from '../pages/InvalidCode.jsx'

function InvitationForm() {
  const API_URL = import.meta.env.VITE_API_URL
  const [guest, setGuest] = useState(null)
  const [code, setCode] = useState(null)
  const [status, setStatus] = useState({ loading: true, error: null })
  const [formError, setFormError] = useState(null)
  const [form, setForm] = useState({
    asistira: '',
    asistentesConfirmados: 0,
    mensaje: '',
    telefono: ''
  })

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const searchCode = new URLSearchParams(location.search).get('code')
    if (searchCode) setCode(searchCode)
  }, [location.search])

  useEffect(() => {
    if (!code) return

    fetch(`${API_URL}/api/guests/codigo/${code}`)
      .then(async res => {
        const text = await res.text()
        let data

        try {
          data = JSON.parse(text)
        } catch {
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
    setStatus({ loading: true, error: null })

    const cuerpo = {
      asistira: form.asistira === 'si',
      asistentesConfirmados: form.asistira === 'si' ? Number(form.asistentesConfirmados) : 0,
      mensaje: form.mensaje,
      telefono: telefonoLimpio
    }

    try {
      const res = await fetch(`${API_URL}/api/guests/codigo/${code}/confirmar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo)
      })

      const text = await res.text()
      let data = {}

      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(text || 'Error en la respuesta del servidor')
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
    } catch (err) {
      setStatus({ loading: false, error: err.message })
    }
  }

  if (status.loading || !guest) return <Layout showLoader={true} />
  if (status.error) return <InvalidCode mensaje={status.error} />

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
            <p>Te extrañaremos. ❤️</p>
            <p>Déjanos tu número para enviarte el link por WhatsApp.</p>
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
              maxLength="300"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="¡Escribe Aquí!"
            />
          </label>
        </div>

        {formError && <p className="input-error">{formError}</p>}

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}

export default InvitationForm
