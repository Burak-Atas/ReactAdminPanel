import React, { useState, useEffect } from 'react';

function FullscreenAlert({ onConfirm }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      onConfirm(); 
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Tam ekran değişikliklerini dinle
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Temizleme fonksiyonu
    return () => 
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    !isFullscreen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80 z-50">
        <div className="bg-white p-4 rounded-lg shadow-md text-center"> {/* Text-center eklendi */}
          <p className="text-gray-800 mb-4">Oyunlarda sadece tam ekran moduna izin veriliyor!</p>
          <button 
            onClick={handleFullscreen}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Tam Ekran
          </button>
        </div>
      </div>
    )
  );
}

export default FullscreenAlert;