import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Footer from '../components/Footer'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect, useContext, useRef } from 'react'
import UserContext from '../components/UserContext'
import VentasDiaMes from '../components/Reportes/VentasDiaMes'
import { API_URL } from '../components/Config'
import ProductosMasVendidos from '../components/Reportes/ProductosMasVendidos'
import IngresosSucursal from '../components/Reportes/Ingresos'
import EgresosSucursal from '../components/Reportes/Egresos'
import PocoStock from '../components/Reportes/PocoStock'
import ProductosVencimiento from '../components/Reportes/ProductosVencimiento'
import ReporteInventario from '../components/Reportes/ReporteInventario'
import TrasladoProductos from '../components/Reportes/TrasladoProductos'
const Reportes = () => {
  const { getAdmSucursal, token, user } = useContext(UserContext)
  const [reporteSeleccionado, setReporteSeleccionado] = useState('0')
  const [sucursales, setSucursales] = useState([])
  const [sucursalSeleccionado, setSucursalSeleccionado] = useState(false)
  const [datosReporte, setDatosReporte] = useState([])

  const fechaInicio = useRef()
  const fechaFin = useRef()
  const cantidadProductos = useRef()
  const cantidadDias = useRef()

  const handlerReporteSelecionado = () => {
    if (event.target.value) {
      setReporteSeleccionado(event.target.value)
    }
  }
  useEffect(() => {
    setSucursalSeleccionado(getAdmSucursal)
    if (user && user.role === 'GERENTE-ROLE') {
      getSurcursalesServer(token)
    }
  }, [user, getAdmSucursal])
  async function getSurcursalesServer(token) {
    try {
      const sucursalesServer = await fetch(`${API_URL}/sucursal/all`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      const det = await sucursalesServer.json()
      if (det.error) alert('Error al obtener las sucursales')
      else {
        setSucursales(det.body)
      }
    } catch (error) {
      alert(error.message)
    }
  }
  function handlerSeleccionarSucursal() {
    if (event.target.value === '0') {
      setSucursalSeleccionado(getAdmSucursal)
    }
    if (event.target.value && event.target.value != '0') {
      setSucursalSeleccionado(event.target.value)
    }
  }
  function generarReporte() {
    if (
      reporteSeleccionado === '4' ||
      reporteSeleccionado === '5' ||
      reporteSeleccionado === '6' ||
      fechaInicio.current.value === '' ||
      fechaFin.current.value === ''
    ) {
      switch (reporteSeleccionado) {
        case '4':
          reportePocoStockProductos(
            sucursalSeleccionado,
            token,
            cantidadProductos.current.value
          )
          break
        case '5':
          reporteProductosVencimiento(
            sucursalSeleccionado,
            token,
            cantidadDias.current.value
          )
          break
        case '6':
          reporteInventario(sucursalSeleccionado, token)
          break
        default: {
          notify.show('El rango de fechas es necesario', 'warning')
        }
      }
    } else {
      switch (reporteSeleccionado) {
        case '1':
          reporteProductoMasVendido(
            sucursalSeleccionado,
            token,
            fechaInicio.current.value,
            fechaFin.current.value
          )
          break
        case '2':
          reporteIngresosSucursal(
            sucursalSeleccionado,
            token,
            fechaInicio.current.value,
            fechaFin.current.value
          )
          break
        case '3':
          reporteEgresosSucursal(
            sucursalSeleccionado,
            token,
            fechaInicio.current.value,
            fechaFin.current.value
          )
          break
        case '7':
          reporteMovimientoProductos(
            sucursalSeleccionado,
            token,
            fechaInicio.current.value,
            fechaFin.current.value
          )
          break
      }
    }
  }

  async function reporteProductoMasVendido(
    idSucursal,
    token,
    fechaInicio,
    fechaFin
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/detalle/reporte/productos-mas-vendidos/${idSucursal}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const produtosMasVendidos = await datos.json()
      if (produtosMasVendidos.error)
        notify.show('Error en la peticion de productos', 'error')
      else {
        setDatosReporte(produtosMasVendidos.body)
      }
    } catch (error) {
      notify.show('Error al obtener los datos de productos mas vendidos')
      console.log(error)
    }
  }
  async function reporteIngresosSucursal(
    idSucursal,
    token,
    fechaInicio,
    fechaFin
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/detalle/reporte/ingresos/${idSucursal}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const ingresosSucursal = await datos.json()
      if (ingresosSucursal.error)
        notify.show('Error en la peticion de ingresos', 'error')
      else {
        setDatosReporte(ingresosSucursal.body)
      }
    } catch (error) {
      notify.show('Error en el servidor al obtener los datos de ingresos')
      console.log(error)
    }
  }
  async function reporteEgresosSucursal(
    idSucursal,
    token,
    fechaInicio,
    fechaFin
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/compras/reporte/egresos/${idSucursal}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const egresosSucursal = await datos.json()
      if (egresosSucursal.error)
        notify.show('Error en la peticion de Egresos', 'error')
      else {
        setDatosReporte(egresosSucursal.body)
      }
    } catch (error) {
      notify.show('Error en el servidor al obtener los datos de Egresos')
      console.log(error)
    }
  }
  async function reportePocoStockProductos(
    idSucursal,
    token,
    cantidad = 5
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/inventario/reporte/productos-poco-stock/${idSucursal}?cantidad=${cantidad}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const productosPocaCantidad = await datos.json()
      if (productosPocaCantidad.error)
        notify.show(
          'Error en la peticion de Poco stock de Productos',
          'error'
        )
      else {
        setDatosReporte(productosPocaCantidad.body)
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
      console.log(error)
    }
  }
  async function reporteProductosVencimiento(
    idSucursal,
    token,
    dias = 15
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/inventario/reporte/productos/caducidad/${idSucursal}?dias=${dias}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const productosCaducidad = await datos.json()
      if (productosCaducidad.error)
        notify.show(
          'Error en la peticion de Poco stock de Productos',
          'error'
        )
      else {
        setDatosReporte(productosCaducidad.body)
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
      console.log(error)
    }
  }
  async function reporteInventario(idSucursal, token) {
    try {
      const datos = await fetch(
        `${API_URL}/inventario/reporte/inventario/${idSucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const inventario = await datos.json()
      if (inventario.error)
        notify.show(
          'Error en la peticion de Poco stock de Productos',
          'error'
        )
      else {
        setDatosReporte(inventario.body)
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
      console.log(error)
    }
  }
  async function reporteMovimientoProductos(
    idSucursal,
    token,
    fechaInicio,
    fechaFin
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/movimiento-productos/reporte/movimiento/${idSucursal}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const traslados = await datos.json()
      if (traslados.error)
        notify.show(
          'Error en la peticion de Poco stock de Productos',
          'error'
        )
      else {
        setDatosReporte(traslados.body)
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
      console.log(error)
    }
  }
  async function generarCopiaSegurirdad(token, restaurar) {
    try {
      if (restaurar === false) {
        const datos = await fetch(`${API_URL}/backup`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        const traslados = await datos.blob()
        if (traslados.error)
          notify.show(
            'Error en la peticion de Poco stock de Productos',
            'error'
          )
        else {
          const fecha = new Date()
          var url = window.URL.createObjectURL(traslados)
          var a = document.createElement('a')
          a.href = url
          a.download = `Backup/${
            fecha.getDate() +
            '-' +
            (fecha.getMonth() + 1) +
            '-' +
            fecha.getFullYear()
          }.tar`
          document.body.appendChild(a)
          a.click()
          a.remove()
        }
      } else {
        const datos = await fetch(
          `${API_URL}/backup?restaurar=${restaurar}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (datos.status === 200) {
          notify.show('Base de datos restaurada con exito', 'success')
        }
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
      console.log(error)
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
              <h2 className="mt-30 page-title">Generador de reportes</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href={'/'}>
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Reportes</li>
              </ol>
              <div className="row">
                <div className="col-lg-4 col-md-5">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Generar nuevo reporte</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="news-content-right pd-20">
                        <div className="form-group">
                          <label className="form-label">Reportes*</label>
                          <select
                            id="categeory"
                            name="categeory"
                            className="form-control"
                            defaultValue={reporteSeleccionado}
                            onChange={handlerReporteSelecionado}
                          >
                            <option value="0">
                              --Seleccione un tipo de reporte--
                            </option>
                            <option value="1">
                              Reporte para obtener los productos mas
                              vendidos
                            </option>
                            <option value="2">
                              Reporte para obtener todos los Ingresos
                            </option>
                            <option value="3">
                              Reporte para obtener todos los Egresos
                            </option>
                            <option value="4">
                              Reporte para obtener los Productos con poca
                              cantidad es Stock
                            </option>
                            <option value="5">
                              Reporte para obtener los Productos Proximos a
                              vencer
                            </option>
                            <option value="6">
                              Reporte para obtener el Inventario
                            </option>
                            <option value="7">
                              Reporte de traslado de Productos
                            </option>
                            <option value="8">
                              Generar una copia de seguridad de la Base de
                              datos
                            </option>
                          </select>
                        </div>
                        {user && user.role === 'GERENTE-ROLE' ? (
                          <div className="form-group">
                            <label className="form-label">
                              Seleccionar Sucursal*
                            </label>
                            <select
                              id="categeory"
                              name="categeory"
                              className="form-control"
                              defaultValue={'0'}
                              onChange={handlerSeleccionarSucursal}
                            >
                              <option value="0">--sucursales--</option>
                              {sucursales.map((sucursal, index) => (
                                <option key={index} value={sucursal._id}>
                                  {sucursal.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          ''
                        )}
                        {(reporteSeleccionado === '1' ||
                          reporteSeleccionado === '2' ||
                          reporteSeleccionado === '3' ||
                          reporteSeleccionado === '7') && (
                          <>
                            <div className="form-group">
                              <label className="form-label">
                                Inicio de fecha*
                              </label>
                              <input
                                type="date"
                                className="form-control datepicker-here"
                                data-language="es"
                                placeholder="Fecha inicio"
                                ref={fechaInicio}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Fin de fecha*
                              </label>
                              <input
                                type="date"
                                className="form-control datepicker-here"
                                data-language="es"
                                placeholder="Fecha limite"
                                ref={fechaFin}
                              />
                            </div>
                          </>
                        )}
                        {reporteSeleccionado === '4' && (
                          <div className="form-group">
                            <label className="form-label">
                              Productos con Stock Menor que:*
                            </label>
                            <input
                              type="Number"
                              className="form-control datepicker-here"
                              data-language="es"
                              placeholder="Cantidad productos"
                              ref={cantidadProductos}
                              defaultValue={5}
                            />
                          </div>
                        )}
                        {reporteSeleccionado === '5' && (
                          <div className="form-group">
                            <label className="form-label">
                              Productos con fecha de vencimiento menor
                              que:*
                            </label>
                            <input
                              type="Number"
                              className="form-control datepicker-here"
                              data-language="es"
                              placeholder="Cantidad dias"
                              ref={cantidadDias}
                              defaultValue={15}
                            />
                          </div>
                        )}
                        <button
                          className="save-btn hover-btn"
                          type="submit"
                          onClick={generarReporte}
                        >
                          Filtro de busqueda
                        </button>
                      </div>
                    </div>
                    <button
                      className="save-btn hover-btn"
                      type="submit"
                      onClick={() => generarCopiaSegurirdad(token, false)}
                    >
                      Generar Copia de seguridad de la Base de Datos
                    </button>
                    <button
                      className="save-btn hover-btn"
                      type="submit"
                      onClick={() => generarCopiaSegurirdad(token, true)}
                    >
                      Restaurar base de datos
                    </button>
                  </div>
                </div>
                <div className="col-lg-8 col-md-7">
                  <div className="all-cate-tags">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        {reporteSeleccionado === '0' && (
                          <VentasDiaMes
                            adminSucursal={getAdmSucursal}
                            token={token}
                          />
                        )}
                        {reporteSeleccionado === '1' && (
                          <ProductosMasVendidos productos={datosReporte} />
                        )}
                        {reporteSeleccionado === '2' && (
                          <IngresosSucursal ingresos={datosReporte} />
                        )}
                        {reporteSeleccionado === '3' && (
                          <EgresosSucursal egresos={datosReporte} />
                        )}
                        {reporteSeleccionado === '4' && (
                          <PocoStock productos={datosReporte} />
                        )}
                        {reporteSeleccionado === '5' && (
                          <ProductosVencimiento productos={datosReporte} />
                        )}
                        {reporteSeleccionado === '6' && (
                          <ReporteInventario productos={datosReporte} />
                        )}
                        {reporteSeleccionado === '7' && (
                          <TrasladoProductos traslados={datosReporte} />
                        )}
                      </div>
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

export default Reportes
