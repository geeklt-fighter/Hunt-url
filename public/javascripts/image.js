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
    } catch (err) {
        showAlert('error', err)
    }
}



// if (res.data.status === 'success') {
//     let accountuserimg = document.querySelector('.form__user-photo')
//     let headeruserimg = document.querySelector('.nav__user-img')
//     if (accountuserimg) {
//         accountuserimg.src = res.data.url
//     }
//     if (headeruserimg) {
//         headeruserimg.src = res.data.url
//     }   
// }