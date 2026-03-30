"use client";

type NavbarProps = {
  onLoginClick: () => void;
};

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <nav className="nav">
      <div className="nav__wrapper">
        
        <figure className="nav__img--mask">
          <img
            className="nav__img"
            src="/assets/logo.png"
            alt="logo"
          />
        </figure>

        <ul className="nav__list--wrapper">
          
          {/* ✅ THIS is the important change */}
          <li 
            className="nav__list nav__list--login"
            onClick={onLoginClick}
            style={{ cursor: "pointer" }}
          >
            Login
          </li>

          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>

      </div>
    </nav>
  );
}