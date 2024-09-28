import React, { useState, useEffect, useRef } from 'react'
import { FaRegHeart } from 'react-icons/fa'
import { playCorrectSound } from '../../effect/Correct'
import { playCongrulationSound } from '../../effect/Congrulation'
import Incorrect, { playInCorrectSound } from '../../effect/Incorrect'
import { playFailSound } from '../../effect/Fail'
import Header from '../Header'
import Footer from '../Footer'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const SentenceCreate = ({ dayNumber }) => {
  const exerciseName = 'sentence-create'
  const [sentences, setSentences] = useState([''])
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
          console.log(response.data[0].sentences[dayNumber - 1])
          setSentences(response.data[0].sentences[dayNumber - 1])
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

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState(3)
  const [shuffledWords, setShuffledWords] = useState([])
  const [sentence, setSentence] = useState('')
  const [selectedWords, setSelectedWords] = useState([])
  const [selectedIndices, setSelectedIndices] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [showNextButton, setShowNextButton] = useState(false)
  const [wordBackgroundColors, setWordBackgroundColors] = useState([])
  const [isFailure, setIsFailure] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false) // Kontrol butonunun durumunu takip etmek için

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    setSentence(sentences[currentSentenceIndex])
    setSelectedWords(Array(sentence.split(' ').length).fill(''))
    setRemainingAttempts(3)
  }, [sentences, currentSentenceIndex])

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const [isStart, setIsStart] = useState(false)

  const handleStart = () => {
    setIsStart(true)
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prevSeconds) => prevSeconds + 1)
    }, 1000)
  }

  const restartExercise = () => {
    setIsFailure(false)
    setElapsedSeconds(0)
    setCurrentSentenceIndex(0)
    setSentence(sentences[0]) // Cümleyi sıfırla
    setIsFinish(false)
    resetSelectedWords()
    setWrongAnswers(0)
    setCorrectAnswers(0)
    // Karıştırılmış kelimeleri de sıfırla
    setShuffledWords(shuffleArray(sentences[0].split(' '))) // sentences[0] ilk cümleyi temsil eder

    clearInterval(timerRef.current)
    handleStart()
  }

  useEffect(() => {
    const shuffled = shuffleArray(sentence.split(' '))
    setShuffledWords(shuffled)
    setSelectedWords(Array(shuffled.length).fill(''))
    setWordBackgroundColors(Array(shuffled.length).fill(''))
  }, [sentence])

  // Sayaç kontrolü
  useEffect(() => {
    let timer = timerRef.current

    if (isStart && !isFinish) {
    } else {
      clearInterval(timer)
    }

    timerRef.current = timer

    return () => clearInterval(timer)
  }, [isStart, isFinish])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`
  }

  const handleWordClick = (index) => {
    if (selectedIndices.includes(index)) {
      return
    }

    setSelectedIndices([...selectedIndices, index])

    setSelectedWords((prevSelectedWords) => {
      const emptyIndex = prevSelectedWords.findIndex((word) => word === '')
      if (emptyIndex === -1) return prevSelectedWords

      const updatedSelectedWords = [...prevSelectedWords]
      updatedSelectedWords[emptyIndex] = shuffledWords[index]
      return updatedSelectedWords
    })
  }

  const resetSelectedWords = () => {
    setSelectedWords(Array(shuffledWords.length).fill(''))
    setSelectedIndices([])
    setErrorMessage('')
    setShowNextButton(false)
    setWordBackgroundColors(Array(shuffledWords.length).fill(''))
    setIsCheckingAnswer(false) // Kontrol butonunu tekrar aktif hale getir
  }

  const checkAnswer = () => {
    if (isCheckingAnswer) {
      return // Eğer butona zaten basılmışsa tekrar işlem yapma
    }
    setIsCheckingAnswer(true) // Kontrol butonuna basıldığını işaretle

    const selectedSentence = selectedWords.join(' ').trim()
    if (selectedSentence === sentence) {
      const correctIndices = selectedWords
        .map((word, index) =>
          word === sentence.split(' ')[index] ? index : -1
        )
        .filter((index) => index !== -1)

      const updatedWordBackgroundColors = [...wordBackgroundColors]
      correctIndices.forEach((index) => {
        updatedWordBackgroundColors[index] = 'bg-green-300'
      })

      selectedWords.forEach((word, index) => {
        if (!correctIndices.includes(index) && word !== '') {
          updatedWordBackgroundColors[index] = 'bg-red-300'
        }
      })

      setWordBackgroundColors(updatedWordBackgroundColors)
      setShowNextButton(true)

      if (currentSentenceIndex === sentences.length - 1) {
        playCongrulationSound()
        setCorrectAnswers(correctAnswers + 1)
        setIsFinish(true)
        if (isFirst) {
          exerciseOver()
        }
        setIsFirst(false)
      } else {
        setCorrectAnswers(correctAnswers + 1)
        playCorrectSound()
      }
    } else {
      setRemainingAttempts((prevAttempts) => prevAttempts - 1)

      if (remainingAttempts === 1) {
        const correctOrder = sentence.split(' ')
        setSelectedWords(correctOrder)
        setShowNextButton(true)
        setWrongAnswers(wrongAnswers + 1)

        const updatedWordBackgroundColors = correctOrder.map(() => 'bg-red-300')
        setWordBackgroundColors(updatedWordBackgroundColors)

        playFailSound()
        setErrorMessage('Maalesef yanlış. Doğru cümle bu şekildeydi.')
      } else {
        const updatedWordBackgroundColors = selectedWords.map(
          () => 'bg-red-300'
        )
        setWordBackgroundColors(updatedWordBackgroundColors)
        setErrorMessage('Maalesef yanlış. Tekrar deneyin!')
        playInCorrectSound()

        setTimeout(() => {
          resetSelectedWords()
        }, 1000)
      }
    }
  }

  const goToNextSentence = () => {
    const nextIndex = currentSentenceIndex + 1
    if (nextIndex < sentences.length) {
      setCurrentSentenceIndex(nextIndex)
      setSentence(sentences[nextIndex])
      resetSelectedWords()
      setRemainingAttempts(3)
    } else {
      setIsFinish(true)
    }
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-start">
      <div className="w-full flex justify-between items-center">
        <Header title={'Cümle Tamamlama Egzersizi'} />
        <Footer />
        <div className="fixed top-0 right-0 mt-24 mr-12  text-xl ">
          <div className="flex justify-center items-center bg-blue-300 p-1 w-64 rounded-lg ">
            <FaRegHeart className="ml-2 animate-pulse" />
            <h3 className="mx-0.5">{remainingAttempts}</h3>
            <p className="pr-2 pl-2"> | </p>
            <div className="mx-2"> {formatTime(elapsedSeconds)}</div>
            <p className="pr-2 pl-2"> | </p>
            <div className="flex gap-4">
              <span>D:{correctAnswers}</span>
              <span>Y:{wrongAnswers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full w-full bg-blue-100 flex flex-col items-center justify-center rounded-xl p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {shuffledWords.map((word, index) => (
            <div key={index} className="">
              <h1
                className={`bg-blue-300 p-3 text-xl rounded-md shadow-lg cursor-pointer ${wordBackgroundColors[index]}`}
                onClick={() => handleWordClick(index)}
              >
                {word}
              </h1>
            </div>
          ))}
        </div>

        <div className="mt-6 w-full flex justify-center">
          <h1 className="text-xl font-semibold">Cümleyi tamamla:</h1>
        </div>

        <div className="w-full flex justify-center  text-xl my-4">
          {selectedWords.map((word, index) => (
            <h2
              key={index}
              className={`selected-word bg-blue-200 p-2 mx-1 rounded-md ${wordBackgroundColors[index]}`}
              style={{ width: '200px', height: '40px', textAlign: 'center' }}
            >
              {word}
            </h2>
          ))}
        </div>

        <div className="my-4 flex justify-center">
          {!showNextButton && (
            <>
              <button
                className="bg-blue-200 hover:bg-blue-300 text-xl p-3 rounded-lg"
                onClick={checkAnswer}
                disabled={isCheckingAnswer} // Butonu kontrol işlemi sırasında devre dışı bırak
              >
                Kontrol Et
              </button>
              <button
                className="bg-blue-200 hover:bg-blue-300 p-3 text-xl rounded-lg ml-4"
                onClick={resetSelectedWords}
              >
                Sıfırla
              </button>
            </>
          )}
          {showNextButton && (
            <button
              className="bg-green-400 hover:bg-green-300 p-2 text-xl rounded-lg ml-4"
              onClick={goToNextSentence}
            >
              Sonraki Cümle
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}
      </div>

      {isFinish && (
        <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div
            className="bg-white p-8 rounded-md text-center"
            style={{ width: '300px' }}
          >
            <p style={{ fontSize: '20px' }}>
              Tebrikler! Egzersizi tamamladınız.
            </p>
            <p>Doğru: {correctAnswers}</p>
            <p>Yanlış:{wrongAnswers}</p>
            <p>Geçen Süre: {formatTime(elapsedSeconds)}</p>
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
      )}

      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Cümle Tamamlama Egzersizi
            </h2>
            <p className="pb-2">
              Verilen kelimeleri sırasıyla uygun boşluklara seçerek cümle
              oluşturunuz. Her cümle için 3 tahmin hakkınız bulunmaktadır.
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

      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default SentenceCreate
