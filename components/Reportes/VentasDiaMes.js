import { useEffect, useState } from 'react'
import { API_URL } from '../Config'
import { notify } from 'react-notify-toast'
import moment from 'moment-timezone'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const VentasDiaMes = ({ adminSucursal, token }) => {
  moment.locale('es')
  const [ventasDia, setVentasDia] = useState([])
  const [ventasMes, setVentasMes] = useState([])
  const [ventasSucursal, setVentasSucursal] = useState([])
  const [zonaHoraria, setZonaHoraria] = useState(false)

  let TotalVentasDelDia = 0
  useEffect(() => {
    if (adminSucursal && token) {
      getVentasDia(adminSucursal, token)
      getVentasMes(adminSucursal, token)
      getVentasSucursal(token)
    }
  }, [adminSucursal, token])
  async function getVentasDia(idSucursal, token) {
    try {
      const datos = await fetch(
        `${API_URL}/detalle/reporte/ventas-dia/${idSucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const ventasDia = await datos.json()
      if (ventasDia.error) notify.show('Error en la peticion dia', 'error')
      else {
        setVentasDia(ventasDia.body)
        let horaRestar = moment().tz('America/La_Paz').format('z')
        setZonaHoraria(parseInt(horaRestar))
      }
    } catch (error) {
      console.log(
        'Error al obtener la informacion de ventas del dia'.error
      )
    }
  }
  async function getVentasMes(idSucursal, token) {
    try {
      const datos = await fetch(
        `${API_URL}/detalle/reporte/ventas-mes/${idSucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const ventasMes = await datos.json()
      if (ventasMes.error) notify.show('Error en la peticion mes', 'error')
      else {
        setVentasMes(ventasMes.body)
      }
    } catch (error) {
      console.log(
        'Error al obtener la informacion de ventas del mes'.error
      )
    }
  }
  async function getVentasSucursal(token) {
    try {
      const datos = await fetch(
        `${API_URL}/detalle/reporte/ventas-sucursales`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const ventasSucursales = await datos.json()
      if (ventasSucursales.error)
        notify.show('Error en la peticion sucursales', 'error')
      else {
        setVentasSucursal(ventasSucursales.body)
      }
    } catch (error) {
      console.log(
        'Error al obtener la informacion de ventas de cada sucursal'.error
      )
    }
  }

  return (
    <>
      <div className="card-title-2">
        <h4>Información de la sucursal que administra</h4>
      </div>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Ventas por dia</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive">
            <table
              className="table ucp-table table-hover"
              id="tablaVentasDia"
            >
              <thead>
                <tr>
                  <th>Horas</th>
                  <th>Ventas totales</th>
                  <th>Total Bs.</th>
                </tr>
              </thead>
              <tbody>
                {ventasDia.length > 0 &&
                  ventasDia.map((hora, index) => {
                    TotalVentasDelDia += hora.total
                    return (
                      <tr key={index}>
                        <td>
                          {moment(hora._id)
                            .subtract({ hours: -zonaHoraria })
                            .hour()}
                        </td>
                        <td>{hora.count}</td>
                        <td>{hora.total.toFixed(2)}</td>
                      </tr>
                    )
                  })}

                {
                  <tr>
                    <td></td>
                    <td>Total:</td>
                    <td>{TotalVentasDelDia.toFixed(2)}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-body-table-footer">
          <ul>
            <li>
              <ReactHTMLTableToExcel
                id="botonExportExcel"
                className="download-btn hover-btn"
                table="tablaVentasDia"
                filename={`Venta del dia ${new Date()}`}
                sheet="pagina 1"
                buttonText="Exportar a Excel"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Ventas por mes</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive">
            <table
              className="table ucp-table table-hover"
              id="tablaVentasMes"
            >
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Mes</th>
                  <th>Ventas Totales</th>
                  <th>Total Bs</th>
                </tr>
              </thead>
              <tbody>
                {ventasMes.length > 0 &&
                  ventasMes.map((mes, index) => (
                    <tr key={index}>
                      <td>{moment(mes._id).year()}</td>
                      <td>{moment(mes._id).format('MMMM')}</td>
                      <td>{mes.count}</td>
                      <td>{mes.total.toFixed(2)} Bs.</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-body-table-footer">
          <ul>
            <li>
              <ReactHTMLTableToExcel
                id="botonExportExcelMes"
                className="download-btn hover-btn"
                table="tablaVentasMes"
                filename={`Venta de cada mes del año ${
                  new Date().getFullYear
                }`}
                sheet="pagina 1"
                buttonText="Exportar a Excel"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Sucursales mas vendidas</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive">
            <table
              className="table ucp-table table-hover"
              id="tablaVentasSucursal"
            >
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ventas totales</th>
                  <th>Total Bs</th>
                </tr>
              </thead>
              <tbody>
                {ventasSucursal.length > 0 &&
                  ventasSucursal.map((sucursal, index) => (
                    <tr key={index}>
                      <td>{sucursal._id}</td>
                      <td>{sucursal.count}</td>
                      <td>{sucursal.total.toFixed(2)} Bs.</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-body-table-footer">
          <ul>
            <li>
              <ReactHTMLTableToExcel
                id="botonExportExcelSucursal"
                className="download-btn hover-btn"
                table="tablaVentasSucursal"
                filename="Ventas totaldes de las sucursales"
                sheet="pagina 1"
                buttonText="Exportar a Excel"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
export default VentasDiaMes
