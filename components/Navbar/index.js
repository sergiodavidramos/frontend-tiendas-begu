import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import Link from "next/link";
import { API_URL } from "../Config";
import moment from "moment";
var sucursalElegido = "";
const TopNavbar = () => {
  const {
    signOut,
    setSitNav,
    sid,
    setAdmSucursal,
    getAdmSucursal,
    user,
    setSucursales,
    getSucursales,
    token,
    getOfertas,
  } = useContext(UserContext);
  const [nobreSucursal, setNombreSucursal] = useState(false);

  function handlerSid() {
    sid ? setSitNav(false) : setSitNav(true);
  }
  function handlerSetSucursal() {
    if (event.target.value) {
      setAdmSucursal(event.target.value);
    }
  }
  async function getSurcursalesServer(token) {
    let sucursalEncontrado = false;
    try {
      const sucursalesServer = await fetch(`${API_URL}/sucursal/all`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const det = await sucursalesServer.json();
      if (det.error) alert("Error al obtener las sucursales");
      else {
        setSucursales(det.body);
        if (sucursalElegido !== "0") {
          sucursalEncontrado = det.body.find(
            (sucursal) => sucursal._id === sucursalElegido
          );
          if (sucursalEncontrado) setNombreSucursal(sucursalEncontrado.nombre);
        }
      }
    } catch (error) {
      console.log(error);
      //   alert(error.message)
    }
  }

  useEffect(() => {
    if (token && user.role === "GERENTE-ROLE") {
      sucursalElegido = localStorage.getItem("fribar-sucursal");
      getSurcursalesServer(token);
    } else {
      if (user) setAdmSucursal(user.idSucursal);
    }
    // HACER LA ACTUALIZAFION DE LAS OFERTAS CADUCADA
    if (getOfertas.length > 0) {
      for (let ofer of getOfertas) {
        if (ofer.fecha) {
          if (moment(ofer.fecha).add(1, "days").format() <= moment().format()) {
            if (ofer.status === true)
              fetch(`${API_URL}/offers/${ofer._id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: false }),
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  if (res.status === 401) signOut();
                  return res.json();
                })
                .then(async (response) => {
                  if (response.error) {
                    console.log(response);
                    notify.show(
                      "Error al editar la Oferta caducada",
                      "error",
                      1000
                    );
                  } else {
                    try {
                      for (const aux of response.body.productos) {
                        const proAct = await fetch(
                          `${API_URL}/productos/agregar-oferta-producto/${aux}?agregar=false`,
                          {
                            method: "PATCH",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                      }
                    } catch (error) {
                      console.log(error);
                      notify.show(
                        "Error al editar los productos de la oferta",
                        "error",
                        1000
                      );
                    }
                  }
                });
          }
        }
      }
    }
  }, [token, getOfertas]);
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-light bg-clr">
      {user ? (
        user.role === "GERENTE-ROLE" ? (
          <div className="col-lg-3">
            {getSucursales && getSucursales.length > 0 ? (
              <select
                id="sucursal"
                name="sucursal"
                className="form-control"
                onChange={handlerSetSucursal}
                defaultValue={getAdmSucursal}>
                <option value={0}>
                  {nobreSucursal ? nobreSucursal : "Todas las sucursales"}
                </option>
                {getSucursales.map((suc) => (
                  <option value={suc._id} key={suc._id}>
                    {suc.nombre} - {suc.direccion.direccion}
                  </option>
                ))}
              </select>
            ) : (
              <select
                id="sucursal"
                name="sucursal"
                className="form-control"
                onChange={handlerSetSucursal}
                defaultValue={getAdmSucursal}>
                <option value={false}>Todas las sucursales</option>
              </select>
            )}
          </div>
        ) : (
          <Link legacyBehavior href={"/"}>
            <a className="navbar-brand logo-brand">Begú Minimarket</a>
          </Link>
        )
      ) : (
        ""
      )}

      <button
        className="btn btn-link btn-sm order-1 order-lg-0"
        id="sidebarToggle"
        onClick={handlerSid}>
        <i className="fas fa-bars"></i>
      </button>
      <Link legacyBehavior href="/">
        <a className="frnt-link">
          <i className="fas fa-external-link-alt"></i>Inicio
        </a>
      </Link>
      <ul className="navbar-nav ml-auto mr-md-0">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="userDropdown"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            <i className="fas fa-user fa-fw"></i>
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="userDropdown">
            <Link legacyBehavior href="/perfil">
              <a className="dropdown-item admin-dropdown-item">Editar Perfil</a>
            </Link>
            <a
              className="dropdown-item admin-dropdown-item"
              onClick={() => signOut()}>
              Cerrar sesión
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};
export default TopNavbar;
