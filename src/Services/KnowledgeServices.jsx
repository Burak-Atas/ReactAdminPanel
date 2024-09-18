import axios from 'axios'
import { Component } from 'react'

class KnowledgeServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'http://localhost:5000/teacher'
    this.token = localStorage.getItem("token") // Token'i sınıf genelinde saklıyoruz
    console.log("knowledge class token", this.token)
  }

  Addknowledge(formData) {
    return axios.post(this.url + '/setknowledge', formData, {
      headers: {
        
        token: this.token, // Template literal kullanılmasına gerek yok
      },
    })
  }

  SetPublishKnowledge(formData) {
    return axios.post(this.url + '/setpublish', formData, {
      headers: {
        token: this.token,
      },
    })
  }

  SetNotPublishKnowledge(formData) {
    return axios.post(this.url + '/setnotpublish', formData, {
      headers: {
        token: this.token,
      },
    })
  }

  GetKnowledge(token) {
    console.log("token değeri ayarlandı",token)
    return axios.get(this.url + '/getknowledge', {
      headers: {
        "Content-Type": "application/json",
        "token": this.token,
      },
    })
    
  }

  Deleteknowledge(head) {
    return axios.delete(this.url + '/deleteknowledge', {
      headers: {
        token: this.token, // Token bilgisini header'a ekle
        head: head, // Başlık bilgisini header'a ekle
      },
    })
  }
}

export default KnowledgeServices
