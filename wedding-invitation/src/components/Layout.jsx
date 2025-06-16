// src/components/Layout.jsx
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import "../styles/Loader.scss"

function Layout({ children, showLoader = false }) {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timeout)
  }, [location.pathname])

  return (
    <div className="layout-container">
      {children}
      {(loading || showLoader) && (
        <div className="loader-overlay">
          <div className="hearts">
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
          </div>
          <p>Cargando...</p>
        </div>
      )}
    </div>
  )
}



export default Layout
