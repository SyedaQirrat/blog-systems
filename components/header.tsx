// components/header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="headerTop">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <Link href="/" className="navbar-brand">
            <img src="/images/logo.webp" alt="Logo" className="logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#header-nav"
            aria-controls="header-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="header-nav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/login" className="nav-link loginButton">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/signup" className="nav-link signUpButton">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;