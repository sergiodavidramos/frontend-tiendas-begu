import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { notify } from 'react-notify-toast'
import UserContext from '../components/UserContext'
import { API_URL } from '../components/Config'
export default () => {
  const { token, setGenerarQR, generarQR } = useContext(UserContext)

  const [volverGenerarPago, setVolverGenerarPago] = useState(false)
  const [infoPago, setInfoPago] = useState(false)
  const [estadoBoton, setEstadoBoton] = useState(false)

  const url = 'https://web.sintesis.com.bo/iframe-simple-pagosnet/#/payQr'

  const router = useRouter()
  const { datos, success } = router.query
  useEffect(() => {
    console.log('--->DATOS ', datos, success)
    if (success === 'true' && datos) {
      notify.show('Se realizo el pago correctamente', 'success')
    } else {
      setVolverGenerarPago(true)
    }
  }, [success, datos])

  const generarQr = async () => {
    const pago = await fetch(`${API_URL}/pedido/pago-electronico/qr`, {
      method: 'POST',
      body: JSON.stringify({
        total: parseFloat(datos),
        generarQR: generarQR,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const resPago = await pago.json()
    if (resPago.error) {
      console.log('ERROR--->', resPago)
      notify.show(
        'Error al generar QR por favor seleccione otro metodo de pago'
      )
    } else {
      if (resPago.body.codigoError === 0) {
        setInfoPago(resPago.body.idTransaccion)
        setVolverGenerarPago(false)
      } else {
        if (resPago.body.descripcionError === 'Recaudacion duplicada') {
          setInfoPago(false)
          setVolverGenerarPago(true)
        }
      }
    }
  }
  function handlerGenerarQr() {
    setEstadoBoton(true)
    setGenerarQR()
    generarQr()
    setEstadoBoton(false)
  }
  return (
    <>
      {volverGenerarPago && infoPago === false ? (
        <div className="container">
          <div className="row justify-content-center">
            <h4
              style={{
                color: 'red',
                marginTop: '15px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              No se pudo realizar el pago.
            </h4>
            <button
              type="button"
              title="Volver a codigo QR"
              className="save-btn hover-btn"
              onClick={() => handlerGenerarQr()}
              disabled={estadoBoton}
            >
              Generar nuevo codigo QR
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src={`${url}?entidad=360&ref=${infoPago}&red=https://admin.fribar.bo/redireccionar?datos=${datos}`}
          scrolling="auto"
          width="100%"
          height="500px"
          border="0"
        ></iframe>
      )}
    </>
  )
}
