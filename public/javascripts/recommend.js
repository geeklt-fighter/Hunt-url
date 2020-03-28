import axios from 'axios'
import { showAlert } from "./alert";


export const recommend = async (user, url, title, descr, postId) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'https://flaskrecommend.azurewebsites.net/recommend',
            data: {
                user,
                url,
                title,
                descr
            }
        })

        // console.log(res.data.answer)
        var bodyFormData = new FormData()
        bodyFormData.set('result', res.data.answer)

        const res2 = await axios({
            method: 'PATCH',
            url: `http://localhost:3001/api/v1/posts/${postId}`,
            headers: {
                'Authorization': `Hello ${document.cookie.split('=')[1]}`
            },
            data: bodyFormData
        })

        console.log('Response 2: ', res2)
        // document.getElementById('result').innerHTML = res.data.answer.join("\n")
    } catch (err) {
        console.log(err)
        showAlert('error', err)
    }
}