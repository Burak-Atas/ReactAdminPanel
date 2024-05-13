import React, { useState, useRef } from 'react';
import VideoServices from '../Services/VideoServices';

export default function Videos() {

  const vd = new VideoServices();
  
  const [videos, setVideos] = useState([
    {
      name: "video_name",
      url: "https://www.youtube.com/watch?v=il3YpsmNsCk&list=RD4CQGclmxNBY&index=11",
    },
    {
      name: "video_name",
      url: "https://www.youtube.com/watch?v=il3YpsmNsCk&list=RD4CQGclmxNBY&index=11",
    },
  ]);

  const [newVideoName, setNewVideoName] = useState(""); // Yeni eklenen video adını tutacak state
  const [selectedVideo, setSelectedVideo] = useState(null); // Seçilen videoyu tutacak state

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        setSelectedVideo({ name: newVideoName, url }); // Yeni eklenen videonun adını da ekleyin
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  const handleNameChange = (event) => {
    setNewVideoName(event.target.value); // Video ismi girildikçe state güncellensin
  };

  const handleAddVideo = () => {
    if (selectedVideo) {
      vd.addVideo(selectedVideo); // Seçilen videoyu servise ekle
      setSelectedVideo(null); // Seçilen videoyu temizle
    }
  };

  const isButtonActive = selectedVideo !== null; // Gönder butonunun aktif olup olmadığını kontrol et

  return (
<div className='w-full'>
  <div className='h-32 flex items-center'>
    <h2 className='text-6xl'>VİDEOLAR</h2>
  </div>

  <div className='my-5'>
    <div className='flex flex-wrap'>
      {videos.map((video, index) => (
        <div key={index} className="my-2 mx-5 relative w-72 h-80 bg-gray-200">
          {selectedVideo === video && (
            <h3 className='text-white absolute bottom-7'>{video.name}</h3>
          )}
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-200'>
            <button className="absolute top-2 right-2 text-white" onClick={() => removeVideo(index)}>X</button>
            <img
              className='w-full h-full'
              src={`https://img.youtube.com/vi/${video.url.split('=')[1]}/0.jpg`}
              alt={video.name}
            />
          </div>
        </div>
      ))}
      <div className='w-72 h-80 relative'>
        <label htmlFor="uploadvideo" className="cursor-pointer absolute top-0 left-0 w-full h-full flex items-center justify-center border-2 border-dashed border-blue-500 rounded-lg" onClick={handlePlusClick}>
          <span className="text-6xl text-blue-500">+</span>
        </label>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        {/* Eklenen form alanı */}
        <input type="text" value={newVideoName} onChange={handleNameChange} placeholder="Video Adı" className="absolute bottom-5 left-5 w-2/3 h-10 border border-gray-300 rounded-lg pl-2" />
      </div>
    </div>
  </div>

  {/* Gönder butonu */}
  <button onClick={handleAddVideo} disabled={!isButtonActive} className="bg-blue-500 text-white px-4 py-2 rounded-lg" style={{ opacity: isButtonActive ? 1 : 0.5 }}>
    Gönder
  </button>
</div>

  );
}
