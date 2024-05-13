import axios from 'axios';
import React, { Component } from 'react';

class UserServices extends Component {
    constructor(props) {
        super(props);
        this.url = 'http://localhost:5000/teacher';
    }

    AddUser(formData, token) {
        return axios.post(this.url + "/adduser", formData, {
            headers: {
                'ad': `${token}`
            }
        });
    }
    getUser(token){
        return axios.get(this.url + "/user", {
            headers: {
                'ad': `${token}`
            }
        });
    }
    delUser(token){
        return axios.delete(this.url + "/user", {
            headers: {
                'token': `${token}`
            }
        });
    }

}

export default UserServices;
