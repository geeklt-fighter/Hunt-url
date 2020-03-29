import axios from 'axios'
import { showAlert } from "./alert";



export const createPost = async (name,theme,difficulty,summary,description,mediaResource,poster) => {
    try {
        const res = await axios({
            method:'POST',
            url: `http://localhost:3001/api/v1/posts/`,
            headers:{
                'Authorization': `Hello ${document.cookie.split('=')[1]}`
            },
            data:{
                name,
                theme,
                difficulty,
                summary,
                description,
                mediaResource,
                poster
            }
        })
       
        if (res.data.status === 'success') {
            showAlert('success', 'Created successfully')
            window.setTimeout(() => {
                location.assign('/')
            }, 500)
        }
    } catch (err) {
        showAlert('error',err)
    }
}


export const deletePost = async (id) => {

    try {
        const res = await axios({
            method: 'DELETE',
            url: `http://localhost:3001/api/v1/posts/${id}`,
            headers: {
                'Authorization': `Hello ${document.cookie.split('=')[1]}`
            }
        })
        console.log(res)
    } catch (err) {
        console.log(err)
        showAlert('error', err)
    }
}