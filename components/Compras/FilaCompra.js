import { useState, useRef, useEffect } from 'react'
import expectedRound from 'expected-round'
import moment from 'moment'
const FilaVenta = ({
  pro,
  setCantidad,
  index,
  deleteProduct,
  setfocus,
  actualizarPrecioCompra,
  actualizarPrecioVenta,
  actualizarTieneLote,
  actualizarNumeroLote,
  actualizarFechaVencimiento,
}) => {
  const [cantidad, setCa] = useState(pro.cantidad)
  const [precioCompra, setPrecioCompra] = useState(pro.precioCompra)
  const [precioVenta, setPrecioVenta] = useState(pro.precioVenta)
  const [tieneLote, setTieneLote] = useState(false)

  const textCantidad = useRef(null)

  useEffect(() => {
    textCantidad.current.focus()
  }, [])
  const handlerCantidad = (event) => {
    setCa(event.target.value)
    setCantidad(index, event.target.value)
  }
  const handlerDeleteProduct = () => {
    deleteProduct(index)
  }
  function obtenerTeclado(event) {
    var codigo = event.key
    if (codigo === 'Tab') {
      setfocus(true)
    }
  }
  const handlerPrecioCompra = (event) => {
    setPrecioCompra(event.target.value)
    actualizarPrecioCompra(index, event.target.value)
  }
  const handlerPrecioVenta = (event) => {
    setPrecioVenta(event.target.value)
    actualizarPrecioVenta(index, event.target.value)
  }
  const handlerTieneLote = (event) => {
    setTieneLote(event.target.value === 'true' ? true : false)
    actualizarTieneLote(
      index,
      event.target.value === 'true' ? true : false
    )
  }
  const handlerNumeroFactura = (event) => {
    actualizarNumeroLote(index, event.target.value)
  }
  const handlerFechaVencimiento = (event) => {
    actualizarFechaVencimiento(index, event.target.value)
  }

  return (
    <tr>
      <td>
        <input
          ref={textCantidad}
          type="number"
          style={{ width: '100px' }}
          className="check-item"
          defaultValue={cantidad}
          min="1"
          onInput={handlerCantidad}
          onKeyDown={obtenerTeclado}
        />
      </td>
      <td>{pro.name}</td>
      <td>
        <input
          type="number"
          className="check-item"
          style={{ width: '100px' }}
          defaultValue={precioCompra}
          min="1"
          onInput={handlerPrecioCompra}
        />
      </td>
      <td>
        {(
          pro.cantidad * expectedRound.round10(pro.precioCompra, -1)
        ).toFixed(2)}
      </td>
      <td>
        {' '}
        <input
          style={{ width: '100px' }}
          type="number"
          className="check-item"
          defaultValue={precioVenta}
          min="1"
          onInput={handlerPrecioVenta}
        />
      </td>
      <td>
        <select
          className="form-control"
          defaultValue={tieneLote}
          onChange={handlerTieneLote}
        >
          <option value={true}>Si</option>
          <option value={false}>No</option>
        </select>
      </td>
      <td>
        {' '}
        <input
          style={{ width: '100px' }}
          type="text"
          className="check-item"
          disabled={!tieneLote}
          onInput={handlerNumeroFactura}
        />
      </td>
      <td>
        <input
          type="date"
          className="form-control"
          defaultValue={moment().format('YYYY-MM-DD')}
          disabled={!tieneLote}
          onInput={handlerFechaVencimiento}
        />
      </td>
      <td className="action-btns">
        <a className="edit-btn" title="Editar">
          <i className="fas fa-trash" onClick={handlerDeleteProduct}></i>
        </a>
      </td>
    </tr>
  )
}

export default FilaVenta
