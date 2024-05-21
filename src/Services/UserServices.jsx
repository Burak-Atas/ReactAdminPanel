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
    delUser(token,user_name){
        return axios.delete(this.url + "/deluser", {
            headers: {
                'ad': `${token}`,
                'user_name':user_name,
            }
        });
    }

}

export default UserServices;
