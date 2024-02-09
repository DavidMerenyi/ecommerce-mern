import { useContext } from 'react'
import { IShopContext, ShopContext } from '../../context/shop-context'

export const PurchasedItemsPage = () => {
    const { purchasedItems, addToCart, getCartItemCount } = useContext<IShopContext>(ShopContext)

    return (
        <div className="purchased-items-page">
            {" "}
            <h1>Purchased items</h1>
            <div className="purchased-items">
                {purchasedItems.map((item) => {
                    const count = getCartItemCount(item._id)

                    return (
                        <div key={item._id} className="purchased-item">
                            <h3>{item.productName}</h3>
                            <img src={item.imageURL} alt={item.productName} />
                            <p>${item.price}</p>
                            <button className='add-to-cart-btn' onClick={() => addToCart(item._id)}>Buy again {count > 0 && <>({count})</>}</button>
                        </div>
                    )
                }
                )}
            </div>
        </div>
    )
}