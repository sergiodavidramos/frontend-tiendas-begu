import { useRef } from 'react'

export default ({ confirmar, titulo }) => {
  const botonConfirmar = useRef(null)
  function escucharTeclado(event) {
    var codigo = event.key
    if (codigo === 'Enter') {
      botonConfirmar.current.click()
    }
  }
  return (
    <div
      id="confirmacion_model"
      className="header-cate-model main-gambo-model modal fade"
      tabIndex="-1"
      role="dialog"
      aria-modal="false"
      onKeyDown={escucharTeclado}
    >
      <div className="modal-dialog category-area" role="document">
        <div className="category-area-inner">
          <div className="modal-header">
            <button
              type="button"
              className="btn btn-close close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="category-model-content modal-content">
            <div className="cate-header">
              <h4>{titulo}</h4>
            </div>
            <div className="btn-confirmation">
              <a
                ref={botonConfirmar}
                data-dismiss="modal"
                className="view-btn hover-btn btn-margin"
                style={{ cursor: 'pointer' }}
                onClick={() => confirmar()}
                data-toggle="modal"
                data-target="#comprobante_model"
              >
                SI
              </a>
              <a
                data-dismiss="modal"
                className="view-btn hover-btn btn-margin"
                style={{ cursor: 'pointer' }}
              >
                NO
              </a>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .btn-confirmation {
          text-align: center;
          padding: 10px;
        }
        .btn-margin {
          margin: 10px;
          padding: 10px 40px;
        }
        .main-gambo-model {
          background-image: -webkit-linear-gradient(
            left,
            rgba(230, 92, 91, 0.9),
            rgba(245, 93, 44, 0.9)
          );
          background-image: linear-gradient(
            to right,
            rgba(230, 92, 91, 0.9),
            rgba(245, 93, 44, 0.9)
          );
        }

        .category-area-inner .modal-header {
          border-bottom: 0;
        }

        .category-area-inner .btn-close {
          color: #fff !important;
          opacity: 1 !important;
          padding: 30px 0 15px !important;
          font-size: 30px !important;
          cursor: pointer !important;
        }

        .category-model-content {
          background: #fff;
          border: 0 !important;
          border-radius: 0 !important;
        }

        .catey__icon {
          display: none;
        }

        .search__icon {
          display: none;
        }

        .sub-header-icons-list {
          display: inline-block;
          font-size: 20px;
        }

        .cate__btn {
          font-size: 20px;
          color: #8f91ac !important;
          padding: 20px 20px 19px;
        }

        .cate__btn:hover {
          color: #f55d2c !important;
        }

        .search__btn {
          font-size: 20px;
          color: #fff !important;
          padding: 20px 20px 21px;
          background: #2b2f4c;
        }

        /* --- Category Mode --- */

        .cate-header {
          background: #2b2f4c;
          color: #fff;
          padding: 15px 20px;
        }

        .cate-header h4 {
          font-size: 18px;
          font-weight: 500;
          line-height: 24px;
        }

        .category-by-cat {
          width: 100%;
          display: inline-table;
        }

        .category-by-cat li {
          width: 33.333%;
          vertical-align: middle;
          display: inline-block;
          list-style: none;
          float: left;
        }

        .single-cat-item {
          text-align: center;
          padding: 20px 10px;
          display: block;
        }

        .single-cat-item:hover {
          background: #f9f9f9;
        }

        .single-cat-item .text {
          font-size: 14px;
          font-weight: 500;
          color: #2b2f4c;
        }

        .single-cat-item .icon {
          width: 100%;
          text-align: center;
          margin-bottom: 15px;
        }

        .single-cat-item .icon img {
          width: 50px;
        }

        .morecate-btn {
          display: block;
          text-align: center;
          border-top: 1px solid #efefef;
          padding: 20px;
          font-size: 16px;
          font-weight: 500;
          color: #2b2f4c;
        }

        .morecate-btn i {
          margin-right: 5px;
        }

        .morecate-btn:hover {
          color: #f55d2c !important;
        }

        .search-ground-area {
          max-width: 400px !important;
        }

        .search-header {
          position: relative;
          width: 100%;
          border-bottom: 1px solid #efefef;
        }

        .search-header input {
          width: 100%;
          border: 0;
          padding: 20px;
          position: relative;
        }

        .search-header button {
          position: absolute;
          right: 0px;
          background: transparent;
          border: 0;
          padding: 17px;
          font-size: 20px;
        }

        .search-by-cat {
          width: 100%;
          height: 321px;
          overflow: hidden scroll;
        }

        .search-by-cat .single-cat {
          -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=85)';
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          margin-bottom: 0;
          -webkit-transition: all 0.25s;
          transition: all 0.25s;
          padding: 15px 20px;
        }

        .search-by-cat .single-cat .icon {
          background-color: #f9f9f9;
          border-radius: 5%;
          color: #fff;
          font-size: 22px;
          height: 50px;
          line-height: 47px;
          text-align: center;
          width: 50px;
        }

        .search-by-cat .single-cat .icon img {
          width: 30px;
        }

        .search-by-cat .single-cat .text {
          color: #2b2f4c;
          font-weight: 400;
          padding-left: 20px;
          font-size: 16px;
        }

        .search-by-cat .single-cat:hover .text {
          color: #f55d2c;
        }
      `}</style>
    </div>
  )
}
