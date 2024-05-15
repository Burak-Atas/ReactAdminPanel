import React, { useState, useRef, useEffect } from "react";
import VideoServices from "../Services/VideoServices";
import axios from "axios";

export default function Videos() {
  const vd = new VideoServices();

  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Assuming getUsers is a function in UserServices to fetch users
    vd.getVideo()
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("video", file);

      axios
        .post("http://localhost:5000/teacher/addvideo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        })
        .then((response) => {
          const newVideo = {
            name: response.data.name,
            filename: response.data.filename,
            url: response.data.url,
          };
          console.log(newVideo);
          setVideos((prevVideos) => [...prevVideos, newVideo]);
          setUploadProgress(0);
        })
        .catch((error) => {
          console.error("Video yükleme başarısız oldu:", error);
          setUploadProgress(0);
        });
    }
  };

  const removeVideo = (index,name) => {
    const updatedVideos = [...videos];

      vd.delVideo("",name) 
      .then((response)=>{
        if(response.status===200){
          alert("video başarılı bir şekilde")
        }
      },[])

    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full h-full">
      <div className="h-32 flex items-center">
        <h2 className="text-6xl">VİDEOLAR</h2>
      </div>

      <div className="my-5">
        <div className="flex flex-wrap">
        {videos.map((video, index) => (
  <div key={index} className="my-2 mx-5 relative w-72  h-80 bg-sky-200">
    <button
      className="absolute top-2 right-2 text-white z-10"
      onClick={() => removeVideo(index, video.name)}
    >
      X
    </button>
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
      <video className="w-72 h-80" controls>
        <source className="w-72 h-80" src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
))}


          <div className="w-72 h-80 relative">
            <label
              htmlFor="uploadvideo"
              className="cursor-pointer absolute top-0 left-0 w-full h-full flex items-center justify-center border-2 border-dashed border-blue-500 rounded-lg"
              onClick={handlePlusClick}
            >
              <span className="text-6xl text-blue-500">+</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            {uploadProgress > 0 && (
              <div className="absolute bottom-0 left-0 w-full bg-blue-500 h-1">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="h-full bg-green-500"
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
