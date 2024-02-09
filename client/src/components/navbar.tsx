import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { IShopContext, ShopContext } from '../context/shop-context'
import { useContext } from 'react'
import { useCookies } from 'react-cookie'

export const Navbar = () => {
    const { availableMoney, isAuthenticated, setIsAuthenticated } = useContext<IShopContext>(ShopContext)
    const [_, setCookies] = useCookies(['access_token'])

    const logout = () => {
        localStorage.clear()
        setCookies("access_token", null)
        setIsAuthenticated(false)
    }

    return <div className='navbar'>
        <div className='navbarTitle'>\
            <h1>DavidM shop</h1>
        </div>
        <div className='navbar-links'>
            {isAuthenticated && (
                <>
                    <Link to='/'>Shop</Link>
                    <Link to='/purchased-items'>Purchases</Link>
                    <Link to='/checkout'><FontAwesomeIcon icon={faShoppingCart} /></Link>\
                    <Link to="/auth" onClick={logout}>Logout</Link>
                    <span>${availableMoney}</span>    \
                </>
            )}
        </div>
    </div>
}