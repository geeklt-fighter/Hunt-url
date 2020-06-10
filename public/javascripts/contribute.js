import axios from 'axios'
import { showAlert } from './alert'

export const provideInfo = async (userdata, filename) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/histories/',
            data: {
                userinfo: userdata,
                fileinfo: filename
            }
        })
        console.log(res)
    } catch (err) {
        showAlert('error', err)
    }
}
