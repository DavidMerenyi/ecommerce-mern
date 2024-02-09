import { useCookies } from 'react-cookie'

export const useGetToken = () => {
    const [cookies] = useCookies(['access_token'])

    return { headers: { authorization: cookies.access_token } }
}
