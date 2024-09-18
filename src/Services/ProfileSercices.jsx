import axios from 'axios'
import { Component } from 'react'

class ProfileServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'https://api.gelistrio.com/teacher'
  }

  Addprofile(formData, token) {
    return axios.post(this.url + '/addprofile', formData, {
      headers: {
        ad: `${token}`,
      },
    })
  }

  getprofile(token) {
    return axios.get(this.url + '/profile', {
      headers: {
        ad: `${token}`,
      },
    })
  }

  delprofile(id, token) {
    return axios.delete(this.url + '/delprofile', {
      headers: {
        ad: `${token}`, // Token bilgisini header'a ekle
        task_id: id, // Başlık bilgisini header'a ekle
      },
    })
  }
}

export default ProfileServices
