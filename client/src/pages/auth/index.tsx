import { SyntheticEvent, useContext, useState } from 'react'
import axios from 'axios'
import { UserErrors } from '../../models/errors'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { IShopContext, ShopContext } from '../../context/shop-context'

export const AuthPage = () => {
    return (
        <div className='auth'>
            <Register />
            <Login />
        </div>
    )
}

const Register = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        try {
            await axios.post('http://localhost:3001/user/register', {
                username,
                password
            })
            alert('User registered! Now Login.')
        } catch (error) {
            if (error.response.data.type === UserErrors.USERNAME_ALREADY_EXISTS) {
                alert('Username already exists')
            } else {
                alert("ERROR: Something went wrong")
            }
        }
    }

    return (
        <div className='auth-container'>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' onChange={(event) => setUsername(event.target.value)} value={username} />
                </div>

                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' onChange={(event) => setPassword(event.target.value)} value={password} />
                </div>
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [_, setCookies] = useCookies(['access_token'])

    const navigate = useNavigate()

    const { setIsAuthenticated } = useContext<IShopContext>(ShopContext)

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        try {
            const result = await axios.post('http://localhost:3001/user/login', {
                username,
                password
            })
            setCookies('access_token', result.data.token)
            localStorage.setItem('userID', result.data.userID)
            setIsAuthenticated(true)
            navigate('/')
        } catch (error) {
            let errorMessage: string = ''
            switch (error.response.data.type) {
                case UserErrors.NO_USER_FOUND:
                    errorMessage = 'User not found'
                    break
                case UserErrors.WRONG_CREDENTIALS:
                    errorMessage = 'Invalid username/password'
                    break
                default:
                    errorMessage = 'Something went wrong'
            }

            alert("ERROR: " + errorMessage)
        }
    }

    return (
        <div className='auth-container'>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' onChange={(event) => setUsername(event.target.value)} value={username} />
                </div>

                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' onChange={(event) => setPassword(event.target.value)} value={password} />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}