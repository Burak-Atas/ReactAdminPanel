import React, { useState, useEffect } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import { CircleCheckBig, CircleX } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'

const Takistoskop = ({ dayNumber }) => {
  const exerciseName = 'takistoskop'
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [words, setWords] = useState([''])
  const [visibilityTime, setVisibilityTime] = useState(0)
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
          setWords(response.data[0].words[dayNumber - 1])
          setVisibilityTime(response.data[0].time[dayNumber - 1]);
          setIsRandomMode(response.data[0].random[dayNumber - 1]);
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

  
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [typedWord, setTypedWord] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [isUnCorrect, setIsUnCorrect] = useState(null)
  const [showText, setShowText] = useState(false)
  const [showInputArea, setShowInputArea] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [isBorder, setIsBorder] = useState(false)
  const [isGame, setIsGame] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [incorrectAnswer, setIncorrectAnswer] = useState(0)
  const [isRandomMode, setIsRandomMode] = useState(true) // Yeni state: isRandomMode

  const exerciseOver = async () => {
    try {
      const data = {
        token: token,
        dayNumber: dayNumber,
        name: exerciseName,
        time: 0,
        correct: correctAnswer,
        incorrect: incorrectAnswer,
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
    if (isFinish) {
      exerciseOver();
    }
  }, [isFinish, correctAnswer, incorrectAnswer]);

  const borderSos = () => {
    setIsBorder(true)
    setTimeout(() => {
      setIsBorder(false)
      setTimeout(() => {
        setIsBorder(true)
        setTimeout(() => {
          setIsBorder(false)
          setTimeout(() => {
            setShowText(true)
            setTimeout(() => {
              setShowText(false)
              setShowInputArea(true)
            }, visibilityTime)
          }, 200)
        }, 200)
      }, 200)
    }, 200)
  }

  const handleNewGame = () => {
    setShowInputArea(false)
    setIsCorrect(null)
    setIsUnCorrect(null)
    borderSos()
    setIsGame(true)
  }

  const handleStart = () => {
    setIsStart(true)
  }

  const handleInputChange = (event) => {
    setTypedWord(event.target.value.toLowerCase())
  }

  const handleRestart = () => {
    // Reset all game-related states
    setCurrentWordIndex(0)
    setTypedWord('')
    setIsCorrect(null)
    setIsUnCorrect(null)
    setShowInputArea(false)
    setIsGame(false)
    setIsFinish(false)
    setCorrectAnswer(0)
  }

  const handleAnswerCheck = () => {
    if (words[currentWordIndex] === typedWord) {
      playCorrectSound()
      setIsCorrect(true)
      setCorrectAnswer(correctAnswer + 1)
      console.log('Cevap Doğru')
    } else {
      playInCorrectSound()
      setIsUnCorrect(true)
      setIncorrectAnswer(incorrectAnswer + 1)
      console.log('Cevap Yanlış')
    }
    setShowInputArea(false)
    setIsGame(false)
    setCurrentWordIndex(currentWordIndex + 1)
    setTypedWord('')

    if (currentWordIndex === words.length - 1) {
      playCongrulationSound()
      setIsFinish(true)
    }
  }

  useEffect(() => {
    if (isRandomMode && showText) {
      const intervalId = setInterval(() => {
        setShowText(false)
        setShowText(true)
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [isRandomMode, showText])

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen">
      <Header title={'Takistoskop'} />
      {/* Footer Kısmı*/}
      <div className="fixed inset-x-0 bottom-0">
        <Footer />
      </div>
      <div className="flex-col h-5/6  relative">
        <div className="absolute right-12 top-3 h-12 w-32 border-2  border-gray-300 bg-white flex items-center justify-center">
          <div className=" flex space-x-8">
            <span className="flex gap-2 items-center">
              <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
              {correctAnswer}
            </span>

            <span className="flex gap-2 items-center">
              <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
              {incorrectAnswer}
            </span>
          </div>
        </div>
        <div className=" h-1/4"></div>
        <div
          className={`bg-gray-300 ${isCorrect && 'bg-green-500'} ${
            isUnCorrect && 'bg-red-500'
          } w-1/2 h-1/4 m-auto flex justify-center items-center ${
            isBorder && 'border-blue-500 border-4'
          }`}
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* showText değişkenin true olduğunda metin gözükecek false olduğunda kaybolacak */}
          <div
            className="absolute"
            style={{
              left: isRandomMode ? `${Math.random() * (100 - 20)}%` : '50%',
              top: isRandomMode ? `${Math.random() * (100 - 20)}%` : '50%',
              transform: 'translate(-50%, -50%)',
              padding: '2px', // Merkezden hizalamak için
            }}
          >
            {showText && <div>{words[currentWordIndex]}</div>}
          </div>
        </div>

        <div className="w-1/2 h-1/4 m-auto flex justify-center items-center">
          {/* Bu alan metin görünüp kaybolduktan sonra gözükmesi ve sonrasında yeni oyun başladığında yeniden kaybolması için */}
          {showInputArea && (
            <div className="flex-col bg-gray-300 w-10/12 h-3/4 flex justify-center items-center">
              <label className="mb-3" htmlFor="">
                Gördüğünüz Kelimeyi Yazınız
              </label>
              <input
                className="w-10/12 focus:outline-none text-center rounded-sm"
                type="text"
                placeholder="Buraya yazı yazın"
                value={typedWord}
                onChange={handleInputChange}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleAnswerCheck()
                  }
                }}
              />
              <button
                className="bg-blue-400 text-xl hover:bg-blue text-white py-2 px-4 mt-4 rounded"
                onClick={handleAnswerCheck}
              >
                Tamam
              </button>
            </div>
          )}
          {!isGame && (
            <button
              className="bg-blue-300 text-white text-xl py-2 px-4 mt-2 rounded hover:bg-blue-200"
              onClick={handleNewGame}
            >
              Devam
            </button>
          )}
        </div>
        <div className="h-1/4 flex items-center justify-center">
          {/* Bu alan, isGame false ise gözükecek, true ise kaybolacak (yani buton) */}
        </div>
      </div>
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center">
            <h1 className="font-semibold text-2xl p-1">
              Takistoskop Egzersizi
            </h1>
            <p>
              Bu egzersiz ile göz çevikliğiniz artacak ve gözün gördüğü kelimeyi
              daha hızlı olarak beyne aktarabilecek. Ortada yada rastgele
              beliren kelimeleri algılayıp yazmalısın
            </p>
            <button
              className="bg-blue-400 text-xl text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={handleStart}
            >
              Başla
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Alıştırmayı tamamladınız!</p>
            <p>Doğru: {correctAnswer}</p>
            <p>Yanlış: {incorrectAnswer}</p>
            <div>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                onClick={handleRestart} // Call handleRestart to reset the game
              >
                Tekrarla
              </button>
            </div>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
              onClick={handleReturnDashboard}
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default Takistoskop
