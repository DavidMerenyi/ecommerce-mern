import { useContext } from 'react'
import { useGetProducts } from '../../hooks/useGetProducts'
import { IProduct } from '../../models/interfaces'
import { IShopContext, ShopContext } from '../../context/shop-context'
import { CartItem } from './cart-item'
import { useNavigate } from 'react-router-dom'

export const CheckoutPage = () => {
    const { getCartItemCount, getTotalCartAmount, checkout } = useContext<IShopContext>(ShopContext)
    const { products } = useGetProducts()
    const navigate = useNavigate()

    const totalSubtotal = getTotalCartAmount()

    return (
        <div className="cart">
            {" "}
            <div>
                {" "}
                <h1>Your cart items</h1>
            </div>

            <div className='cart'>
                {products.map((product: IProduct) => {
                    if (getCartItemCount(product._id) > 0) {
                        return <CartItem product={product} />
                    }
                })}
            </div>

            {totalSubtotal > 0 ? (<div className='checkout'>
                <p>Subtotal: {totalSubtotal.toFixed(2)}$</p>
                <button onClick={() => navigate('/')}>Continue shopping</button>
                <button onClick={checkout}>Checkout</button>
            </div>) : <h2>Your cart is empty</h2>}
        </div>
    )
}