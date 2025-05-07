const Footer = () => (
  <footer className="py-4 bg-footer mt-auto">
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between small">
        <div className="text-muted-1">
          <i className="fas fa-copyright"></i>
          {` Copyright 2024 `}
          <b>Fribar. </b>
          Todos los derechos reservados
        </div>
      </div>
    </div>
    <style jsx>{`
      .fa-heart {
        color: #f55d2c;
      }
    `}</style>
  </footer>
);

export default Footer;
