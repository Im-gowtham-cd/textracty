import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Nav() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload(); // reload to reset UI after logout
    };

    return (
        <nav className="nav">
            <h1 className="nav-title">Textracty</h1>

            <ul className="nav-menu">
                <Link to="/" className="link">
                    Home
                </Link>
                <Link to="/about" className="link">
                    About
                </Link>
                <Link to="/contact" className="link">
                    Contact
                </Link>
            </ul>

            <ul className="nav-btn">
                {user ? (
                    <>
                        <span>Welcome, {user.fullName || user.email}</span>
                        <button onClick={handleLogout} className="btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn">
                            Login
                        </Link>
                        <Link to="/signup" className="btn">
                            Signup
                        </Link>
                    </>
                )}
            </ul>
        </nav>
    );
}
