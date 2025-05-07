import axios from "axios";
import { useRef, useState } from "react";
import { notify } from "react-notify-toast";
import { API_URL } from "../Config";
export default function BuscarProducto({
  token,
  arrayHandlerProduct,
  setProductFilter,
  productFilter,
  setTotal,
}) {
  const [autocompleteState, setAutocompleteState] = useState({
    collections: [],
    isOpen: false,
  });
  const inputRef = useRef(null);

  async function handlerSearch() {
    if (event.target.value && token && event.target.value.length > 0) {
      const u = await axios.get(
        `${API_URL}/productos/buscar/${event.target.value}`,
        {
          headers: { Authorization: "Bearer " + token },
          "content-type": "application/json",
        }
      );
      if (u.status == 200) {
        if (u.data.body.length > 0) {
          setAutocompleteState({
            collections: u.data.body,
            isOpen: true,
          });
        } else
          setAutocompleteState({
            collections: u.data.body,
            isOpen: false,
          });
      } else {
        notify.show("Error el obtener los datos del usuario", "error", 4000);
      }
    } else {
      setAutocompleteState({
        collections: [],
        isOpen: false,
      });
    }
  }
  function handlerClick(producto) {
    inputRef.current.value = "";
    setAutocompleteState({ isOpen: false });
    if (productFilter.length > 0) {
      let pro = { producto };
      arrayHandlerProduct(pro);
    } else {
      let pro = { producto };
      pro.producto.cantidad = 1;
      setProductFilter([pro.producto]);
      notify.show(`Producto Agregado`, "success", 900);
      const precioConDescuento =
        pro.producto.precioVenta -
        (pro.producto.descuento * pro.producto.precioVenta) / 100;
      setTotal(
        pro.producto.descuento > 0
          ? (
              pro.producto.cantidad *
              expectedRound.round10(precioConDescuento, -1)
            ).toFixed(2)
          : pro.producto.cantidad * pro.producto.precioVenta
      );
    }
  }
  return (
    <>
      <div className="autocomplete" style={{ width: "100%" }}>
        <input
          ref={inputRef}
          id="myInput"
          type="text"
          name="myAdmin"
          placeholder="Buscar Producto por Nombre"
          onChange={handlerSearch}
          autoComplete="off"
        />
        {autocompleteState.isOpen && (
          <div id="myInputautocomplete-list" className="autocomplete-items">
            {autocompleteState.collections.map((datos, index) => (
              <ul key={index} className="list-group">
                <li
                  className="list-group-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlerClick(datos)}>
                  <a>
                    <strong>{datos.name}</strong>
                  </a>
                </li>
              </ul>
            ))}
          </div>
        )}
      </div>

      <style jsx>
        {`
          * {
            box-sizing: border-box;
          }
          body {
            font: 16px Arial;
          }
          .autocomplete {
            /*the container must be positioned relative:*/
            position: relative;
            display: inline-block;
          }
          input {
            border: 1px solid transparent;
            background-color: #f1f1f1;
            padding: 10px;
            font-size: 16px;
          }
          input[type="text"] {
            background-color: #f1f1f1;
            width: 100%;
          }
          input[type="submit"] {
            background-color: DodgerBlue;
            color: #fff;
          }
          .autocomplete-items {
            position: absolute;
            border: 1px solid #d4d4d4;
            border-bottom: none;
            border-top: none;
            z-index: 99;
            /*position the autocomplete items to be the same width as the container:*/
            top: 100%;
            left: 0;
            right: 0;
            background-color: #fff;
          }
          .autocomplete-items div {
            padding: 10px;
            cursor: pointer;
            background-color: #fff;
            border-bottom: 1px solid #d4d4d4;
          }
          .autocomplete-items div:hover {
            /*when hovering an item:*/
            background-color: #e9e9e9;
          }
          .autocomplete-active {
            /*when navigating through the items using the arrow keys:*/
            background-color: DodgerBlue !important;
            color: #ffffff;
          }

          .list-group-item:hover {
            background-color: #e9e9e9 !important;
          }
        `}
      </style>
    </>
  );
}
