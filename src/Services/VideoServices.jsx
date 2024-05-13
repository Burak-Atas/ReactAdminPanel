import axios from 'axios';
import React, { Component } from 'react';

class VideoServices extends Component {
    constructor(props) {
        super(props);
        this.url = 'http://localhost:5000/teacher';
    }

    AddVideo(formData, token) {
        return axios.post(this.url + "/addvideo", formData, {
            headers: {
                'ad': `${token}`
            }
        });
    }
    getVideo(token){
        return axios.get(this.url + "/video", {
            headers: {
                'ad': `${token}`
            }
        });
    }
    delVideo(token){
        return axios.delete(this.url + "/video", {
            headers: {
                'token': `${token}`
            }
        });
    }

}

export default VideoServices;
