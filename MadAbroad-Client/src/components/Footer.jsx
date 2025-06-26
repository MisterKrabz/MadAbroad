import "./Footer.css"
import "../App.css"

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p className="footer-text">© 2023 Mad Abroad. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/contact" className="footer-link">Contact Me</a>
                    <a href="/payment" className="footer-link">Buy Me a Coffee</a> 
                    <a href="/report" className="footer-link">Report a Bug</a>
                    <a href="/privacy" className="footer-link">Report a New Program</a>
                </div>
                <div className = "unaffiliation-container">
                    <p className = "unaffiliation">MadAbroad is not affiliated with the University of Wisconsin-Madison</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;