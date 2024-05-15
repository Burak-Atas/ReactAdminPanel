import axios from 'axios';
import React, { Component } from 'react';

class MessagesServices extends Component {
    constructor(props) {
        super(props);
        this.url = 'http://localhost:5000/teacher';
    }

    AddMessages(formData, token) {
        return axios.post(this.url + "/sendmessage", formData, {
            headers: {
                'ad': `${token}`
            }
        });
    }

    getMessages(token){
        return axios.get(this.url + "/messages", {
            headers: {
                'ad': `${token}`
            }
        });
    }
    delMessages(head, token) {
        return axios.delete(this.url + "/delmessage", {
          headers: {
            'ad': `${token}`, // Token bilgisini header'a ekle
            'header':head // Başlık bilgisini header'a ekle
          }
        });
      }
      


}

export default MessagesServices;
