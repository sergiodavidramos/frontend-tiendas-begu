import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Notifications, { notify } from "react-notify-toast";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useState, useContext, useEffect } from "react";
import UserContext from "../../components/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_URL } from "../../components/Config";
import moment from "moment";
function EditOffer() {
  const { signOut } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [image, setImage] = useState(null);
  const [oferta, setOferta] = useState(null);
  const [productos, setProductos] = useState(null);
  const [token, setToken] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [hastaAgotarStock, setHastaAgotarStock] = useState(true);
  const optionsProductos = [];
  const defaultValue = [];
  const router = useRouter();

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
    if (!oferta && router && router.query && router.query.id) {
      const { id } = router.query;
      Promise.all([
        fetch(`${API_URL}/offers/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_URL}/productos/all`),
      ])
        .then((data) => {
          if (data.error) {
            alert("Error el en servidor");
          } else {
            data[0].json().then((data) => {
              setOferta(data.body);
              setHastaAgotarStock(data.body.agotarStock);
            });
            data[1].json().then((data) => setProductos(data.body));
          }
        })
        .catch((error) => {
          console.log("EL ERROROROROR", error);
          alert("Error en el servidor");
        });
    }
  }, [router]);
  if (productos && oferta) {
    productos.map((data) => {
      if (data.descuento === 0)
        optionsProductos.push({ value: data._id, label: data.name });
    });
    oferta.productos.map((data) =>
      defaultValue.push({ value: data._id, label: data.name })
    );
  }
  const handlerSubmit = () => {
    event.preventDefault();
    let target = event.target;
    let formData = new FormData();
    const product = [];
    selectedOption
      ? selectedOption.map((d) => product.push(d.value))
      : defaultValue.map((d) => product.push(d.value));
    if (!image) {
      formData.append("imagen", imageUpload);
      const data = {
        titulo: target[0].value,
        descuento: target[1].value,
        productos: product,
        status: target[3].value === "0" ? true : false,
        description: target[4].value,
        agotarStock: target[5].value === "true" ? true : false,
      };
      if (target[6].value === "false") data.fecha = target[7].value;
      fetch(`${API_URL}/offers/${oferta._id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
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
            notify.show("Error al editar la Oferta", "error", 1000);
          } else {
            try {
              let nuevosProductosParaOferta = [];
              if (response.body.productos.length > oferta.productos.length) {
                // if()
                for (const aux of response.body.productos) {
                  const proAct = await fetch(
                    `${API_URL}/productos/agregar-oferta-producto/${aux}`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        descuento: response.body.descuento,
                      }),
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  nuevosProductosParaOferta.push({ _id: aux });
                }

                oferta.productos = nuevosProductosParaOferta;
              } else {
                if (response.body.productos.length < oferta.productos.length) {
                  for (let i = 0; i < oferta.productos.length; i++) {
                    const ban = response.body.productos.includes(
                      oferta.productos[i]._id
                    );
                    if (ban === false) {
                      const proAct = await fetch(
                        `${API_URL}/productos/agregar-oferta-producto/${oferta.productos[i]._id}?agregar=false`,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    } else
                      nuevosProductosParaOferta.push({
                        _id: oferta.productos[i]._id,
                      });
                  }
                  oferta.productos = nuevosProductosParaOferta;
                } else {
                  let auxFueCambiado = true;
                  for (var i = 0; i < oferta.productos.length; i++) {
                    for (var j = 0; j < response.body.productos.length; j++) {
                      if (
                        oferta.productos[i]._id == response.body.productos[j]
                      ) {
                        auxFueCambiado = false;
                      }
                    }
                    if (auxFueCambiado) {
                      const proAct = await fetch(
                        `${API_URL}/productos/agregar-oferta-producto/${oferta.productos[i]._id}?agregar=false`,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    }
                  }
                  for (const aux of response.body.productos) {
                    const proAct = await fetch(
                      `${API_URL}/productos/agregar-oferta-producto/${aux}`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({
                          descuento: response.body.descuento,
                        }),
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    nuevosProductosParaOferta.push({ _id: aux });
                  }
                  oferta.productos = nuevosProductosParaOferta;
                }
              }
              if (response.body.status !== oferta.status) {
                if (response.body.status) {
                  for (const aux of response.body.productos) {
                    const proAct = await fetch(
                      `${API_URL}/productos/agregar-oferta-producto/${aux}`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({
                          descuento: response.body.descuento,
                        }),
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                  }
                  oferta.status = response.body.status;
                } else {
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
                  oferta.status = response.body.status;
                }
              }
              if (response.body.descuento !== oferta.descuento) {
                for (const aux of response.body.productos) {
                  const proAct = await fetch(
                    `${API_URL}/productos/agregar-oferta-producto/${aux}`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        descuento: response.body.descuento,
                      }),
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                }
                oferta.descuento = response.body.descuento;
              }
            } catch (error) {
              console.log(error);
              notify.show(
                "Error al editar los productos de la oferta",
                "error",
                1000
              );
            }
            notify.show("Oferta modificado con Exito! ", "success", 1500);
          }
        })
        .catch((error) => {
          notify.show("Error en el Servidor", "error");
        });
    } else {
      formData.append("imagen", imageUpload);
      fetch(`${API_URL}/upload/oferta/${oferta._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            notify.show(response.body, "error", 2000);
          } else {
            const data = {
              titulo: target[0].value,
              descuento: target[1].value,
              productos: product,
              status: target[3].value === "0" ? true : false,
              description: target[4].value,
              agotarStock: target[5].value === "true" ? true : false,
            };
            if (target[6].value === "false") data.fecha = target[7].value;
            fetch(`${API_URL}/offers/${oferta._id}`, {
              method: "PATCH",
              body: JSON.stringify(data),
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
                  notify.show("Error al editar la oferta", "error", 1000);
                } else
                  notify.show("Oferta modificado con Exito! ", "success", 1500);
              })
              .catch((error) => {
                notify.show("Error en el Servidor", "error");
              });
          }
        })
        .catch((error) => {
          console.log(error);
          notify.show("No se pudo subir la imagen", "error");
        });
    }
  };
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  function uploadFile(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageUpload(e.target.files[0]);
  }
  function handleChangeAgotarStock() {
    setHastaAgotarStock(event.target.value === "true" ? true : false);
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
              <h2 className="mt-30 page-title">Ofertas</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/ofertas">
                    <a>Ofertas</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Agregar Ofertas</li>
              </ol>
              {oferta ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Agregar nueva Oferta</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerSubmit}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Título*</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Título de la oferta"
                                defaultValue={oferta.titulo}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Descuento*</label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="0%"
                                defaultValue={oferta.descuento}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Agregar Productos*
                              </label>
                              <Select
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                placeholder={"Seleccione los productos"}
                                options={optionsProductos}
                                isMulti
                                className={{
                                  zIndex: "10000000 !important",
                                }}
                                onChange={handleChange}
                                value={
                                  selectedOption ? selectedOption : defaultValue
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                id="status"
                                name="status"
                                className="form-control"
                                defaultValue={oferta.status ? "0" : "1"}>
                                <option value="0">Activo</option>
                                <option value="1">Inactivo</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Descripcion*</label>
                              <div className="card card-editor">
                                <div className="content-editor">
                                  <textarea
                                    className="text-control"
                                    placeholder="Ingrese la Descripcion"
                                    defaultValue={
                                      oferta.description
                                    }></textarea>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                ¿Hasta agotar Stock?*
                              </label>
                              <select
                                id="statusStock"
                                name="status"
                                className="form-control"
                                defaultValue={oferta.agotarStock}
                                onChange={handleChangeAgotarStock}>
                                <option value={true}>Si</option>
                                <option value={false}>No</option>
                              </select>
                            </div>
                            {!hastaAgotarStock && (
                              <div className="form-group">
                                <label className="form-label">
                                  Fecha fin de la oferta*
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  defaultValue={moment(oferta.fecha)
                                    .add(1, "days")
                                    .format("YYYY-MM-DD")}
                                  required
                                />
                              </div>
                            )}
                            <button
                              className="save-btn hover-btn"
                              type="submit">
                              Guardar Oferta
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
}
export default EditOffer;
