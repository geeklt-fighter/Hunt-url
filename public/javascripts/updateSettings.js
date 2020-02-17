import axios from "axios";
import { showAlert } from "./alert";



export const updateSettings = async (data, type) => {
    console.log(name, email)

    const url = type === 'password'?
        'http://localhost:3001/api/v1/users/updatePassword':
        'http://localhost:3001/api/v1/users/updateMe'
    try {
        const res = await axios({
            method: 'PATCH',
            url,
            data
        })

        console.log(res)
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updates successfully`)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}