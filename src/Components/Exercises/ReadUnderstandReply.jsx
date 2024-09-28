import React, { useState, useEffect } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import Header from '../Header'
import Footer from '../Footer'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const ReadUnderstandReply = ({ dayNumber }) => {
  const exerciseName = 'readunderstandreply'
  const [text, setText] = useState('')
  const [questions, setQuestions] = useState([])
  const [isStart, setIsStart] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [incorrectAnswer, setIncorrectAnswer] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [title, setTitle] = useState('')

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
          setText(response.data[0].text[dayNumber - 1])
          setQuestions(response.data[0].question[dayNumber - 1])
          setTitle(response.data[0].title[dayNumber - 1])

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
        correct: score,
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
      exerciseOver()
    }
  }, [score, incorrectAnswer, isFinish])

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...answers]
    newAnswers[index] = answer
    setAnswers(newAnswers)
  }
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }
  useEffect(() => {
    let interval = null

    if (timerActive) {
      // Sadece 'timerActive' kontrol ediliyor
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval) // 'timerActive' false olduğunda timer durduruluyor
    }

    return () => clearInterval(interval)
  }, [timerActive])
  const handleStart = () => {
    setIsStart(true)
    setTimerActive(true)
  }

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index)
  }
  const handleShowQuestion = () => {
    setShowQuestions(true)
    setTimerActive(false)
  }
  const handleSubmit = () => {
    let newScore = 0
    let incorrect = 0

    answers.forEach((answer, index) => {
      if (answer === questions[index].answer) {
        newScore++
      } else {
        incorrect++
      }
    })

    setScore(newScore)
    setIncorrectAnswer(incorrect)

    // Doğru değişken adını kontrol et

    playCongrulationSound() // Tebrik sesini çal

    setIsFinish(true) // İşlem tamamlandı olarak işaretle
  }

  const restartExercise = () => {
    setIsStart(false)
    setShowQuestions(false)
    setAnswers(Array(questions.length).fill(''))
    setCurrentQuestion(0)
    setShowResults(false)
    setScore(0)
    setIsFinish(false)
    setIncorrectAnswer(0)
    setTimeElapsed(0) // Timer sıfırlanıyor
    setTimerActive(false) // Timer durduruluyor
  }
  function splitTextIntoLines(text, wordsPerLine) {
    const words = text.split(' ')
    const lines = []
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '))
    }
    return lines
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen flex">
      {isStart && (
        <div className="flex-grow flex flex-col">
          <Header title={'Oku Anla Cevapla'} />
          <div className="flex flex-col flex-grow justify-center items-center p-4 text-xl">
            {!showQuestions && (
              <>
                <div className="text-center w-3/4 h-2/3 shadow-xl p-4 flex justify-center items-center">
                  <div className="flex flex-col">
                    <div className="text-xl font-semibold">{title}</div>
                    <div className="w-full h-special overflow-y-auto text-left pl-8">
                      {/* Metin bloğu için maksimum genişlik ve yüksekliği ayarla */}
                      {splitTextIntoLines(text, 10).map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-xl mt-4 hover:bg-green-400"
                    onClick={handleShowQuestion}
                  >
                    Okudum
                  </button>
                </div>
              </>
            )}
            {showQuestions && !showResults && (
              <div className="text-center">
                <p className="mb-4">
                  Soru: {questions[currentQuestion].question}
                </p>
                <div className="flex flex-col items-start mb-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <label key={option} className="mb-2">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={option}
                        checked={answers[currentQuestion] === option}
                        onChange={() =>
                          handleAnswerChange(currentQuestion, option)
                        }
                        className="mr-2"
                      />
                      {String.fromCharCode(97 + index)}) {option}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {showResults && (
              <div className="text-center">
                <p>
                  Toplam Skor: {score} / {questions.length}
                </p>
              </div>
            )}
          </div>
          <Footer />
        </div>
      )}
      {showQuestions && (
        <div className="w-1/8 h-2/3 absolute top-24 right-3  p-4 overflow-y-auto shadow-xl flex flex-col rounded-xl">
          <div className="flex-grow flex flex-col space-y-4">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="flex flex-col items-start  p-2">
                <div className="underline mb-4 border-black flex justify-center items-center">
                  <button
                    className="text-black"
                    onClick={() => handleQuestionClick(qIndex)}
                  >
                    {qIndex + 1}
                  </button>
                </div>
                <div className="flex space-x-2">
                  {question.options.map((option, oIndex) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name={`optik-${qIndex}`}
                        value={option}
                        checked={answers[qIndex] === option}
                        onChange={() => handleAnswerChange(qIndex, option)}
                        className="hidden"
                      />
                      <span
                        className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                          answers[qIndex] === option ? 'bg-green-300' : ''
                        }`}
                      >
                        {String.fromCharCode(97 + oIndex).toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-xl mt-4 self-center hover:bg-green-400"
              onClick={handleSubmit}
            >
              Sınavı Bitir
            </button>
          </div>
        </div>
      )}
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Oku Anla Cevapla Egzersizi
            </h2>
            <p className="pb-2">
              Oku Anla Cevapla Egzersizi sana verilen bir metini okumanı ve
              metin ile alakalı soruları cevaplamanı bekliyor metni dikkatli
              okuyup gerekli sorulara cevap vermelisin.
            </p>
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
              <p>Doğru: {score}</p>
              <p>Yanlış: {incorrectAnswer}</p>
              <p>Okuma Süresi: {formatTime(timeElapsed)}</p>
              <button
                className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                onClick={restartExercise}
              >
                Tekrar
              </button>
              <div>
                <button
                  onClick={handleReturnDashboard}
                  className="mt-4 bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                >
                  Anasayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default ReadUnderstandReply
