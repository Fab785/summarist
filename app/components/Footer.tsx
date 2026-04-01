"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Actions</h4>
              <a href="#" className="footer__link">Summarist Magazine</a>
              <a href="#" className="footer__link">Cancel Subscription</a>
              <a href="#" className="footer__link">Help</a>
              <a href="#" className="footer__link">Contact us</a>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Useful Links</h4>
              <a href="#" className="footer__link">Pricing</a>
              <a href="#" className="footer__link">Summarist Business</a>
              <a href="#" className="footer__link">Gift Cards</a>
              <a href="#" className="footer__link">Authors & Publishers</a>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Company</h4>
              <a href="#" className="footer__link">About</a>
              <a href="#" className="footer__link">Careers</a>
              <a href="#" className="footer__link">Partners</a>
              <a href="#" className="footer__link">Code of Conduct</a>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Other</h4>
              <a href="#" className="footer__link">Sitemap</a>
              <a href="#" className="footer__link">Legal Notice</a>
              <a href="#" className="footer__link">Terms of Service</a>
              <a href="#" className="footer__link">Privacy Policies</a>
            </div>
          </div>

          <p className="footer__copyright">
            Copyright © 2023 Summarist.
          </p>
        </div>
      </div>
    </footer>
  );
}