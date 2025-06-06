import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useGuest() {
  const [guestData, setGuestData] = useState(null)
  const [status, setStatus] = useState({ loading: true, error: null })
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')

    if (!code) {
      setStatus({ loading: false, error: 'No se proporcionó código' })
      return
    }

    fetch(`http://localhost:8080/api/guests/${code}`)
      .then(res => {
        if (!res.ok) throw new Error('Código inválido o no encontrado')
        return res.json()
      })
      .then(data => {
        setGuestData(data)
        setStatus({ loading: false, error: null })
      })
      .catch(err => {
        setStatus({ loading: false, error: err.message })
      })
  }, [location])

  return { guestData, status }
}
