import React, { useState, useEffect, useRef } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import StartScreen from '../StartScreen'
import Footer from '../Footer'
import Header from '../Header'

const Follow = ({ dayNumber }) => {
  const exerciseName = 'follow'
  const [isLoading, setIsLoading] = useState(true)
  const [isFinish, setIsFinish] = useState(false)
  const [exerciseStarted, setExerciseStarted] = useState(false)
  const [text, setText] = useState('')
  const words = text.split(' ')
  const [index, setIndex] = useState(0)
  const [timerSpeed, setTimerSpeed] = useState(null)
  const [isStart, setIsStart] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // Sayfa numarası için state
  const [title, setTitle] = useState('')
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFirst, setIsFirst] = useState(true)

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
          setText(response.data[0].text[dayNumber - 1])
          setTimerSpeed(response.data[0].speed[dayNumber - 1])
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

  const handleStart = () => {
    setIsStart(true)
  }

  useEffect(() => {
    let timer
    if (!isFinish && exerciseStarted) {
      timer = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = prevIndex + 1
          // Her sayfa için kelime sayısı (örnek: 8 satır * 12 kelime)
          const wordsPerPage = 8 * 12

          // Sadece çizgi mevcut sayfayı geçerse sayfa değiştirilsin
          if (
            Math.floor(newIndex / wordsPerPage) >
            Math.floor(prevIndex / wordsPerPage)
          ) {
            setCurrentPage((prevPage) => prevPage + 1)
          }

          if (newIndex < words.length) {
            return newIndex
          } else {
            clearInterval(timer)
            setIsFinish(true)
            if (isFirst) {
              exerciseOver()
            }
            setIsFirst(false)
            playCongrulationSound()
            return words.length
          }
        })
      }, timerSpeed)
    }
    return () => clearInterval(timer)
  }, [isFinish, timerSpeed, words.length, exerciseStarted])
  const startExercise = () => {
    setExerciseStarted(true)
  }

  const stopExercise = () => {
    setExerciseStarted(false)
  }

  const restartExercise = () => {
    setIndex(0)
    setIsFinish(false)
    //(true)
    setCurrentPage(0)
    setExerciseStarted(false)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  // Her sayfada gösterilecek satır sayısı
  const linesPerPage = 8
  // Her satırda gösterilecek kelime sayısı
  const wordsPerLine = 12

  // Metni satırlara böl
  const lines = text
    .split(' ')
    .reduce((acc, word, i) => {
      const lineIndex = Math.floor(i / wordsPerLine)
      if (!acc[lineIndex]) {
        acc[lineIndex] = []
      }
      acc[lineIndex].push(word)
      return acc
    }, [])
    .map((line) => line.join(' '))

  // Satırları sayfalara böl
  const pages = lines.reduce((acc, line, i) => {
    const pageIndex = Math.floor(i / linesPerPage)
    if (!acc[pageIndex]) {
      acc[pageIndex] = []
    }
    acc[pageIndex].push(line)
    return acc
  }, [])

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="w-full absolute top-0">
        <Header title={'İzleyici'} />
      </div>
      <div className="absolute top-24 font-semibold text-xl shadow-xl p-3 rounded-xl">
        {title}
      </div>

      <div className="m-6 h-3/4 w-3/4 flex justify-center items-center border-4 overflow-auto">
        <div className="inline-block max-w-5xl text-xl break-words  relative">
          {pages[currentPage].map((line, lineIndex) => {
            const absoluteLineIndex = currentPage * linesPerPage + lineIndex
            return (
              <div
                key={lineIndex}
                id={`line-${absoluteLineIndex}`}
                className="relative mb-4"
              >
                {line.split(' ').map((word, wordIndex) => {
                  const absoluteIndex =
                    absoluteLineIndex * wordsPerLine + wordIndex
                  return (
                    <span
                      key={wordIndex}
                      className={`word mr-1 ${
                        absoluteIndex <= index ? 'underline-red' : ''
                      }`}
                    >
                      {word}
                    </span>
                  )
                })}
                {absoluteLineIndex === Math.floor(index / wordsPerLine) && (
                  <div
                    className="absolute left-0 bottom-0 h-1 bg-red-500"
                    style={{
                      width: (() => {
                        const wordElements = document.querySelectorAll(
                          `#line-${absoluteLineIndex} .word`
                        )
                        let totalWidth = 0
                        for (
                          let i = 0;
                          i <= index % wordsPerLine && i < wordElements.length;
                          i++
                        ) {
                          const wordWidth =
                            wordElements[i].getBoundingClientRect().width
                          if (i === index % wordsPerLine) {
                            totalWidth += wordWidth / 2 + 5
                          } else {
                            totalWidth += wordWidth + 5
                          }
                        }
                        return `${totalWidth}px`
                      })(),
                      transition: 'width 0.1s linear',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-2">
        {exerciseStarted ? (
          <button
            onClick={stopExercise}
            className="bg-red-300 text-white p-2 text-xl mb-3 rounded-xl hover:bg-red-300"
          >
            Durdur
          </button>
        ) : (
          <button
            onClick={startExercise}
            className="bg-blue-300 text-white p-2 text-xl mb-3 rounded-xl hover:bg-blue-300"
          >
            Başla
          </button>
        )}
        {exerciseStarted && (
          <button
            onClick={restartExercise}
            className="bg-blue-300 text-white p-2 text-xl mb-3 rounded-xl ml-2 hover:bg-blue-300"
          >
            Yeniden Başlat
          </button>
        )}
      </div>
      <Footer />
      {!isStart && (
        <StartScreen
          title="İzleyici"
          explanation={
            'Metin içinde kelimeleri egzersizle beraber sizde takip edin.'
          }
          onStart={handleStart}
        />
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Alıştırma bitti!</p>
            <button
              onClick={handleReturnDashboard}
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
            <div>
              <button
                onClick={restartExercise}
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
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

export default Follow
