// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Auth from "../utils/auth";

function Header() {
  // useEffect(() => {
  //   if (currentLink) {
  //     document.title = currentLink;
  //   }
  // }, [currentLink]);

  // const handleLinkClick = (name) => {
  //   name ? setCurrentLink(format.title(name)) : setCurrentLink("Feedback Templateur");
  // };

  const links = ["login"];
  return (
    <header>
      <h1>header component</h1>
      <nav>
        <ul>
          {links.map((link, i) => (
            <Link key={i} to={link}>
              {link}
            </Link>
          ))}
          <Link to={"/"}>Home</Link>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
