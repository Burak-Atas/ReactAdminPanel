import React, { useState, useEffect, useRef } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playCongrulationSound } from '../../effect/Congrulation'
import { ImageList } from '../../constants/differentpictureimage'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Header from '../Header'
import Footer from '../Footer'
import { CircleCheckBig, CircleX } from 'lucide-react'

const DifferentPicture = ({ dayNumber }) => {
  const exerciseName = 'different-picture'
  const [imageList, setImageList] = useState([])
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  const handleConfirm = () => {
    setIsConfirmed(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          day: dayNumber,
          token: token,
          exerciseName: exerciseName,
        }

        const response = await exerciseService.getExerciseData(data)

        if (response.status === 200) {
          setImageList(ImageList[response.data[0].day[dayNumber - 1]])
          setIsLoading(false)
        } else {
          console.error(response.data)
        }
      } catch (error) {
        console.error('İstek hatası:', error.response.data.error)
      }
    }
    fetchData()
  }, [])


  const [correctCount, setCorrectCount] = useState(0)
  const [passCount, setPassCount] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isStart, setIsStart] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef(null)


  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        dayNumber: dayNumber,
        name: exerciseName,
        time: elapsedSeconds,
        correct: correctCount,
        incorrect: passCount,
      };
      const response = await exerciseService.setExerciseOver(data);
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error("İstek hatası:", error.response.data.error);
    }
  };

  useEffect(() => {
    if (isFinish) {
      exerciseOver();
    }
  }, [passCount, correctCount, isFinish]);

  
  const handleStart = () => {
    setIsStart(true)
    setCurrentImageIndex(0)
    setSelectedImageIndex(null)
    setIsCorrect(null)
  }
  useEffect(() => {
    if (isStart && !isFinish) {
      const timer = setInterval(() => {
        setElapsedSeconds((prevTime) => prevTime + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStart, isFinish])
  const handleImageClick = (index) => {
    setSelectedImageIndex(index)
  }
  const handlePass = () => {
    // Pas butonuna basıldığında passCount değerini artır
    setPassCount((prevCount) => prevCount + 1)
    passToNext()
  }
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }
  const checkResponse = () => {
    const correctIndex = imageList[currentImageIndex].correctIndex

    if (selectedImageIndex === correctIndex) {
      setIsCorrect(true)
      setCorrectCount((prevCount) => prevCount + 1)
      playCorrectSound()
    } else {
      setIsCorrect(false)
      // Yanlış cevap verildiğinde passCount değerini artır
      setPassCount((prevCount) => prevCount + 1)
      playInCorrectSound()
    }

    // Cevap kontrolünden sonra bir sonraki nesneye geç
    setTimeout(() => {
      passToNext()
    }, 1000) // 1 saniye bekleyerek geçiş yap
  }

  const passToNext = () => {
    setSelectedImageIndex(null) // Seçili resmi sıfırla
    setIsCorrect(null) // Yanlış veya doğru mesajı olmadan önce isCorrect durumunu sıfırla

    // Bir sonraki resme geç
    if (currentImageIndex === imageList.length - 1) {
      setIsFinish(true)
      playCongrulationSound()
    } else {
      setCurrentImageIndex((prevIndex) => prevIndex + 1)
    }
  }

  const renderImage = (image, index) => {
    const isSelected = selectedImageIndex === index
    const isCorrectOption = index === imageList[currentImageIndex].correctIndex
    const borderColor = isSelected
      ? 'border-blue-500'
      : isCorrectOption
      ? 'border-green-500'
      : 'border-red-500'
    const imageClasses = `w-1/4 p-2 cursor-pointer hover:border-2 ${borderColor}`

    return (
      <img
        key={index}
        src={image}
        alt={imageList[currentImageIndex].describing}
        className={imageClasses}
        onClick={() => handleImageClick(index)}
        style={{ border: isSelected ? '2px solid blue' : 'none' }}
      />
    )
  }

  const restartExercise = () => {
    setCurrentImageIndex(0)
    setSelectedImageIndex(null)
    setIsCorrect(null)
    setCorrectCount(0)
    setPassCount(0)
    setIsFinish(false)
    setElapsedSeconds(0)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden">
      <Header title={'Hangisi Farklı'} />
      <div className="absolute top-0 bg-white right-0 mt-16 mr-8 p-4 w-40 flex flex-col justify-center items-center border-2 border-b-gray-100 rounded-md text-lg font-semibold">
        <div className="flex-col p-2 justify-center items-center">
          <span className="flex gap-2 items-center">
            <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
            {correctCount}
          </span>
        </div>
        <div>
          <span className="flex gap-2 items-center">
            <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
            {passCount}
          </span>{' '}
        </div>
        <div className="p-2">Süre: {formatTime(elapsedSeconds)}</div>
      </div>
      <div className="h-full bg-blue-200 ml-0 mr-0  mt-0 flex flex-col items-center justify-center">
        <div className="bg-white h-1/3 w-1/2 rounded-xl mb-44">
          <div className="flex justify-around items-center m-3 pt-16">
            {Object.values(imageList[currentImageIndex])
              .slice(0, 4)
              .map((image, index) => renderImage(image, index))}
          </div>
          <div className="flex justify-center items-center mt-40 ">
            <label className="text-2xl font-bold bg-white p-2   rounded-xl">
              {imageList[currentImageIndex].describing}
            </label>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePass}
            className="bg-blue-300 text-xl text-white py-3 px-6 rounded-xl hover:bg-red-300"
          >
            Pas
          </button>
          <button
            onClick={checkResponse}
            className="bg-green-400 text-xl text-white py-4 px-6 rounded-xl hover:bg-green-300"
          >
            Kontrol Et
          </button>
        </div>
      </div>

      <Footer />
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Hangisi Farklı Egzersizi
            </h2>
            <p className="pb-2">Terimle alakasız olan resmi seçme egzersizi.</p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStart}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div>
          <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
            <div
              className="bg-white p-8 rounded-md text-center"
              style={{ width: '300px' }}
            >
              <p style={{ fontSize: '20px' }}>
                Tebrikler! Egzersizi tamamladınız.
              </p>
              <p>Doğru: {correctCount}</p>
              <p>Pas: {passCount}</p>
              <p>Geçen Süre:{formatTime(elapsedSeconds)}</p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={restartExercise}
              >
                Tekrar
              </button>
              <div>
                <button
                  onClick={handleReturnDashboard}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Anasayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isCorrect !== null && (
        <div className="fixed inset-0 flex items-center justify-center">
          <span
            className={`text-custom-6xl font-bold animate-ping animate-once ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect ? 'Doğru!' : 'Yanlış!'}
          </span>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default DifferentPicture
