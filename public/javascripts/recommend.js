import axios from 'axios'
import { showAlert } from "./alert";


export const recommend = async(user,url,title,descr)=>{
    try {
        const res = await axios({
            method:'POST',
            url: 'https://flaskrecommend.azurewebsites.net/recommend',
            data:{
                user,
                url,
                title,
                descr
            }
        })
        document.getElementById('result').innerHTML = res.data.answer.join("\n")
    } catch (err) {
        console.log(err)
        showAlert('error',err)
    }
}