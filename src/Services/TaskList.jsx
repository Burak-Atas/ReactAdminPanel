import axios from 'axios';
import React, { Component } from 'react';

class TaskListServices extends Component {
    constructor(props) {
        super(props);
        this.url = 'http://localhost:5000/teacher';
    }

    AddTask(formData, token) {
        return axios.post(this.url + "/addtask", formData, {
            headers: {
                'ad': `${token}`
            }
        });
    }

    getTask(token){
        return axios.get(this.url + "/tasklist", {
            headers: {
                'ad': `${token}`
            }
        });
    }
    delTask(id, token) {
        return axios.delete(this.url + "/deltask", {
          headers: {
            'ad': `${token}`, // Token bilgisini header'a ekle
            'task_id':id // Başlık bilgisini header'a ekle
          }
        });
      }
    
}

export default TaskListServices;
