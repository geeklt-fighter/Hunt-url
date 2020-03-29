import "@babel/polyfill";
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSettings";
import { recommend } from "./recommend";
import { deletePost } from "./editpost";
import { showAlert } from "./alert";

const signupForm = document.querySelector('.form--signup')
const loginForm = document.querySelector('.form--login')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const searchButton = document.querySelector('.btn-search')
const logoutButton = document.querySelector('.nav__el--logout')
const deletePostButton = document.querySelectorAll('.btn-delete-post')

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault()

        const username = document.getElementById('username').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const passwordconfirm = document.getElementById('passwordconfirm').value

        signup(username, email, password, passwordconfirm)
    })
}


if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        login(email, password)
    })
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout)
}

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault()

        const name = document.getElementById('name').value
        const email = document.getElementById('email').value


        updateSettings({ name, email }, 'data')
    })
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', e => {
        e.preventDefault()

        const passwordCurrent = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const passwordConfirm = document.getElementById('password-confirm').value

        updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')
    })
}

if (deletePostButton) {
    // console.log(deletePostButton)

    for (let i = 0; i < deletePostButton.length; i++) {
        //    console.log(deletePostButton[i])
        deletePostButton[i].addEventListener('click', () => {
            const postId = document.getElementById(`post-id-${i}`).textContent
            deletePost(postId)
        })
    }
}


if (searchButton) {

    searchButton.addEventListener('click', e => {
        e.preventDefault()
        const currentUrl = window.location.href
        const username = document.getElementById('username')
        const title = document.getElementById('title').textContent
        const description = document.getElementById('description').textContent
        const postId = document.getElementById('post-id').textContent

        if (username) {
            console.log('Username: ', username.textContent)
            console.log('Description:', description)
            console.log('Current Url:', currentUrl)
            console.log('Title: ', title);


            recommend(username, currentUrl, title, description, postId)
        } else {
            showAlert('error', 'Please log in')
            window.setTimeout(() => {
                location.assign('/login')
            }, 1000)
        }
    })
}