import Head from "next/head";
import TopNavbar from "../../../components/Navbar";
import SideNav from "../../../components/Navbar/SideNav";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Notifications, { notify } from "react-notify-toast";
import FormData from "form-data";
import UserContext from "../../../components/UserContext";
import { API_URL } from "../../../components/Config";
import { useRouter } from "next/router";
const ProductoNuevo = () => {
  const [token, setToken] = useState(false);
  const { signOut } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [categorias, setCategorias] = useState(false);
  const [pro, setPro] = useState(false);

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
      if (router && router.query && router.query.id) {
        obtenerDatosProductoCategoria(router.query.id);
      }
    } else signOut();
    setToken(tokenLocal);
  }, [router]);
  if (categorias.error === true) {
    categorias.body = [];
  }
  const [butt, setButt] = useState(false);
  const [im, setIm] = useState(false);
  var fileObj = [];
  var fileArray = [];
  const handlerSubmit = () => {
    let target = event.target;
    event.preventDefault();
    let formData = new FormData();
    if (target[1].value === "0") {
      notify.show("Por favor seleccione una Categoria", "warning", 2000);
    } else {
      if (images.length < 0) {
        notify.show(
          "Por favor seleccione al menos una imagen",
          "warning",
          2000
        );
      } else {
        setButt(true);
        fetch(`${API_URL}/productos/${pro._id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: target[0].value,
            code: target[1].value,
            status: target[2].value === "1" ? true : false,
            category: target[3].value,
            stock: target[4].value,
            precioCompra: target[5].value,
            precioVenta: target[6].value,
            detail: target[7].value,
            tipoVenta: target[8].value,
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
              notify.show(response.body, "error", 2000);
              setButt(false);
            } else {
              if (im) {
                if (im.length < 4) {
                  for (const file of im) formData.append("imagen", file);
                } else
                  for (let i = 0; i < 4; i++) {
                    formData.append("imagen", im[i]);
                  }
                fetch(`${API_URL}/upload/producto/${response.body._id}`, {
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
                      setButt(false);
                    } else {
                      notify.show(
                        "Producto agregado con Exito! ",
                        "success",
                        2000
                      );
                      setButt(false);
                    }
                  })
                  .catch((error) => {
                    notify.show("No se pudo subir las imagenes", "error");
                    setButt(false);
                  });
              } else {
                notify.show("Producto agregado con Exito! ", "success", 2000);
                setButt(false);
              }
            }
          })
          .catch((error) => {
            notify.show("Error en el Servidor", "error");
            setButt(false);
          });
      }
    }
  };
  const uploadMultipleFile = (e) => {
    fileObj.push(e.target.files);
    setIm(e.target.files);
    if (fileObj[0].length <= 4) {
      for (let i = 0; i < fileObj[0].length; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]));
      }
      setImages(fileArray);
    } else {
      notify.show("Solo puede seleccionar 4 imagenes", "warning", 2000);
      for (let i = 0; i < 4; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]));
      }
      setImages(fileArray);
    }
  };
  const obtenerDatosProductoCategoria = async (id) => {
    try {
      const res = await fetch(`${API_URL}/categoria?status=true`);
      const categorias = await res.json();
      const pro = await fetch(`${API_URL}/productos?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await pro.json();
      setPro(data.body[0][0]);
      setCategorias(categorias);
      setImages(data.body[0][0].img);
    } catch (err) {
      notify.show(
        "Error en el Servidor al obtener los productos y categorias",
        "error"
      );
      console.log("ERROR ", err);
    }
  };
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />

            <div className="container-fluid">
              <h2 className="mt-30 page-title">Producto</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/productos">Productos</Link>
                </li>
                <li className="breadcrumb-item active">Agregar producto</li>
              </ol>

              {categorias && pro ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Editar Producto</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerSubmit}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Nombre*</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre del Producto"
                                defaultValue={pro.name}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Codigo*</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Código del Producto"
                                defaultValue={pro.code}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                className="form-control"
                                defaultValue={pro.status ? "1" : "2"}>
                                <option value="0">
                                  --Seleccionar Estado del Producto--
                                </option>
                                <option value="1">Activo</option>
                                <option value="2">Inactivo</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Categoria*</label>
                              <select
                                id="categtory"
                                name="categtory"
                                className="form-control"
                                defaultValue={pro.category._id}>
                                <option value={0}>
                                  --Seleccionar Categoria--
                                </option>
                                {categorias.body.map((cate) => (
                                  <option value={cate._id} key={cate._id}>
                                    {cate.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Stock*</label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Cantidad disponible"
                                required
                                defaultValue={pro.stock}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Precio Compra*
                              </label>
                              <input
                                step="any"
                                type="number"
                                className="form-control"
                                placeholder="Bs 0"
                                defaultValue={pro.precioCompra}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Precio Venta*
                              </label>
                              <input
                                step="any"
                                type="number"
                                className="form-control"
                                placeholder="Bs 0"
                                defaultValue={pro.precioVenta}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Descripción*</label>
                              <textarea
                                type="textarea"
                                className="form-control"
                                defaultValue={pro.detail}
                                required
                              />
                              <div className="card card-editor">
                                <div className="content-editor">
                                  <div id="edit"></div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Tipo Venta*</label>
                              <select
                                id="venta"
                                name="venta"
                                className="form-control"
                                defaultValue={pro.tipoVenta}>
                                <option value={"Kilos"}>Por Kilos</option>
                                <option value={"Unidad"}>Por Unidad</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Images*</label>
                              <div className="input-group">
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile05"
                                    aria-describedby="inputGroupFileAddon05"
                                    multiple
                                    onChange={uploadMultipleFile}
                                    accept="image/x-png,image/gif,image/jpeg"
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="inputGroupFile05">
                                    Seleccione Images
                                  </label>
                                </div>
                              </div>
                              <ul className="add-produc-imgs">
                                {images.map((url) => (
                                  <li key={url}>
                                    <div
                                      className="add-cate-img-1"
                                      htmlFor="inputGroupFile05">
                                      <img
                                        src={
                                          im
                                            ? url
                                            : `${API_URL}/upload/producto/${url}`
                                        }
                                        alt="Seleecione una imagen de producto frifolly"
                                      />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              disabled={butt}
                              className="save-btn hover-btn"
                              type="submit">
                              Editar Producto
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
export default ProductoNuevo;
