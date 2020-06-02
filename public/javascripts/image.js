import axios from 'axios'
import { showAlert } from "./alert";


export const getImage = async (imgurl,type) => {
    const url = type === 'user'?
        '/images/user':
        '/images/post' 
    try {
        const res = await axios({
            method: 'POST', 
            url,
            data: {
                imgurl
            }
        })
        
        console.log(res)
        if(res.data.status === 'success'){
            return true
        }
        return false
        // if (res.data.status === 'success') {
        //     location.assign('/me')
        // }
    } catch (err) {
        showAlert('error', err)
    }
}

