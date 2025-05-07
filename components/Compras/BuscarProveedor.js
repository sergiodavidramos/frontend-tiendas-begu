import axios from "axios";
import { useRef, useState } from "react";
import { notify } from "react-notify-toast";
import { API_URL } from "../Config";
export default function BuscarProveedor({ token, setIdProveedor, inputRef }) {
  const [autocompleteState, setAutocompleteState] = useState({
    collections: [],
    isOpen: false,
  });

  async function handlerSearch() {
    if (event.target.value && token) {
      const u = await axios.get(
        `${API_URL}/proveedor/buscar/termino?termino=${event.target.value}`,
        {
          headers: { Authorization: "Bearer " + token },
          "content-type": "application/json",
        }
      );
      if (u.status == 200) {
        if (u.data.body.length > 0)
          setAutocompleteState({
            collections: u.data.body,
            isOpen: true,
          });
        else
          setAutocompleteState({
            collections: u.data.body,
            isOpen: false,
          });
      } else {
        notify.show("Error el obtener los datos del usuario", "error", 4000);
      }
    }
  }
  function handlerClick(dat, idUsuario) {
    inputRef.current.value = dat;
    setAutocompleteState({ isOpen: false });
    setIdProveedor(idUsuario);
  }
  return (
    <>
      <div className="autocomplete" style={{ width: "300px" }}>
        <input
          ref={inputRef}
          id="myInput"
          type="text"
          name="myAdmin"
          placeholder="Ingrese El Nombre comercial"
          onChange={handlerSearch}
          autoComplete="off"
        />
        {autocompleteState.isOpen && (
          <div id="myInputautocomplete-list" className="autocomplete-items">
            {autocompleteState.collections.map((datos, index) => (
              <ul key={index}>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handlerClick(
                        `${datos.nombreComercial} - Cel: ${datos.phone}`,
                        datos._id
                      )
                    }>
                    <strong>
                      {datos.nombreComercial} - Cel: {datos.phone}{" "}
                    </strong>
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
        `}
      </style>
    </>
  );
}
