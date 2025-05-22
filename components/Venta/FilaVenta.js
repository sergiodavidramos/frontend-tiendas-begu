"use client";
import { useState, useRef, useEffect } from "react";
import expectedRound from "expected-round";
const FilaVenta = ({
  pro,
  setCantidad,
  index,
  deleteProduct,
  textBusqueda,
  efectivo,
  ciCliente,
  botonConfirmarVenta,
  //   inputCantidad,
}) => {
  const [cantidad, setCa] = useState(pro.cantidad);
  const inputCantidad = useRef(null);

  const precioConDescuento =
    pro.precioVenta - (pro.descuento * pro.precioVenta) / 100;
  useEffect(() => {
    setCa(pro.cantidad);
  }, [pro.cantidad]);
  const handlerCantidad = (event) => {
    setCa(event.target.value);
    setCantidad(index, event.target.value);
  };
  const handlerDeleteProduct = () => {
    deleteProduct(index);
  };
  const handlerValorKilo = (event, descuento) => {
    if (event.target.value) {
      if (descuento > 0) {
        let cant = parseFloat(event.target.value) / precioConDescuento;
        inputCantidad.current.value = cant.toFixed(2);
        setCa(cant);
        setCantidad(index, cant);
      } else {
        let cant = parseFloat(event.target.value) / pro.precioVenta;
        inputCantidad.current.value = cant.toFixed(2);
        setCa(cant);
        setCantidad(index, cant);
      }
    }
  };
  function escucharTeclado(event) {
    var codigo = event.key;
    if (codigo === "F9") {
      textBusqueda.current.focus();
    }
    if (codigo === "F10") {
      efectivo.current.focus();
    }
    if (codigo === "F11") {
      ciCliente.current.focus();
    }
    if (codigo === "Enter") {
      botonConfirmarVenta.current.click();
    }
  }
  return (
    <tr>
      <td>
        <input
          ref={inputCantidad}
          type="number"
          className="check-item"
          min={pro.tipoVenta === "Unidad" ? "1" : "0.25"}
          step={pro.tipoVenta === "Unidad" ? "1" : "0.25"}
          onInput={handlerCantidad}
          onKeyDown={escucharTeclado}
          value={cantidad}
        />
      </td>
      {pro.tipoVenta === "Kilos" ? (
        <td>
          <input
            defaultValue="0"
            style={{ width: "50px" }}
            type="number"
            className="check-item"
            onChange={() => handlerValorKilo(event, pro.descuento)}
            onKeyDown={escucharTeclado}
          />
        </td>
      ) : (
        <td>
          <input
            defaultValue="0"
            style={{ width: "50px" }}
            type="number"
            disabled={true}
            className="check-item"
            onKeyDown={escucharTeclado}
          />
        </td>
      )}
      <td>{pro.code}</td>
      <td>{pro.name}</td>
      <td>{pro.precioVenta}</td>
      <td>{(pro.cantidad * pro.precioVenta).toFixed(2)}</td>
      <td>
        {`${pro.descuento} % ${
          pro.descuento > 0
            ? "Precio con escuento:(" +
              expectedRound.round10(precioConDescuento, -1).toFixed(2) +
              ")"
            : ""
        }`}
      </td>
      <td>
        {expectedRound
          .round10(pro.cantidad * precioConDescuento, -1)
          .toFixed(2)}
      </td>
      <td className="action-btns">
        <a className="edit-btn" title="Editar">
          <i className="fas fa-trash" onClick={handlerDeleteProduct}></i>
        </a>
      </td>
    </tr>
  );
};

export default FilaVenta;
