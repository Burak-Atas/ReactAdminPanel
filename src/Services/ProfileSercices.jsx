import React from 'react';
import axios from 'axios';

export default class ProfileServices extends React.Component {
    constructor(props) {
        super(props);
        this.url = 'http://localhost:5000/teacher'; // Replace 'your_api_url_here' with your actual API URL
    }

    getProfileDetails(token) {
        return axios.get(`${this.url}/addvideo`, {
            headers: {
                'ad': `${token}`
            }
        });
    }

}
