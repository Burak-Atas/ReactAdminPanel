import axios from 'axios'
import { Component } from 'react'

class TaskListServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'http://localhost:5000/teacher'
    this.token = localStorage.getItem("token") // Token'i sınıf genelinde saklıyoruz

  }

  AddTask(formData, token) {
    return axios.post(this.url + '/addtask', formData, {
      headers: {
        token: `${this.token}`,
      },
    })
  }

  getTask(token) {
    return axios.get(this.url + '/tasklist', {
      headers: {
        token: `${this.token}`,
      },
    })
  }
  delTask(id, token) {
    return axios.delete(this.url + '/deltask', {
      headers: {
        token: `${this.token}`, // Token bilgisini header'a ekle
        task_id: id, // Başlık bilgisini header'a ekle
      },
    })
  }
}

export default TaskListServices
