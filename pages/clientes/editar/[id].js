import TopNavbar from "../../../components/Navbar";
import SideNav from "../../../components/Navbar/SideNav";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import UserContext from "../../../components/UserContext";
import GetImg from "../../../components/GetImg";
import FormData from "form-data";
import Notifications, { notify } from "react-notify-toast";
import { API_URL } from "../../../components/Config";
const editClient = () => {
  const { signOut, getSucursales } = useContext(UserContext);
  const [client, setCliente] = useState(null);
  const [token, setToken] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [isPersonal, setisPersonal] = useState(false);
  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    const user = localStorage.getItem("fribar-user");
    if (!tokenLocal && !user) {
      signOut();
    }
    if (
      JSON.parse(user).role === "GERENTE-ROLE" ||
      JSON.parse(user).role === "ADMIN-ROLE"
    ) {
    } else signOut();
    setToken(tokenLocal);
    if (!client && router && router.query && router.query.id) {
      const { id } = router.query;
      fetch(`${API_URL}/user?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 401) {
            signOut();
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            alert("Error el en servidor");
          } else {
            setCliente(data.body[0][0]);
            setisPersonal(data.body[0][0].personal);
          }
        })
        .catch((error) => alert("Error en el servidor"));
    }
  }, [router]);
  function uploadFile(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageUpload(e.target.files[0]);
  }
  function handlerSubmit() {
    let formData = new FormData();
    event.preventDefault();
    const target = event.target;
    if (imageUpload) {
      formData.append("imagen", imageUpload);
      fetch(`${API_URL}/upload/user/${client._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) signOut();
          return res.json();
        })
        .then((response) => {
          if (response.error) {
            notify.show(response.body, "error", 2000);
          } else {
            fetch(`${API_URL}/user/${client._id}`, {
              method: "PATCH",
              body: JSON.stringify({
                nombre_comp: target[0].value,
                ci: target[1].value,
                email: target[2].value,
                password: target[3].value,
                phone: target[4].value,
                role: target[5].value,
                status: target[6].value === "0" ? true : false,
                puntos: target[7].value,
                personal: target[8].value,
                idSucursal: isPersonal ? target[9].value : "",
                idPersona: client.idPersona._id,
              }),
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
              .then((res) => {
                if (res.status === 401) signOut();
                return res.json();
              })
              .then((response) => {
                if (response.error) {
                  console.log(response);
                  notify.show(response.body, "error", 2000);
                } else {
                  setCliente(response.body);
                  notify.show("Cambios guardados con Exito! ", "success", 2000);
                }
              })
              .catch((e) => {
                notify.show("No se pudo guardar los cambios", "error");
              });
          }
        })
        .catch((error) => {
          notify.show("No se pudo subir las imagenes", "error");
        });
    } else {
      fetch(`${API_URL}/user/${client._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nombre_comp: target[0].value,
          ci: target[1].value ? target[1].value : false,
          email: target[2].value,
          password: target[3].value,
          phone: target[4].value,
          role: target[5].value,
          status: target[6].value === "0" ? true : false,
          puntos: target[7].value,
          personal: target[8].value,
          idSucursal: isPersonal ? target[9].value : null,
          idPersona: client.idPersona._id,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 401) signOut();
          return res.json();
        })
        .then((response) => {
          if (response.error) {
            notify.show(response.body.message, "error", 2000);
            console.log("DSDSD", response);
          } else {
            setCliente(response.body);
            notify.show("Cambios guardados con Exito! ", "success", 2000);
          }
        })
        .catch((e) => {
          notify.show("No se pudo guardar los cambios", "error");
        });
    }
  }
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Clientes</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link legacyBehavior href="/clientes">
                    <a>Clientes</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Editar Cliente</li>
              </ol>
              {client ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Editar Cliente</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerSubmit}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Nombre*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.idPersona.nombre_comp}
                                placeholder="Ingrese su nombre comleto"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">C.I.*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={
                                  client.idPersona.ci ? client.idPersona.ci : ""
                                }
                                placeholder="Ingrese el C.I."
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Usuario*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.email}
                                placeholder="Ingrese su usuario"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Contraseña*</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Ingrese su nombre Contraseña"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Teléfono*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.phone}
                                placeholder="Ingrese su numero Teléfonico"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Rol*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.role}
                                placeholder="Ingrese su cargo"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                className="form-control"
                                defaultValue={client.status ? "0" : "1"}>
                                <option value="0">Activo</option>
                                <option value="1">Inactivo</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Puntos*</label>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={client.idPersona.puntos}
                                placeholder="Puntos del cliente"
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Personal*</label>
                              <select
                                className="form-control"
                                defaultValue={client.personal ? true : false}
                                onChange={(e) => setisPersonal(e.target.value)}>
                                <option value={true}>Si</option>
                                <option value={false}>No</option>
                              </select>
                            </div>
                            {isPersonal ? (
                              <div className="form-group">
                                <label className="form-label">Sucursal*</label>
                                <select
                                  className="form-control"
                                  defaultValue={
                                    client.idSucursal
                                      ? client.idSucursal._id
                                      : "false"
                                  }>
                                  <option value={false}>
                                    Asigne a una sucursal
                                  </option>
                                  {getSucursales.length > 0 ? (
                                    getSucursales.map((sucursal, index) => (
                                      <option value={sucursal._id} key={index}>
                                        {sucursal.nombre}
                                      </option>
                                    ))
                                  ) : (
                                    <option value={false}>
                                      No hay sucursales
                                    </option>
                                  )}
                                </select>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="form-group">
                              <label className="form-label">
                                Image del cliente*
                              </label>
                              <div className="input-group">
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile04"
                                    aria-describedby="inputGroupFileAddon04"
                                    onChange={uploadFile}
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="inputGroupFile04">
                                    Elegir Imagen
                                  </label>
                                </div>
                              </div>
                              <div className="add-customer-img">
                                <img
                                  src={
                                    !image
                                      ? GetImg(
                                          client.img,
                                          `${API_URL}/upload/user`
                                        )
                                      : image
                                  }
                                  alt="Cliente Frifolly"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Direccion*</label>
                              <div className="card card-editor">
                                <div className="content-editor">
                                  <textarea
                                    className="text-control"
                                    defaultValue={
                                      client.direccion.length > 0
                                        ? client.direccion[0].direccion
                                        : "No hay direcciones"
                                    }
                                    placeholder="Direcciones (este campo no es editable.)"
                                    disabled={true}></textarea>
                                </div>
                              </div>
                            </div>
                            <button
                              className="save-btn hover-btn"
                              type="submit">
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default editClient;
