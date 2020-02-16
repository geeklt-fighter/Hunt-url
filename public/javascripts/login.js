import axios from 'axios'


export const login = async (email, password) => {
    console.log(email, password)
    const res = await axios({
        method: 'POST',
        url: 'http://localhost:3001/api/v1/users/login',
        data: {
            email,
            password
        }
    })
    console.log(res)

    if (res.data.status === 'success') {
        
        window.setTimeout(() => {
            location.assign('/')
        }, 5)
    }
}