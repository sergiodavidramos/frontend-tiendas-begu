import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Notifications, { notify } from 'react-notify-toast'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { PostUrl } from '../../components/PostUrl'
import { useState, useContext, useEffect } from 'react'
import UserContext from '../../components/UserContext'
import Link from 'next/link'
import moment from 'moment'
import { API_URL } from '../../components/Config'
const OfertaNueva = ({ productos }) => {
  const { signOut, token, getAdmSucursal } = useContext(UserContext)
  const [selectedOption, setSelectedOption] = useState([])
  const [image, setImage] = useState(null)
  const [imageUpload, setImageUpload] = useState(null)
  const [hastaAgotarStock, setHastaAgotarStock] = useState(true)
  const [sucursal, setSucursal] = useState(false)
  let options = []
  productos.error
    ? ''
    : productos.body.map((data) => {
        if (data.descuento === 0)
          options.push({ value: data._id, label: data.name })
      })
  const handlerSubmit = async () => {
    let target = event.target

    event.preventDefault()
    let formData = new FormData()
    if (selectedOption.length <= 0) {
      notify.show('Por favor seleccione un Producto', 'warning', 2000)
    } else {
      if (image.length < 0) {
        notify.show(
          'Por favor seleccione al menos una imagen',
          'warning',
          2000
        )
      } else {
        const product = []
        selectedOption.map((d) => product.push(d.value))
        const data = {
          idSucursal: getAdmSucursal,
          titulo: target[0].value,
          descuento: target[1].value,
          producto: product,
          status: target[3].value === 'true' ? true : false,
          description: target[5].value,
          agotarStock: target[6].value === 'true' ? true : false,
        }
        if (target[6].value === 'false') data.fecha = target[7].value
        const newOffer = await fetch(`${API_URL}/offers`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const res = await newOffer.json()
        if (res.status === 401) signOut()
        if (res.error) {
          console.log('ERERE', res)
          notify.show('Error en el servidor', 'error', 2000)
        } else {
          formData.append('imagen', imageUpload)
          fetch(`${API_URL}/upload/oferta/${res.body._id}`, {
            method: 'PUT',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.error) {
                notify.show(response.body, 'error', 2000)
              } else {
                target[0].value = ''
                target[1].value = ''
                setSelectedOption([])
                target[3].value = true
                setImage(null)
                target[5].value = ''
                target[6].value = true
                target[7].value = ''
                notify.show('Oferta agregado con Exito! ', 'success', 2000)
              }
              for (let i = 0; i < product.length; i++) {
                const result = options.filter(
                  (pro) => pro._id != product[i]
                )
                options = result
              }
            })
            .catch((error) => {
              console.log(error)
              notify.show('No se pudo subir las imagenes', 'error')
            })
        }
      }
    }
  }
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
  }
  function uploadFile(e) {
    setImage(URL.createObjectURL(e.target.files[0]))
    setImageUpload(e.target.files[0])
  }
  function handleChangeAgotarStock() {
    setHastaAgotarStock(event.target.value === 'true' ? true : false)
  }

  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    if (
      JSON.parse(user).role === 'GERENTE-ROLE' ||
      JSON.parse(user).role === 'ADMIN-ROLE'
    ) {
    } else signOut()
    if (getAdmSucursal && token)
      fetch(`${API_URL}/sucursal/${getAdmSucursal}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => {
          if (data.status === 401) signOut()
          return data.json()
        })
        .then((sucur) => {
          setSucursal(sucur.body)
        })
        .catch((error) => {
          console.log('erorrrr', error)
          notify.show('Error al obtener los datos de la Sucursal', 'error')
        })
  }, [token])
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">
                Ofertas de la sucursal {sucursal.nombre}
              </h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ofertas">
                    <a>Ofertas</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Agregar Ofertas en la sucursal{' '}
                  <strong>{sucursal.nombre}</strong>
                </li>
              </ol>
              {getAdmSucursal ? (
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
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Descuento en %*
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="0%"
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
                                placeholder={'Seleccione los productos'}
                                options={options}
                                isMulti
                                className={{ zIndex: '3' }}
                                onChange={handleChange}
                                value={selectedOption}
                                instanceId="select-box"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                id="status"
                                name="status"
                                className="form-control"
                                defaultValue={true}
                              >
                                <option value={true}>Activo</option>
                                <option value={false}>Inactivo</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Imagen de la Oferta*
                              </label>
                              <div className="input-group">
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile04"
                                    aria-describedby="inputGroupFileAddon04"
                                    onChange={uploadFile}
                                    required
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="inputGroupFile04"
                                  >
                                    Elegir Imagen
                                  </label>
                                </div>
                              </div>
                              <div className="offer-img mt-3">
                                {image ? (
                                  <img src={image} alt="Oferta" />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Descripcion*
                              </label>
                              <div className="card card-editor">
                                <div className="content-editor">
                                  <textarea
                                    className="text-control"
                                    placeholder="Ingrese la Descripcion"
                                    required
                                  ></textarea>
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
                                defaultValue={true}
                                onChange={handleChangeAgotarStock}
                              >
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
                                  placeholder="Bs 0"
                                  defaultValue={moment().format(
                                    'YYYY-MM-DD'
                                  )}
                                  required
                                />
                              </div>
                            )}
                            <button
                              className="save-btn hover-btn"
                              type="submit"
                            >
                              Agregar nueva Oferta
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-title-2">
                  <h4>Por favor seleccione una sucursal</h4>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
export async function getStaticProps() {
  try {
    const res = await fetch(`${API_URL}/productos/all`)
    const productos = await res.json()
    return {
      props: {
        productos,
      },
      revalidate: 1,
    }
  } catch (err) {
    const productos = { error: true }
    return {
      props: {
        productos,
      },
      revalidate: 1,
    }
  }
}

export default OfertaNueva
