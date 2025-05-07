import Head from 'next/head'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import Notifications, { notify } from 'react-notify-toast'
import UserContext from '../../components/UserContext'
import { API_URL } from '../../components/Config'
const EgresoNuevo = () => {
  const [token, setToken] = useState(false)
  const { signOut, getAdmSucursal } = useContext(UserContext)
  const [butt, setButt] = useState(false)
  const [image, setImage] = useState(null)
  const [imageUpload, setImageUpload] = useState(null)
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    if (!tokenLocal) {
      signOut()
    }
    setToken(tokenLocal)
  }, [])
  const handlerSubmit = () => {
    event.preventDefault()
    let target = event.target
    setButt(true)
    fetch(`${API_URL}/compras/registrar-egreso`, {
      method: 'POST',
      body: JSON.stringify({
        idSucursal: getAdmSucursal,
        detalleTexto: target[0].value,
        total: target[1].value,
        numeroFacturaCompra: target[2].value,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401) signOut()
        return res.json()
      })
      .then((response) => {
        if (response.error) {
          console.log(response)
          notify.show('Error al registrar el egreso', 'error', 1000)
          setButt(false)
        } else {
          notify.show('El egreso se registro con exito', 'success')
          target[0].value = ''
          target[1].value = ''
          target[2].value = ''
          setButt(false)
        }
      })
      .catch((error) => {
        notify.show('Error en el Servidor (egreso)', 'error')
        setButt(false)
      })
  }
  return (
    <>
      <Head></Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Nueva Egreso</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/categorias">
                    <a>Egresos</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Registrar un egreso
                </li>
              </ol>

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Formulario de registro</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmit}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">
                              Detalle del egreso*
                            </label>
                            <textarea
                              type="textarea"
                              className="form-control"
                              placeholder="Detalle del egreso"
                              required
                            />
                            <div className="card card-editor">
                              <div className="content-editor">
                                <div id="edit"></div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Total Bs.*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Monto del egreso Bs."
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Factura*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Numero de factura"
                            />
                          </div>
                          <button
                            disabled={butt}
                            className="save-btn hover-btn"
                            type="submit"
                          >
                            Registrar Egreso
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default EgresoNuevo
