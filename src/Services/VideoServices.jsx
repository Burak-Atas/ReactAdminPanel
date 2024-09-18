import axios from 'axios'
import { Component } from 'react'
import { Navigate } from 'react-router-dom'

class VideoServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'http://localhost:5000/teacher'   
    this.token = localStorage.getItem("token")
  }

  AddVideo(formData, token) {
    return axios.post(this.url + '/addvideo', formData, {
      headers: {
        token:this.token
      },
    })
  }
  getVideo(token) {
    return axios.get(this.url + '/videos', {
      headers: {
        token:this.token
      },
    })
  }
  delVideo(name) {
    return axios.delete(this.url + '/delvideo', {
      headers: {
        token:this.token,
        name: name,
      },
    })
  }
}

export default VideoServices
