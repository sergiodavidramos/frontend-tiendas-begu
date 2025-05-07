import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import TablaListaVentas from '../../components/Venta/TablaListaVentas'
import { useContext, useRef, useState } from 'react'
import UserContext from '../../components/UserContext'
import { API_URL } from '../../components/Config'
import moment from 'moment'
const Ventas = () => {
  moment.locale('es')
  const { getAdmSucursal, signOut, token } = useContext(UserContext)
  const [ventas, setVentas] = useState([])
  const inputId = useRef(null)
  const inputFechaInicio = useRef(null)
  const inputFechaFin = useRef(null)
  async function buscarPedidoPorId() {
    if (inputId.current.value === '')
      notify.show('Por favor introduzca la ID del pedido', 'warning')
    else {
      try {
        const res = await fetch(
          `${API_URL}/venta/${inputId.current.value}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (res.status === 401) signOut()
        const resVenta = await res.json()
        if (resVenta.error) {
          notify.show('Error al obtener la Venta', 'error')
        } else {
          setVentas([resVenta.body])
        }
      } catch (error) {
        console.log(error)
        notify.show('Error en el servidor al obtener el pedido', 'error')
      }
    }
  }

  async function handlerFiltrarFecha() {
    if (
      inputFechaFin.current.value === '' &&
      inputFechaInicio.current.value === ''
    )
      notify.show('Por favor seleccione un rango de fecha', 'warning')
    else {
      const res = await fetch(
        `${API_URL}/venta?fechaInicio=${moment(
          inputFechaInicio.current.value
        ).format('YYYY/MM/DD')}&fechaFin=${moment(
          inputFechaFin.current.value
        ).format('YYYY/MM/DD')}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (res.status === 401) signOut()
      const resVentas = await res.json()
      if (resVentas.error) {
        console.log('Error>>>>', resVentas)
        notify.show('Error al mostrar los pedidos', 'error')
      } else {
        setVentas(resVentas.body)
      }
    }
  }
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Ventas</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Ventas anteriores
                </li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-5 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por ID"
                        ref={inputId}
                      />
                    </div>
                    <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={buscarPedidoPorId}
                      >
                        Buscar por Id
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-4">
                  <div className="bulk-section mb-25">
                    <div className="form-group mr-auto">
                      <label className="form-label">Fecha Inicio</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Fecha incio"
                        defaultValue={moment().format('DD/MM/YYYY')}
                        ref={inputFechaInicio}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fecha Fin</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Fecha fin"
                        defaultValue={moment().format('DD/MM/YYYY')}
                        ref={inputFechaFin}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="bulk-section mb-30 justify-content-center">
                    <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={handlerFiltrarFecha}
                      >
                        Filtrar por fecha
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las ventas</h4>
                    </div>
                    {getAdmSucursal === 'false' ||
                    getAdmSucursal === '0' ||
                    getAdmSucursal === false ? (
                      <h4>Por favor selecione una sucursal</h4>
                    ) : (
                      <TablaListaVentas ventas={ventas} />
                    )}
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
export default Ventas
