import { Link } from "react-router-dom";

function Navbar({ isLoggedIn, error }: {isLoggedIn: boolean | null, error: string}) {

  return (
    <><nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbar">
        <div className="navbar-nav">
          {isLoggedIn ? (
            <>
              <Link className="nav-item nav-link" id="home" to="/">Home</Link>
              <Link className="nav-item nav-link" id="logout" to="/logout">Logout</Link>
            </>
          ) : isLoggedIn !== null ? (
            <>
              <Link className="nav-item nav-link" id="login" to="/login">Login</Link>
              <Link className="nav-item nav-link" id="signUp" to="/signup">Sign Up</Link>
            </>
          ) : <></>}
        </div>
      </div>
    </nav>
    <div>
        {error && <div className="alert alert-danger">{error}</div>}
    </div></>
  );
}



export default Navbar;