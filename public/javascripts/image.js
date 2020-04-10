import axios from 'axios'
import { showAlert } from "./alert";


export const getImage = async (url) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/images/resource`,
            data: {
                url
            }
        })

        if (res.data.status === 'success') {
            location.assign('/me')
        }
    } catch (err) {
        showAlert('error', err)
    }
}

