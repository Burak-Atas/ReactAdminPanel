import React, { useState, useEffect } from 'react'
import '../../App.css'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playCongrulationSound } from '../../effect/Congrulation'
import Footer from '../Footer'
import Header from '../Header'
import { CircleCheckBig, CircleX } from 'lucide-react'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'


const HintProverb = ({dayNumber}) => {

  const exerciseName = "hint-proverb";
  const [proverbs, setProverbs] = useState([]);
  const [currentProverbIndex, setCurrentProverbIndex] = useState(0)
  const [shuffledWords, setShuffledWords] = useState([])
  const [selectedWords, setSelectedWords] = useState([])
  const [remainingAttempts, setRemainingAttempts] = useState(3)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [isClickable, setIsClickable] = useState(true)
  const [isStart, setIsStart] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)


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
          setProverbs(response.data[0].proverbs[dayNumber-1]);
          setRemainingAttempts(response.data[0].attempts[dayNumber-1]);
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
    if (isStart && !isFinished) {
      const timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStart, isFinished])

  useEffect(() => {
    if (isStart) {
      shuffleWords()
    }
  }, [isStart, currentProverbIndex])

  const shuffleWords = () => {
    const words = proverbs[currentProverbIndex].split(' ')
    const shuffled = words.sort(() => 0.2 - Math.random())
    setShuffledWords(shuffled)
  }

  const handleWordClick = (word) => {
    if (!isClickable || selectedWords.includes(word)) return
    setSelectedWords((prevWords) => [...prevWords, word])
  }

  const handleCheckAnswer = () => {
    setIsClickable(false)
    const currentProverb = proverbs[currentProverbIndex]
    const isCorrect =
      selectedWords.join(' ') === currentProverb &&
      selectedWords.length === currentProverb.split(' ').length

    if (isCorrect) {
      playCorrectSound()
      setCorrectAnswers(correctAnswers + 1)
      setTimeout(() => {
        handleNextProverb()
      }, 1000)
    } else {
      playInCorrectSound()
      setRemainingAttempts((prevAttempts) => prevAttempts - 1)

      setTimeout(() => {
        setSelectedWords([])
        setIsClickable(true)
        if (remainingAttempts === 1) {
          setWrongAnswers(wrongAnswers + 1)
          handleNextProverb()
        }
      }, 1000)
    }
  }

  const handleNextProverb = () => {
    const nextIndex = currentProverbIndex + 1
    if (nextIndex < proverbs.length) {
      setCurrentProverbIndex(nextIndex)
      setSelectedWords([])
      setRemainingAttempts(3)
      setIsClickable(true)
    } else {
      setIsFinished(true)
      exerciseOver();
      playCongrulationSound()
    }
  }

  const startScreen = () => {
    setIsStart(true)
  }

  const resetExercise = () => {
    setCurrentProverbIndex(0)
    setShuffledWords([])
    setSelectedWords([])
    setRemainingAttempts(3)
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setIsClickable(true)
    setIsStart(false)
    setIsFinished(false)
    setElapsedTime(0)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden">
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-full md:w-1/2 lg:w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              İpucu Atasözü Egzersizi
            </h2>
            <p className="pb-2">
              Tabloda Kelimeler verilmiştir. Kırmızı renkte olan kelimeler
              atasözlerinin ilk kelimeleridir. Atasözlerini bulunuz. Her atasözü
              için 3 hakkınız bulunmaktadır.
            </p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={startScreen}
            >
              Devam
            </button>
          </div>
        </div>
      )}

      {isStart && (
        <div className="h-screen overflow-hidden">
          <Header title={'İpucu Atasözü'} />
          {/* Skor ve Süre Göstergesi */}
          <div className="absolute top-0 right-0 mt-16 mr-8 p-4 w-40 flex flex-col justify-center items-center border-2 border-b-gray-100 rounded-md text-lg font-semibold">
            <div className="flex-col p-2 justify-center items-center">
              <span className="flex gap-2 items-center">
                <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
                {correctAnswers}
              </span>
            </div>
            <div>
              <span className="flex gap-2 items-center">
                <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
                {wrongAnswers}
              </span>{' '}
            </div>
            <div className="p-2">Süre: {formatTime(elapsedTime)}</div>
          </div>

          <Footer />
          <div className="h-5/6 flex flex-col justify-center items-center m-4 md:m-20">
            <div className="flex gap-4 items-center mb-4 md:mb-8">
              <div className="text-lg md:text-xl font-semibold">Kalan Hak:</div>
              {[...Array(remainingAttempts)].map((_, i) => (
                <span key={i} className="text-xl md:text-2xl">
                  ❤️
                </span>
              ))}
            </div>

            <div
              className={`flex flex-wrap justify-center gap-4 md:gap-8 border-2 border-black rounded-xl p-4 md:p-8 text-lg md:text-xl font-semibold w-full md:w-5/6 text-center  items-center ${
                remainingAttempts === 0 ? 'animate-error' : ''
              }`}
            >
              {shuffledWords.map((word, index) => (
                <div
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className={`p-2 rounded-full w-auto md:w-40 text-center cursor-pointer border-2 ${
                    proverbs[currentProverbIndex].startsWith(word)
                      ? 'text-red-500'
                      : 'text-black'
                  } ${
                    selectedWords.includes(word)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isClickable
                      ? 'hover:bg-gray-200'
                      : 'cursor-not-allowed '
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center m-8 md:m-24">
              <div className="flex flex-row flex-wrap max-w-full w-full md:w-[800px] h-auto md:h-28 items-center justify-center gap-4 border-2 border-black p-4">
                {selectedWords.map((word, index) => (
                  <div
                    key={index}
                    className="p-4 md:p-7 rounded-full h-auto md:h-8 w-auto md:w-20 flex flex-col text-lg md:text-xl justify-center items-center text-center border-2 bg-gray-200"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
            {remainingAttempts > 0 && !isFinished && (
              <button
                onClick={handleCheckAnswer}
                disabled={!isClickable || selectedWords.length === 0}
                className="bg-blue-400 text-white py-2 px-4 mt-8 md:mt-20 rounded hover:bg-blue-300 disabled:opacity-50"
              >
                Kontrol Et
              </button>
            )}

            {remainingAttempts === 0 && !isFinished && (
              <div className=" flex flex-col justify-center items-center">
                <p className="text-red-500 font-semibold mt-4">
                  Yanlış Deneme! Doğru cevap:
                </p>
                <p className="text-lg font-semibold">
                  {proverbs[currentProverbIndex]}
                </p>
                <button
                  onClick={handleNextProverb}
                  className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
                >
                  Sonraki Atasözü
                </button>
              </div>
            )}
          </div>

          {isFinished && (
            <div className="bg-gray-700 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
              <div className="bg-white p-8 rounded-md text-center w-full md:w-1/2 lg:w-1/3">
                <p>Tebrikler! Alıştırmayı tamamladınız.</p>
                <p>Toplam süre: {formatTime(elapsedTime)}</p>
                <p>Doğru Cevap Sayısı: {correctAnswers}</p>
                <p>Yanlış Cevap Sayısı: {wrongAnswers}</p>
                <div>
                  <button
                    onClick={handleReturnDashboard}
                    className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                  >
                    Ana Sayfaya Dön
                  </button>
                </div>

                <button
                  className="bg-blue-400 text-white py-2 px-4 mt-4 rounded ml-4"
                  onClick={resetExercise}
                >
                  Tekrarla
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default HintProverb
