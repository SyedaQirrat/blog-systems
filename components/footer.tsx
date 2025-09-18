// components/footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footerContent">
      <div className="container">
        <div className="footerLinks">
          <p>
            <Link href="/about-us">About</Link>
          </p>
          <p>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </p>
          <p>
            <Link href="/terms">Terms of Service</Link>
          </p>
        </div>
        <div className="footerSocialMedia">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/facebook-icon.webp" alt="Facebook" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/twitter-icon.webp" alt="Twitter" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/linkedin-icon.webp" alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;