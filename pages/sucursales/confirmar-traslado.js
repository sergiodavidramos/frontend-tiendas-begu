import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Link from 'next/link'
import { useEffect, useContext, useState, useRef } from 'react'
import UserContext from '../../components/UserContext'
import Notifications, { notify } from 'react-notify-toast'
import Footer from '../../components/Footer'
import { API_URL } from '../../components/Config'
import moment from 'moment'

const ConfirmarTraslado = () => {
  moment.locale('es')
  const { signOut } = useContext(UserContext)
  const [movimientos, setMovimientos] = useState(false)
  const [trasladoSeleccionado, setTrasladoSeleccionado] = useState(false)
  const [token, setToken] = useState(null)
  const [boton, setBoton] = useState(false)

  const sucursalOrigen = useRef()
  const fechaTraslado = useRef()
  const user = useRef()
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const idSucursal = localStorage.getItem('fribar-sucursal')
    if (!tokenLocal || !idSucursal) {
      signOut()
    } else {
      setToken(tokenLocal)
      fetch(`${API_URL}/movimiento-productos/pendientes/${idSucursal}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) {
            signOut()
          }
          return res.json()
        })
        .then((data) => {
          if (data.error) {
            notify.show(
              'Error en el servidor (Movimientos)',
              'error',
              2000
            )
          } else {
            setMovimientos(data.body)
            console.log(data.body)
          }
        })
        .catch((error) => {
          notify.show(error.message, 'error', 2000)
        })
    }
  }, [])
  const handlerMovimientos = () => {
    if (event.target.value !== 'false') {
      setTrasladoSeleccionado(parseInt(event.target.value))
      sucursalOrigen.current.value =
        movimientos[event.target.value].sucursalOrigen.nombre
      fechaTraslado.current.value = moment(
        movimientos[event.target.value].fechaEnvio
      ).format('LL')
      user.current.value =
        movimientos[event.target.value].enviaUsuario.idPersona.nombre_comp
    } else {
      sucursalOrigen.current.value = ''
      fechaTraslado.current.value = ''
      user.current.value = ''
      setTrasladoSeleccionado(false)
    }
  }
  const handlerSubmit = () => {
    if (Number.isFinite(trasladoSeleccionado)) {
      setBoton(true)
      fetch(
        `${API_URL}/movimiento-productos/confirmar-movimiento/${movimientos[trasladoSeleccionado]._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            estadoRecibido: true,
            productos: movimientos[trasladoSeleccionado].movimiento,
            sucursalDestino:
              movimientos[trasladoSeleccionado].sucursalDestino,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => {
          if (res.status === 401) {
            signOut()
          }
          return res.json()
        })
        .then((data) => {
          if (data.error) {
            console.log(data)
            notify.show(
              'Error en el servidor (Movimientos)',
              'error',
              2000
            )
            setBoton(false)
          } else {
            notify.show('Traslado recibido con exito', 'success')
            setMovimientos(false)
            setTrasladoSeleccionado(false)
            sucursalOrigen.current.value = ''
            fechaTraslado.current.value = ''
            user.current.value = ''
            setBoton(false)
          }
        })
        .catch((error) => {
          console.log('--->', error)
          notify.show(error.message, 'error', 2000)
          setBoton(false)
        })
    } else {
      notify.show('Seleccione un traslado', 'warning')
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
              <h2 className="mt-30 page-title">Confirmar traslado</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <a href="index.html">Tablero</a>
                </li>
                <li className="breadcrumb-item active">Traslados</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      Número de traslado
                    </label>
                    <select
                      id="categtory"
                      name="categtory"
                      className="form-control"
                      defaultValue={false}
                      onChange={handlerMovimientos}
                    >
                      <option value={false}>
                        --Seleccionar un traslado pediente--
                      </option>
                      {movimientos.length > 0 &&
                        movimientos.map((mov, index) => (
                          <option value={index} key={index}>
                            {mov._id}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sucursal origen</label>
                    <input
                      ref={sucursalOrigen}
                      className="form-control"
                      placeholder="Sucursal Origen"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de traslado</label>
                    <input
                      ref={fechaTraslado}
                      className="form-control"
                      placeholder="Fecha"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Autorizado por</label>
                    <input
                      ref={user}
                      className="form-control"
                      placeholder="Usuario"
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Productos del traslado</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Lote</th>
                              <th>Cantidad</th>
                              <th>Total Precio</th>
                            </tr>
                          </thead>
                          {Number.isFinite(trasladoSeleccionado) &&
                          movimientos !== false ? (
                            <tbody>
                              {movimientos[
                                trasladoSeleccionado
                              ].movimiento.map((pro, index) => (
                                <tr key={index}>
                                  <td>{pro.productos.name}</td>
                                  <td>{pro.numeroLote}</td>
                                  <td>{pro.cantidad}</td>
                                  <td>
                                    {pro.cantidad *
                                      pro.productos.precioCompra}
                                  </td>

                                  {/* <td>
                                    <span
                                      className={`badge-item ${
                                        sucursal.state
                                          ? 'badge-status'
                                          : 'badge-status-false'
                                      }`}
                                    >
                                      {sucursal.state
                                        ? 'Activo'
                                        : 'Inactivo'}
                                    </span>
                                  </td> */}
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <tbody></tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      disabled={boton}
                      className="save-btn hover-btn"
                      type="submit"
                      onClick={handlerSubmit}
                    >
                      Agregar Nuevo Producto
                    </button>
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
export default ConfirmarTraslado
