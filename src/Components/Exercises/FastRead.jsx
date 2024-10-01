import React, { useState, useEffect } from 'react'
import LoaderSimple from '../LoadPage/LoaderSimple'
import VocabolaryServices from '../../Services/VocabolaryServices'

const FastRead = ({ dayNumber }) => {
  const [isStart, setIsstart] = useState(false)

  const startScreen = () => {
    setIsstart(true)
  }

  const exerciseName = 'fastread'
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [reading, setReading] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(0)
  const [teaseMessage, setTeaseMessage] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])
  const vocabolaryservices = new VocabolaryServices()


  useEffect(() => {
    vocabolaryservices.getVocabolary()
    .then((response)=>{
       console.log(response.data)
       setVocabolary(response.data)
    })
    .catch((error)=>{
     
    })
   }, [])

  const [vocabolary,setVocabolary] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPr, setSelectedPr] = useState({"name": "", "text": "text", "speed": 0});

  

  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirm = () => {
    setIsConfirmed(true)
  }

  useEffect(() => {
   
  }, [])

  const exerciseOver = async () => {
   
  }

  const wordCount = text.split(' ').length

  const handleStart = () => {
    setStartTime(new Date());
    setReading(true);
    setEndTime(null); // Reset the end time when starting a new reading session
    setReadingSpeed(0); // Reset the reading speed when starting a new reading session
    setTeaseMessage('');
    setElapsedTime(0); // Reset the elapsed time
    startScreen(); // Ekranı kapatmak için isStart state'ini günceller
};

  const handleStop = () => {
    const end = new Date()
    setEndTime(end)
    setReading(false)
    const durationInSeconds = elapsedTime
    const speed = (wordCount * 60) / durationInSeconds
    setReadingSpeed(speed)

    exerciseOver()

    // Tease the user if they finish reading in less than 10 seconds
    if (durationInSeconds <= 10) {
      setTeaseMessage('Sanırım metni okumayı unuttunuz ? 😄')
    }
  }

  const formatTime = (date) => {
    return date
      ? new Date(
          date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' })
        ).toLocaleTimeString()
      : ''
  }

  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    let interval
    if (reading) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [reading])

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  const handleCategoryClick = (category) => {
    // vocabolary dizisindeki sadece "hikaye" kategorisinde olanları filtreler
    const filteredVocabolary = vocabolary.filter(item => item.category === category);
  
    if (filteredVocabolary.length > 0) {
      setSelectedCategory(filteredVocabolary); // Kategori güncellenir
      console.log(filteredVocabolary)

    } else {
      console.log("Hikaye kategorisinde bir sonuç bulunamadı.");
    }
  };

  const handleSpeed = (speed) => {
    console.log(speed);
    setSelectedPr((prev) => ({
        ...prev, // Önceki durumu koru
        speed: speed
    }));
}
 
const handleText = (name) => {
    console.log(name)
      const filteredVocabolary = vocabolary.find(item => item.name === name); // find ile ilk bulduğu elemanı alıyoruz
      if (filteredVocabolary) {
        setText(filteredVocabolary.text)
          setSelectedPr({
              name: filteredVocabolary.name,
              text: filteredVocabolary.text,
              speed: selectedPr.speed // Mevcut hızı koruyun
          });
      }
  }
  
  return (
    <div>
      <header className="w-full flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">Hızlı Okuma Testi</h1>
      </header>
      <div className="flex p-4  mt-12">
        <div className="w-3/4 p-4 border h-96 overflow-y-scroll flex-row justify-center items-center rounded-xl shadow-xl">
          <p className="text-center font-bold text-xl">{title}</p>
          <p className="text-lg ">{text}</p>
        </div>
        <div className="w-76 p-4 h-60 border flex flex-col items-start rounded-xl shadow-xl absolute right-4">
          <p>Kelime Sayısı: {wordCount}</p>
          <p>Okumaya Başlama Saati: {formatTime(startTime)}</p>
          {endTime && <p>Okumayı Bitirme Saati: {formatTime(endTime)}</p>}
          <p>Geçen Süre: {formatElapsedTime(elapsedTime)}</p>
          <div className="mt-4">
            {!reading ? (
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-400"
              >
                Okumaya Başla
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-400"
              >
                Okumayı Bitir
              </button>
            )}
          </div>
          {endTime && (
            <div className="mt-4">
              <p>Okuma Hızınız: {readingSpeed.toFixed(2)} kelime/dakika</p>
              {teaseMessage && <p className="text-red-500">{teaseMessage}</p>}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="fixed inset-x-0 bottom-0">
        <footer className="w-full flex justify-center items-center p-4 bg-blue-300">
          <span className="text-white font-semibold">
            © 2024 Eleven. Tüm hakları saklıdır.
          </span>
        </footer>
      </div>
      {!isStart && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 ">
              <div className="bg-gray-300 p-8 rounded-md  w-4/5 h-4/5">
                <h2 className="font-semibold text-3xl p-1 text-center">
                  Egzersiz Ayarla
                </h2>
  
                <div className=''>
                  <h3 className='text-xl '>Kategoriler</h3>
                  <div>
                <p onClick={() => handleCategoryClick('hikaye')} className="cursor-pointer">
                  Hikaye
                </p>
                <p onClick={() => handleCategoryClick('roman')} className="cursor-pointer">
                  Roman
                </p>
                <p onClick={() => handleCategoryClick('makale')} className="cursor-pointer">
                  Makale
                </p>
                <p onClick={() => handleCategoryClick('resim')} className="cursor-pointer">
                  Resim
                </p>
              </div>
              <div>
    {selectedCategory && (
      <ul>
        {selectedCategory.map((item, index) => (
          <li onClick={()=>handleText(item.name)} key={index}>{item.name}</li>
        ))}
      </ul>
    )}
  </div>
  <div>
        <label htmlFor="speed">Hızı ayarla</label>
        <input
          type="text"
          name="speed"
          onChange={(e) => {
            handleSpeed(e.target.value); // handleSpeed fonksiyonuna değeri geçir
          }}
        />
      </div>
              </div>
  
  
              <button
  className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
  onClick={handleStart} // handleStart fonksiyonu ekranı kapatacak
>
  Devam
</button>

              </div>
            </div>
      )}
    </div>
  )
}

export default FastRead
