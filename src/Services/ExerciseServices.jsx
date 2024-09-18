import axios from 'axios'
import { Component } from 'react'

class ExerciseServices extends Component {
  constructor(props) {
    super(props)
    this.url = 'http://localhost:5000/teacher'
    this.token = localStorage.getItem("token") // Token'i sınıf genelinde saklıyoruz
  }
  

  getExercise(level) {
    console.log(this.token,"level",level)
    return axios.get(this.url + '/getexercises?level='+level ,{
      headers: {
        "Content-Type": "application/json",
        "token": this.token,
      },
    })
  }
  
  getExerciseDetails(formData) {
    console.log(this.token,formData)
    return axios.post(this.url + '/getexercisedetails',formData ,{
      headers: {
        "Content-Type": "application/json",
        "token": this.token,
      },
    })
  }
 
}

export default ExerciseServices
