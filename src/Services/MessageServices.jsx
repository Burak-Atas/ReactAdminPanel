import axios from 'axios'
import { Component } from 'react'

class MessagesServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'https://api.gelistrio.com/teacher'
    this.token = localStorage.getItem("token")
  }

  AddMessages(formData, token) {
    return axios.post(this.url + '/sendmessage', formData, {
      headers: {
        token: `${this.token}`,
      },
    })
  }

  getMessages(token) {
    return axios.get(this.url + '/messages', {
      headers: {
        token: `${this.token}`,
      },
    })
  }
  delMessages(head, token) {
    return axios.delete(this.url + '/delmessage', {
      headers: {
        token: `${this.token}`, // Token bilgisini header'a ekle
        header: head, // Başlık bilgisini header'a ekle
      },
    })
  }
}

export default MessagesServices
