import FilaInventario from './FilaInventario'
import ReactPaginate from 'react-paginate'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect } from 'react'
import { API_URL } from '../Config'
import ModelLotes from '../sucursal/modelLotes'
const CardTable = ({
  proFilter,
  idSucursal,
  token,
  setLotesProducto,
  setAgregarProducto,
  agregarProducto,
}) => {
  const [product, setProduct] = useState(false)
  const [pageState, setPageState] = useState(0)
  const [count, setCount] = useState(0)

  async function paginationHandler(page) {
    setPageState(page.selected + 1)
  }
  useEffect(() => {
    if (!proFilter) {
      fetch(
        `${API_URL}/inventario/productos/${idSucursal}?pagina=${pageState}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show('Error el en servidor', 'error')
            console.log(data)
          } else {
            setProduct(data.body[0])
            setCount(data.body[1][0].totalProductos)
          }
        })
        .catch((error) => console.log('errorrr', error))
    } else {
      setProduct(proFilter)
      setCount(0)
    }
  }, [proFilter, pageState])

  return (
    <>
      <div className="card-body-table">
        <Notifications options={{ zIndex: 9999, top: '56px' }} />
        <div className="table-responsive">
          <table className="table ucp-table table-hover">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Código</th>
                <th style={{ width: '100px' }}>Imagen</th>
                <th>Nombre</th>
                <th>Fecha de vencimiento</th>
                <th>Estado</th>
                <th>Stock</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {!product ? (
                <tr>
                  <td>...</td>
                </tr>
              ) : (
                product.map((pro, index) => (
                  <FilaInventario
                    key={index}
                    pro={pro}
                    setLotesProducto={setLotesProducto}
                    setAgregarProducto={setAgregarProducto}
                    agregarProducto={agregarProducto}
                  />
                ))
              )}
            </tbody>
          </table>
          <div className="pages">
            <ReactPaginate
              previousLabel={'Anterior'}
              nextLabel={'Siguiente'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              activeClassName={'active-page'}
              containerClassName={'pagination'}
              initialPage={0}
              pageCount={count / 10}
              marginPagesDisplayed={3}
              pageRangeDisplayed={5}
              onPageChange={paginationHandler}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CardTable
