import { formatDate } from '@fullcalendar/core/index.js'
import axios from 'axios'
import { Component } from 'react'

class UserServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'http://localhost:5000/teacher'
    this.token = localStorage.getItem("token") // Token'i sınıf genelinde saklıyoruz
  }

  AddUser(formData) {
    return axios.post(this.url + '/adduser', formData, {
      headers: {
        token: this.token, // Token'i burada kullanıyoruz
      },
    })
  }

  AddTeacher(formData) {
    return axios.post(this.url + '/addteacher', formData, {
      headers: {
        token: this.token, // Aynı şekilde burada da
      },
    })
  }

  getUser(token) {
    console.log("getuser token değeri boş", token)
    return axios.get(this.url + '/user', {
      headers: {
        token: this.token,
      },
    })
  }

  delUser(token,user_name) {
    console.log("getuser token değeri boş", token)

    return axios.get(this.url + '/deluser', {
      headers: {
        token: this.token,
        username: user_name,
      },
    })
  }

  updateUser(token,formData) {
    console.log("updateuser token değeri boş", formData.user_name)
    return axios.post(this.url + '/updateuser/'+formData.user_name,formData, {
      headers: {
        token
      },
    })
  }

  Login(formData) {
    return axios.post('http://localhost:5000/login', formData)
  }

  Activate(formData) {
    return axios.post(this.url + '/user/isactivate', formData, {
      headers: {
        token: this.token,
      },
    })
  }

  getCode(email) {
    return axios.post("http://localhost:5000/sendcode",{email} , {
      headers: {
      },
    })
  }
  updatePassword(formData) {
    return axios.post("http://localhost:5000/teacher/updatepassword",{formData} , {
      headers: {
      },
    })
  }
}

export default UserServices
