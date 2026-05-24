function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Fetch React
        </a>

        <div className="navbar-nav">
          <a className="nav-link active" href="#">
            Home
          </a>
          <a className="nav-link" href="#">
            Prodotti
          </a>
          <a className="nav-link" href="#">
            Contatti
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;