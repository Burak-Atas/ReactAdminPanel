import React, { useState, useEffect } from 'react'
import { playStepSound } from '../../effect/Step'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const BlockRead = ({ dayNumber }) => {
  const exerciseName = 'blockread'
  const [paragraph, setParagraph] = useState(
    'Yemyeşil çimenlerin üzerinde rengarenk çiçekler açıyordu. Kuşlar melodilerini özgürce ötüyordu, gökyüzü masmaviydi. Rüzgar hafifçe esiyor, ağaçların dalları nazikçe sallanıyordu. Doğanın güzellikleri insanı huzura götürüyordu, ruhu dinlendiriyordu.'
  )
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showWord, setShowWord] = useState(false)
  const [wordCountToShow, setWordCountToShow] = useState(1)
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [speed, setSpeed] = useState(100) // Hız ayarını buradan yapabilirsiniz

  const [isLoading, setIsLoading] = useState(true)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)

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
          setParagraph(response.data[0].paragraph[dayNumber - 1])
          setWordCountToShow(response.data[0].word_count_to_show[dayNumber - 1])
          setSpeed(response.data[0].speed[dayNumber - 1])
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

  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        dayNumber: dayNumber,
        name: exerciseName,
        time: 0,
        correct: 0,
        incorrect: 0,
      }
      const response = await exerciseService.setExerciseOver(data)
      if (response.status === 200) {
        console.log(response.data)
      } else {
        console.error(response.data)
      }
    } catch (error) {
      console.error('İstek hatası:', error.response.data.error)
    }
  }

  useEffect(() => {
    setWords(splitParagraphIntoWords(paragraph))
  }, [paragraph])

  useEffect(() => {
    if (showWord) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex + wordCountToShow >= words.length) {
            setShowWord(false)
            setIsFinish(true)
            if (isFirst) {
              exerciseOver()
            }
            setIsFirst(false)
            playCongrulationSound()
            return 0
          }
          return prevIndex + wordCountToShow
        })
      }, speed) // Gecikme süresi dinamik hale getirildi

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, words, showWord, wordCountToShow, speed])

  useEffect(() => {
    if (showWord && currentIndex > -1) {
      playStepSound()
    }
  }, [currentIndex, showWord])

  const splitParagraphIntoWords = (paragraph) => {
    return paragraph.split(' ')
  }

  const handleButtonClick = () => {
    setShowWord(true)
  }

  const handleRepeatExercise = () => {
    setIsFinish(false)
    setShowWord(false)
    setCurrentIndex(0)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <header className="w-full fixed top-0 flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">
          Blok Okuma Egzersizi
        </h1>
      </header>
      <div className="absolute top-0 mt-8"></div>
      <div className="bg-gray-300 flex justify-center w-2/3 h-2/3 m-2">
        <div className=" bg-white flex justify-center w-2/3 m-4 items-center">
          {showWord && (
            <p style={{ textAlign: 'center', fontSize: '25px' }}>
              {words
                .slice(currentIndex, currentIndex + wordCountToShow)
                .join(' ')}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center w-1/12  rounded-full mt-4 ">
        <button
          onClick={handleButtonClick}
          className="p-2 bg-blue-400 text-white rounded-xl text-base hover:bg-blue-300"
          disabled={showWord}
        >
          Başla
        </button>
      </div>

      <footer className="w-full fixed bottom-0 flex justify-center items-center p-4 bg-blue-300">
        <span className="text-white font-semibold">
          ©️ 2024 Eleven. Tüm hakları saklıdır.
        </span>
      </footer>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Blok Okuma Egzersizi</h2>
            <p className="pb-2">
              Alan içinde kelimeler blok halinde gözükmektedir belli bir zaman
              içerisinde bloklar kayar kelimeleri takip edin.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={() => setIsStart(true)}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Alıştırmayı tamamlandınız.</p>
            <button
              onClick={handleReturnDashboard}
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                onClick={handleRepeatExercise}
              >
                Tekrarla
              </button>
            </div>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default BlockRead
