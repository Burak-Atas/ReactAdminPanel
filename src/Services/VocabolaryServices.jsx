import axios from 'axios'
import { Component } from 'react'

class VocabolaryServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'http://localhost:5000/teacher'
    this.token = localStorage.getItem("token") // Token'i sınıf genelinde saklıyoruz
  }

  getVocabolary() {
    return axios.get(this.url + '/getvocabolary', {
      headers: {
        "token": this.token,
      },
    })
  }
}

export default VocabolaryServices;
