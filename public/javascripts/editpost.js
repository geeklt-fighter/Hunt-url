import axios from 'axios'
import { showAlert } from "./alert";


export const deletePost = async (id) => {
    
    try {
        
        const res = await axios({
            method:'DELETE',
            url: `http://localhost:3001/api/v1/posts/${id}`,
            headers:{
                'Authorization': `Hello ${document.cookie.split('=')[1]}`
            }
        })
        console.log(res)
    } catch (err) {
        console.log(err)
        showAlert('error',err)
    }
}