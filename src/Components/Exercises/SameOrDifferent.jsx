import React, { useState, useEffect, useRef } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playInCorrectSound } from '../../effect/Incorrect'
import LoaderSimple from '../LoadPage/LoaderSimple'
import ExerciseService from '../../services/ExerciseService'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import { CircleCheckBig, CircleX } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'

const WORD_DISPLAY_TIME = 3000 // Kelimelerin ekranda kalma süresi (ms)

const SameOrDifferent = ({ dayNumber }) => {
  const exerciseName = 'same-or-dif'
  const [isTrue, setTrue] = useState(0)
  const [isFalse, setFalse] = useState(0)
  const [arr1, setArr1] = useState([
    'erdem',
    'helva',
    'su',
    'tuzluk',
    'artmut',
    'er',
    'kiraz',
    'sucu',
    'mama',
    'diş',
  ])
  const [arr2, setArr2] = useState([
    'erdem',
    'halva',
    'su',
    'tuzluk',
    'armut',
    'ar',
    'kiraz',
    'sucuk',
    'mama',
    'dişi',
  ])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isFinish, setFinish] = useState(false)
  const [showItems, setShowItems] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [isExerciseStarted, setIsExerciseStarted] = useState(false)
  const [isMode, setIsMode] = useState('normal')
  const [wordDisplayTime, setWordDisplayTime] = useState(3000)
  const timerId = useRef(null)

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
          setArr1(response.data[0].arrays[dayNumber - 1][0])
          setArr2(response.data[0].arrays[dayNumber - 1][1])
          setIsMode(response.data[0].level[dayNumber - 1])
          setWordDisplayTime(response.data[0].word_display_time[dayNumber - 1])
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
        name: exerciseName,
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
    if (isExerciseStarted && !isFinish) {
      // Her kelime gösterildiğinde zamanlayıcıyı başlat
      timerId.current = setTimeout(() => {
        // Süre dolduğunda yanlış cevap olarak değerlendir
        playInCorrectSound()
        setFalse(isFalse + 1)
        handleNextWord()
      }, wordDisplayTime)
    }

    return () => clearTimeout(timerId.current) // Component unmount olduğunda veya state değiştiğinde zamanlayıcıyı temizle
  }, [currentWordIndex, isExerciseStarted, isFinish])

  const handleNextWord = () => {
    clearTimeout(timerId.current) // Bir sonraki kelimeye geçmeden önce mevcut zamanlayıcıyı temizle

    if (currentWordIndex < arr1.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      playCongrulationSound()
      setFinish(true)
      if (isFirst) {
        exerciseOver()
      }
      setIsFirst(false)
    }
  }

  useEffect(() => {
    if (!isExerciseStarted) return

    const handleKeyDown = (event) => {
      if (!isFinish) {
        if (event.keyCode === 37) {
          // Sol tuş
          if (arr1[currentWordIndex] === arr2[currentWordIndex]) {
            playInCorrectSound()
            setFalse(isFalse + 1)
          } else {
            playCorrectSound()
            setTrue(isTrue + 1)
          }
          handleNextWord()
        } else if (event.keyCode === 39) {
          // Sağ tuş
          if (arr1[currentWordIndex] === arr2[currentWordIndex]) {
            playCorrectSound()
            setTrue(isTrue + 1)
          } else {
            playInCorrectSound()
            setFalse(isFalse + 1)
          }
          handleNextWord()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    currentWordIndex,
    arr1,
    arr2,
    isTrue,
    isFalse,
    isFinish,
    isExerciseStarted,
  ])

  const handleStart = () => {
    setIsExerciseStarted(true)
    setShowItems(true)
  }

  const handleStartScreen = () => {
    setIsStart(true)
  }

  const handleReset = () => {
    setCurrentWordIndex(0)
    setTrue(0)
    setFalse(0)
    setFinish(false)
    setShowItems(false)
    setIsStart(false)
    setIsExerciseStarted(false)
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const getShuffledWords = (mode, word1, word2) => {
    let words
    if (mode === 'Start') {
      words = [word1, word2]
    } else if (mode === 'Normal') {
      words = [word1, word1, word2]
    } else if (mode === 'Hard') {
      words = [word1, word1, word1, word2]
    }
    return shuffleArray(words)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header title={'Aynı Farklı'} />

      <div className="m-6 h-1/2 flex justify-center items-center text-lg border-4">
        {showItems && (
          <>
            {getShuffledWords(
              isMode,
              arr1[currentWordIndex],
              arr2[currentWordIndex]
            ).map((word, index) => (
              <div key={index} className="mr-4">
                {word}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-center items-center text-xl w-96 h-60 flex-col p-2 mb-12 mt-12 mx-auto">
        <div className="flex justify-center text-black space-x-8 mb-1">
          <h5 className="border-2 font-semibold p-1 text-xl">
            {'<='} Sol Tık(Farklı)
          </h5>
          <h5 className="border-2 font-semibold p-1 text-xl">
            Sağ Tık(Aynı) {'=>'}
          </h5>
        </div>
        <div className="fixed inset-x-0 bottom-0">
          <Footer />
        </div>
        <div className="flex justify-center">
          <div>
            {!isFinish && (
              <>
                <div className="border border-gray-300 m-2 px-4">
                  <h4 className="text-black text-xl font-semibold pb-2">
                    <span className="flex gap-2 items-center">
                      <CircleCheckBig
                        size={20}
                        color="#14cb1f"
                        strokeWidth={1.75}
                      />
                      {isTrue}
                    </span>

                    {}
                  </h4>
                  <h4 className="text-black text-xl font-semibold pb-2">
                    <span className="flex gap-2 items-center">
                      <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
                      {isFalse}
                    </span>
                  </h4>
                </div>
              </>
            )}
            {isFinish && (
              <h4 className="text-green text-xl font-semibold pb-2">
                Tamamlandı!
              </h4>
            )}
          </div>
        </div>
        <div className="flex justify-center mb-8">
          {!isFinish && !isExerciseStarted && (
            <button
              className="p-1 border-2 font-semibold rounded-xl text-xl border-b-gray-300 text-black hover:bg-blue-200"
              onClick={handleStart}
            >
              Başla
            </button>
          )}
        </div>
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Aynı-Farklı Egzersizi
            </h2>
            <p className="pb-2">
              Aynı-Farklı egzersizi dikkat ve odaklanmanı geliştirmek üzerine
              bir çalışmadır. Aynı Farklı kelimeleri ayırt edip aynı ise sağ yön
              tuşuna farklı ise sol yön tuşuna basman gerekmektedir.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStartScreen}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Alıştırma bitti!</p>
            <p>Doğru Sayısı: {isTrue}</p>
            <p>Yanlış Sayısı: {isFalse}</p>

            <button
              onClick={handleReturnDashboard}
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={handleReset}
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

export default SameOrDifferent
