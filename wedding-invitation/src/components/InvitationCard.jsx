// src/components/InvitationCard.jsx
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/invitation-home.scss'
function InvitationCard() {
  const navigate = useNavigate()
  const { familia } = useParams()
  console.log('familia trae: ',familia);
  

const familias = {
  // Familias anteriores...
  Test_Family_A: 'TEST001',
  Test_Family_B: 'TEST002',
  Test_Family_C: 'TEST003',
  Test_Family_D: 'TEST004',
  Fuenmayor_Magdaleno: 'FMAG001',
  Fuenmayor_Ferrer: 'FFER002',
  Russo_Fuenmayor: 'RUSF003',
  Fuenmayor_Rodriguez: 'FROD004',
  Ferrer_Tinoco: 'FTIN005',
  Tía_Mariela: 'TMARE006',
  Gonzalez_Albornoz: 'GOAL007',
  Magdaleno_Tudares: 'MTUD008',
  Magdaleno_Quintero: 'MQUI009',
  Magdaleno_Romero: 'MROM010',
  Magdaleno_Toyo: 'MTOY011',
  Sibada_Colina: 'SICO012',
  Yedra_Sibada: 'YESI013',
  Eyismar_Bazan: 'EYBA014',
  Dairy_Nava: 'DINA015',
  Albornoz_D_Abreu: 'ALDA016',
  Fuenmayor_Aldana: 'FALD017',
  Michelena: 'MICH018',
  Gonzalez_Magdaleno: 'GOMA019',
  Oropeza_Magdaleno: 'ORMA020',
  Fuenmayor_Paredes: 'FUPA021',
  Guerere: 'GUER022',
  Paipilla: 'PAIP023',
  Andrades_Gil: 'ANDR024',
  Alvarez_Duno: 'ALDU025',
  Sanchez_Suarez: 'SASU026',
  Diaz_Gonzalez: 'DAGO027',
  Ragone: 'RAGO028',
  Ragone_Salazar: 'RASA029',
  Ramirez_Gonzalez: 'RAGA030',
  Medina: 'MEDI031',
  Maribel_Miranda: 'MAMI032',
  Chiquito_Magdaleno: 'CHMA033',
  Ramirez_González: 'RAGO034',
  Daniela_Patricia: 'DAPA035',
  Quiñones_Gonzalez: 'QUIG036',
  Rodriguez_Oropeza: 'ROOR037',
  Tamayo_Alvarez: 'TAAL038',
  Marta_Rojas: 'MARO039',
  Alvarez: 'ALVA040',
  Santos_Alvarez: 'SAAL041',
  Dora_Fonseca: 'DOFO042',
  Yaneth_Medina: 'YAME043',
  Alfonso_Medina: 'ALME044',
  Carmen_Rosa: 'CARO045',
  Nohora_Alvarez: 'NOAL046',
  Herlinda_Alvarez: 'HEAL047',
  Luisa_Leon: 'LULE048',
  Duran_Martinez: 'DUMA049',
  Baena_Melo: 'BAME050',
  Beatriz_Baena: 'BEBA051',
  Nubia_Medina: 'NUME052',
  Wilson_Melgarejo: 'WIME053',
  Guillermina_Medina: 'GUME054',
};

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
