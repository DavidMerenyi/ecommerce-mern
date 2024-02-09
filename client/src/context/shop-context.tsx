import { createContext, useEffect, useState } from 'react'
import { useGetProducts } from '../hooks/useGetProducts'
import axios from 'axios'
import { useGetToken } from '../hooks/useGetToken'
import { useNavigate } from 'react-router-dom'
import { IProduct } from '../models/interfaces'
import { PurchasedItemsPage } from "./../pages/purchased-items/index";
import { useCookies } from 'react-cookie'

export interface IShopContext {
    addToCart?: (itemId: string) => void
    removeFromCart?: (itemId: string) => void
    updateCartItemCount?: (itemId: string, newAmount: number) => void
    getCartItemCount?: (itemId: string) => number
    getTotalCartAmount?: () => number
    checkout?: () => void
    availableMoney?: number
    purchasedItems: IProduct[]
    isAuthenticated?: boolean
    setIsAuthenticated?: (isAuthenticated: boolean) => void
}

const defaultVal: IShopContext = {
    addToCart: () => null,
    removeFromCart: () => null,
    updateCartItemCount: () => null,
    getCartItemCount: () => 0,
    getTotalCartAmount: () => 0,
    checkout: () => null,
    availableMoney: 0,
    purchasedItems: [],
    isAuthenticated: false,
    setIsAuthenticated: () => null
}

export const ShopContext = createContext<IShopContext>(defaultVal)

export const ShopContextProvider = ({ children }) => {
    const [cookies, setCookies] = useCookies(['access_token'])
    const [cartItems, setCartItems] = useState<{ string: number } | {}>({})
    const { products } = useGetProducts()
    const { headers } = useGetToken()
    const [availableMoney, setAvailableMoney] = useState<number>(0)
    const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(cookies.access_token !== null)

    const navigate = useNavigate()

    const fetchAvailableMoney = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/products/available-money/${localStorage.getItem('userID')}`, { headers })
            setAvailableMoney(res.data.availableMoney)
        } catch (error) {
            alert("ERROR: Something went wrong")
        }
    }

    const fetchPurchasedItems = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/products/purchased-items/${localStorage.getItem('userID')}`, { headers })
            setPurchasedItems(res.data.purchasedItems)
        } catch (error) {
            alert("ERROR: Something went wrong")
        }
    }

    const getCartItemCount = (itemId: string): number => {
        if (itemId in cartItems) {
            return cartItems[itemId]
        } else {
            return 0
        }
    }

    const addToCart = (itemId: string) => {
        if (!cartItems[itemId]) {
            return setCartItems({ ...cartItems, [itemId]: 1 })
        } else {
            setCartItems({ ...cartItems, [itemId]: cartItems[itemId] + 1 })
        }
    }

    const removeFromCart = (itemId: string) => {
        if (!cartItems[itemId]) return
        if (cartItems[itemId] === 0) return

        setCartItems({ ...cartItems, [itemId]: cartItems[itemId] - 1 })
    }

    const updateCartItemCount = (itemId: string, newAmount: number) => {
        if (newAmount < 0) return
        setCartItems({ ...cartItems, [itemId]: newAmount })
    }

    const getTotalCartAmount = (): number => {
        let totalAmount = 0
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                totalAmount += products.find(product => product._id === itemId).price * cartItems[itemId]
            }
        }

        return totalAmount
    }

    const checkout = async () => {
        const body = { customerID: localStorage.getItem('userID'), cartItems }
        try {
            await axios.post('http://localhost:3001/products/checkout', body, { headers })
            setCartItems({})
            fetchAvailableMoney()
            navigate("/")
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchAvailableMoney()
            fetchPurchasedItems()
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.clear()
            setCookies("access_token", null)
        }
    }, [isAuthenticated])

    const contextValue: IShopContext = {
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount,
        getTotalCartAmount,
        checkout,
        availableMoney,
        purchasedItems,
        isAuthenticated,
        setIsAuthenticated
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    )
}