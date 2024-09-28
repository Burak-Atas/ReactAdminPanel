import React, { useState, useEffect } from 'react'
import { playStepSound } from '../../effect/Step'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import Footer from '../Footer'
import Header from '../Header'

const Grouping = ({ dayNumber }) => {
  const exerciseName = 'grouping'
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [splitValue, setSplitValue] = useState(1)
  const [wordsPerLine, setWordsPerLine] = useState(9)
  const [linesPerPage] = useState(10)
  const [splittedPages, setSplittedPages] = useState([])
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [showIndex, setShowIndex] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [stepSpeed, setStepSpeed] = useState(100)
  const [currentPage, setCurrentPage] = useState(0)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [exerciseSpeed, setExerciseSpeed] = useState(600)

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
          setText(response.data[0].texts[dayNumber - 1].text)
          setTitle(response.data[0].texts[dayNumber - 1].title)
          setSplitValue(response.data[0].split_value[dayNumber - 1])
          setExerciseSpeed(response.data[0].speed[dayNumber - 1])
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

  const splitTextByLine = (text, wordsPerLine) => {
    const words = text.split(' ')
    const lines = []
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '))
    }
    return lines
  }

  const splitLineBySplitValue = (line, splitValue) => {
    const words = line.split(' ')
    const groups = []
    for (let i = 0; i < words.length; i += splitValue) {
      groups.push(words.slice(i, i + splitValue).join(' '))
    }
    return groups
  }

  const screenStart = () => {
    setIsStart(true)
  }

  const startTimer = () => {
    setIsRunning(true)
    setShowIndex(0)
  }

  const resetAndStartExercise = () => {
    setTimer({ minutes: 0, seconds: 0 })
    setShowIndex(0)
    setIsFinish(false)
    setCurrentPage(0)
  }

  // Metni satırlara, kelime gruplarına ve sayfalara ayırma
  useEffect(() => {
    const lines = splitTextByLine(text, wordsPerLine)
    const pages = []
    for (let i = 0; i < lines.length; i += linesPerPage) {
      pages.push(
        lines
          .slice(i, i + linesPerPage)
          .map((line) => splitLineBySplitValue(line, splitValue))
      )
    }
    setSplittedPages(pages)
  }, [text, wordsPerLine, splitValue, linesPerPage])

  useEffect(() => {
    let timerInterval
    let exerciseInterval

    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          const seconds = prevTimer.seconds === 59 ? 0 : prevTimer.seconds + 1
          const minutes =
            prevTimer.seconds === 59 ? prevTimer.minutes + 1 : prevTimer.minutes
          return { minutes, seconds }
        })
      }, 1000)

      exerciseInterval = setInterval(() => {
        setShowIndex((prevIndex) => {
          const currentPageLength = splittedPages[currentPage].flat().length
          const nextIndex = prevIndex + 1

          if (nextIndex >= currentPageLength) {
            if (currentPage < splittedPages.length - 1) {
              setCurrentPage(currentPage + 1)
              return 0 // Yeni sayfaya geç
            } else {
              setIsFinish(true) // Son sayfadaysa bitir
              setIsRunning(false) // Interval'i durdur
              return prevIndex // Son kelimede kal
            }
          } else {
            return nextIndex
          }
        })
      }, exerciseSpeed)
    }

    return () => {
      clearInterval(timerInterval)
      clearInterval(exerciseInterval)
    }
  }, [isRunning, splittedPages, exerciseSpeed, currentPage])

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="absolute top-0 w-full">
        <Header title={'Okunan Yazı'} />
      </div>
      <div className=" fixed top-32 m-2 p-2 rounded-xl  font-semibold text-2xl text-center">
        {title}
      </div>
      <div className="absolute top-20 right-8 bg-blue-300 rounded-md p-1 text-white text-xl flex justify-center items-center w-20 h-12">
        <h1>
          {timer.minutes.toString().padStart(2, '0')}:
          {timer.seconds.toString().padStart(2, '0')}
        </h1>
      </div>

      <div className="w-full max-w-3xl h-3/4 mt-60 px-6 text-xl text-left overflow-auto transition-all duration-500 ease-in-out">
        {splittedPages[currentPage].map((line, lineIndex) => (
          <div key={lineIndex} className="flex justify-start">
            {line.map((group, groupIndex) => (
              <span
                className="border-2 border-blue-300 text-black mx-1"
                key={groupIndex}
                style={{
                  transitionDelay: `${groupIndex * 0.0004}s`,
                  opacity:
                    showIndex >=
                    splittedPages[currentPage].slice(0, lineIndex).flat()
                      .length +
                      groupIndex
                      ? 1
                      : 0,
                }}
              >
                {group}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div
        id="start-div"
        className={`bg-blue-300 m-2 fixed bottom-20 text-white rounded-lg px-3 py-2 text-lg hover:bg-blue-200 shadow-2xl ${
          isRunning ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <button className="text-lg" onClick={startTimer} disabled={isRunning}>
          Başla
        </button>
      </div>

      <Footer />

      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-full max-w-lg mx-4">
            <h2 className="font-semibold text-2xl p-1">Gruplama Egzersizi</h2>
            <p className="pb-2">
              Metnin gruplanan kelime gruplarını başınızı oynatmadan takip
              ediniz.
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={screenStart}
            >
              Devam
            </button>
          </div>
        </div>
      )}

      {isFinish && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-8 rounded-md text-center w-full max-w-lg mx-4">
            <p>Alıştırma bitti!</p>
            <div className="flex flex-col items-center">
              <button
                onClick={handleReturnDashboard}
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded w-40 hover:bg-blue-300 "
              >
                Ana Sayfaya Dön
              </button>
              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded w-40 hover:bg-blue-300"
                onClick={resetAndStartExercise}
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

export default Grouping
