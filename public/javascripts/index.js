import "@babel/polyfill";
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSettings";
import { recommend } from "./recommend";
import { deletePost, createPost } from "./editpost";
import { contribute } from "./contribute";
import { getImage } from "./image";
import { showAlert } from "./alert";


const signupForm = document.querySelector('.form--signup')
const loginForm = document.querySelector('.form--login')
const userDataForm = document.querySelector('.form-user-data')
const editPostForm = document.querySelector('.form-edit-post')
const userPasswordForm = document.querySelector('.form-user-password')
const searchButton = document.querySelector('.btn-search')
const logoutButton = document.querySelector('.nav__el--logout')
const deletePostButton = document.querySelectorAll('.btn-delete-post')
const contributeButton = document.querySelector('.btn-contribution')

let headeruserimg = document.querySelector('.nav__user-img')
let accountuserimg = document.querySelector('.form__user-photo')

if (headeruserimg) {
    headeruserimg.onload = function () {
        console.log(`Image loaded, size ${headeruserimg.src}`);
    }
    headeruserimg.onerror = function () {
        getImage(headeruserimg.src)
    }
}

if (accountuserimg) {
    accountuserimg.onload = function () {
        console.log(`Image loaded, size ${accountuserimg.src}`);
    }
    accountuserimg.onerror = function () {
        getImage(accountuserimg.src)
    }
}


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

        const form = new FormData()
        form.append('name', document.getElementById("name").value)
        form.append('email', document.getElementById("email").value)
        form.append('photo', document.getElementById("photo").files[0])

        updateSettings(form, 'data')
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

if (editPostForm) {


    editPostForm.addEventListener('submit', e => {
        e.preventDefault()
        const themes = document.getElementById('theme')
        const levels = document.getElementById('level')

        const name = document.getElementById('postname').value
        const theme = themes.options[themes.selectedIndex].text
        const difficulty = levels.options[levels.selectedIndex].text
        const summary = document.getElementById('summary').value
        const description = document.getElementById('description').value
        const mediaResource = 'data-science-3.jpg'
        // const mediaResource = document.getElementById('mediaResource').files[0]
        const poster = document.getElementById('user-id').textContent

        

        createPost(name, theme, difficulty, summary, description, mediaResource, poster)
    })
}


if (deletePostButton) {

    for (let i = 0; i < deletePostButton.length; i++) {
        deletePostButton[i].addEventListener('click', () => {
            const postId = document.getElementById(`post-id-${i}`).textContent
            deletePost(postId)
        })
    }
}

if (contributeButton) {
    contributeButton.addEventListener('click', () => {
        let info = confirm("1. Please ensure you want to upload your browsing history \n2. Ensure that you are the owner of the history")

        if (info === true) {
            let txt = "Thanks your contribution."
            contribute()
            showAlert('success', txt)
        } else {
            let txt = "It's ok. You can still use recommend service !!"
            showAlert('warn', txt)
        }
        // document.getElementById("result-contribution").innerHTML = txt
    })
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

            const loader = document.querySelector('.loader')
            loader.style.opacity = 1;
            loader.style.display = 'block'
            recommend(username, currentUrl, title, description, postId)
        } else {
            showAlert('error', 'Please log in')
            window.setTimeout(() => {
                location.assign('/login')
            }, 1000)
        }
    })
}