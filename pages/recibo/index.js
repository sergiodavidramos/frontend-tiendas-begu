import { useRouter } from 'next/router'
import { useEffect, useContext } from 'react'
import UserContext from '../../components/UserContext'

export default function Recibo() {
  const router = useRouter()
  const { venta } = useContext(UserContext)
  useEffect(() => {
    const venta = localStorage.getItem('venta')
    console.log('venta de localStorage', JSON.parse(venta))
    if (venta) {
      console.log('La Venta', venta)
      //   console.log(JSON.stringify(router.query.venta))
    } else console.log('No hay venta')
  }, [venta, router])

  console.log('La Venta', venta)
  return (
    <>
      <div className="ticket">
        <img
          src="https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
          alt="Logotipo"
        />
        <p className="centrado header" style={{ margin: '0px' }}>
          <strong className="title">*** FriBar ***</strong> <br />
          C.: Calero N 148
          <br />
          Cel: 74231490
          <br />
          Potosí-Bolivia
          <br />
          TICKET DE VENTA
        </p>
        <div className="info">
          <p className="centrado" style={{ margin: '0 0 5px 0' }}>
            VENTA AL POR MAYOR Y MENOR DE PRODUCTOS CARNICOS DE PRIMERA
            CALIDAD.
          </p>
          <b>FECHA : </b> 29/26/21 23:20:30 <br />
          <b>NIT/CI : </b> <br />
          <b>SEÑOR (ES) : </b>
          <br />
        </div>
        <table className="centrado">
          <thead>
            <tr>
              <th className="cantidad">Cantidad</th>
              <th className="producto">Producto</th>
              <th className="precio">Pre-Uni</th>
              <th className="sub-total">Sub Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cantidad">148 K</td>
              <td className="producto">Yogurelo escolar</td>
              <td className="precio">Bs 2580</td>
              <td className="sub-total">Bs 2580</td>
            </tr>
            <tr>
              <td className="cantidad">5 U</td>
              <td className="producto">Mantequilla margarina</td>
              <td className="precio">Bs 2580</td>
              <td className="sub-total">Bs 258055</td>
            </tr>
            <tr>
              <td className="cantidad"></td>
              <td className="producto"></td>
              <td className="precio">TOTAL: </td>
              <td className="sub-total">Bs 25802</td>
            </tr>
          </tbody>
        </table>
        <p style={{ margin: '0 5px 0 10px', fontSize: '11px' }}>
          <b>Son: </b> SETENTA Y OCHO MILLONES NOVECIENTOS CINCUENTA Y
          CINCO MIL DOCIENTOS CINCUENTA Y UN
        </p>

        <p className="centrado">¡GRACIAS POR SU COMPRA!</p>
        <div className="info">
          <b>UD: </b> Fue atendido por: <br />
          <b>HORA: </b> 17:10:1 <br />
          <b>CÓDIGO DE CONTROL: </b> asdasdasdasdasds
          <br />
        </div>
      </div>
      <style jsx>
        {`
          body {
            margin: 0;
            padding: 0;
          }
          * {
            font-size: 12px;
            font-family: 'Times New Roman';
          }
          .ticket {
            width: 302px;
            max-width: 302px;
          }
          td,
          th,
          tr,
          table {
            border-top: solid black;
            border-collapse: collapse;
          }
          table {
            margin: 5px;
          }
          td.producto,
          th.producto {
            overflow-wrap: break-word;
            width: 120px;
            max-width: 120px;
          }
          td.cantidad,
          th.cantidad {
            width: 60px;
            max-width: 60px;
            word-break: break-all;
          }

          td.precio,
          th.precio {
            width: 80px;
            max-width: 80px;
            word-break: break-all;
          }
          td.sub-total,
          th.sub-total {
            width: 60px;
            max-width: 60px;
            word-break: break-all;
          }
          .centrado {
            text-align: center;
            align-content: center;
          }

          img {
            max-width: inherit;
            width: inherit;
          }

          .info {
            padding: 10px 5px 0px 5px;
            border-top: solid black;
            /* border-top-style: dashed; */
            margin: 5px;
          }
          strong,
          b {
            font-weight: bold;
          }
          .header {
            font-size: 15px;
          }
          .title {
            font-size: 20px;
          }
        `}
      </style>
    </>
  )
}
