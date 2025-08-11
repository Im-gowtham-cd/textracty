import { Link } from 'react-router-dom'

export default function Nav() {
    return (
        <nav className="nav">
            <h1 className="nav-title">Textracty</h1>

            <ul className="nav-menu">
                <Link to={'/'} className='link'>Home</Link>
                <Link to={'/about'} className='link'>About</Link>
                <Link to={'/contact'} className='link'>Contact</Link>
            </ul>

            <ul className="nav-btn">
                <Link to={'/login'} className="btn">Login</Link>
                <Link to={'/signup'} className="btn">Signup</Link>
            </ul>
        </nav>
    )
}