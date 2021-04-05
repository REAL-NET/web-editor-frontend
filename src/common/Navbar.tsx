import { NavLink } from "react-router-dom";

const Navbar= () => {
  return (
    <nav className="topnav">
      <ul>
        <li>
          <NavLink to="/" title="Home" exact activeClassName="selected">
              <div>HOME</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/mirf-editor" title="MIRF editor" activeClassName="selected">
              <div>Mirf-editor</div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;