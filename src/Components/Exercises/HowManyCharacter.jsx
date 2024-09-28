import React, { useState, useEffect } from 'react'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playCongrulationSound } from '../../effect/Congrulation'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import Footer from '../Footer'
import Header from '../Header'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const HowManyCharacter = ({ dayNumber }) => {
  const exerciseName = 'howmanycharacters'
  const [inputValue, setInputValue] = useState('')
  const [randomLetters, setRandomLetters] = useState([])
  const [targetLetter, setTargetLetter] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [isStart, setIsStart] = useState(true)
  const [timer, setTimer] = useState(5)
  const [exampleCount, setExampleCount] = useState(0)
  const [difficulty, setDifficulty] = useState('normal') // Varsayılan zorluk seviyesi
  const [isConfirmed, setIsConfirmed] = useState(false)

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const exerciseService = new ExerciseService()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

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
          setTimer(response.data[0].timer[dayNumber - 1])
          setDifficulty(response.data[0].level[dayNumber - 1])
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

  const generateRandomLetters = () => {
    const letters = 'ABCÇDEFGHIJKLMNOÖPQRSTUÜVWXYZŞ'
    let result = ''

    // Rastgele iki harf seç
    const targetLetter = letters.charAt(
      Math.floor(Math.random() * letters.length)
    )
    let otherLetter = targetLetter
    while (otherLetter === targetLetter) {
      otherLetter = letters.charAt(Math.floor(Math.random() * letters.length))
    }

    // Toplam harf sayısı, zorluk seviyesine göre belirlenecek
    let totalLettersCount
    switch (difficulty) {
      case 'basic':
        totalLettersCount = 10
        break
      case 'hard':
        totalLettersCount = 15
        break
      default: // "normal" ve diğer durumlar
        totalLettersCount = 12
    }

    // Hedef harf sayısını zorluk seviyesine göre belirle
    let targetLetterCount
    switch (difficulty) {
      case 'basic':
        targetLetterCount = Math.floor(Math.random() * 4) + 1 // 1-4 arası
        break
      case 'hard':
        targetLetterCount = Math.floor(Math.random() * 6) + 6 // 6-11 arası
        break
      default: // "normal" ve diğer durumlar
        targetLetterCount = Math.floor(Math.random() * 5) + 3 // 3-7 arası
    }

    // Hedef harfleri ekle
    for (let i = 0; i < targetLetterCount; i++) {
      result += targetLetter
    }

    // Kalan harfleri diğer harfle doldur
    const remainingLettersCount = totalLettersCount - targetLetterCount
    for (let i = 0; i < remainingLettersCount; i++) {
      result += otherLetter
    }

    // Harfleri karıştır
    result = result
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')

    return { result, targetLetter }
  }

  const showRandomLetters = () => {
    const { result, targetLetter } = generateRandomLetters()
    setRandomLetters(
      result.split('').map((letter, index) => ({
        letter,
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
        id: index, // Eşsiz bir ID ekle
      }))
    )
    setTargetLetter(targetLetter)
    setTimer(5)
    setExampleCount(exampleCount + 1)
  }

  useEffect(() => {
    if (!isStart && !isFinish) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 5))
      }, 1000)

      if (exampleCount === 0) {
        showRandomLetters()
      }

      return () => clearInterval(interval)
    }
  }, [isStart, isFinish])

  useEffect(() => {
    if (timer === 0 && !isFinish) {
      showRandomLetters()
      setIncorrectCount(incorrectCount + 1)
    }
  }, [timer, isFinish])

  useEffect(() => {
    if (exampleCount === 11) {
      playCongrulationSound()
      setIsFinish(true)
      exerciseOver()
    }
  }, [exampleCount])

  const handleInputChange = (e) => {
    setInputValue(e.target.value.toUpperCase())
  }
  const handleConfirm = () => {
    setIsConfirmed(true)
  }
  const handleSubmit = () => {
    const correctAnswer = randomLetters.filter(
      (letterObj) => letterObj.letter === targetLetter
    ).length

    if (parseInt(inputValue) === correctAnswer) {
      playCorrectSound()
      setCorrectCount(correctCount + 1)
    } else {
      playInCorrectSound()
      setIncorrectCount(incorrectCount + 1)
    }

    setInputValue('')
    showRandomLetters()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleRepeatExercise = () => {
    setCorrectCount(0)
    setIncorrectCount(0)
    setExampleCount(0)
    setIsFinish(false)
    setIsStart(true)
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title={'Harf Odak'} />
      <div className="flex-grow flex flex-col justify-center items-center mt-16 mb-16">
        <div className="relative w-4/5 h-2/3 bg-gray-300 border border-gray-400 flex justify-center items-center mt-8">
          {randomLetters.map((letterObj) => (
            <div
              key={letterObj.id} // Eşsiz ID kullan
              className="absolute"
              style={{ top: letterObj.top, left: letterObj.left }}
            >
              <h1 className="text-4xl">{letterObj.letter}</h1>
            </div>
          ))}
          {!isStart && (
            <div className="absolute top-0 right-0 m-4">
              <div
                className="bg-blue-400 text-white font-bold rounded-md p-3 flex items-center justify-center"
                style={{ width: '45px', height: '45px' }}
              >
                {timer}
              </div>
            </div>
          )}
        </div>
        <div className="w-4/5 flex flex-col justify-center items-center mt-4">
          <div className="flex items-center">
            <label htmlFor="charCount" className="mr-4 text-xl">
              {targetLetter} Kaç Tane?
            </label>
            <input
              type="text"
              id="charCount"
              className="border border-gray-400 px-4 py-2 mr-4"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
            >
              Gönder
            </button>
            <div>
              <span className="text-green-500 font-bold">
                Doğru: {correctCount}
              </span>
              {' | '}
              <span className="text-red-500 font-bold">
                Yanlış: {incorrectCount}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Harf Odak</h2>
            <p className="pb-2">
              Belirtilen süre içerisinde ekranda istenen harflerin istenen yere
              yazınız
            </p>
            <p>Başlamak için butona tıklayın.</p>
            <button
              className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
              onClick={() => setIsStart(false)}
            >
              Devam
            </button>
          </div>
        </div>
      )}
      {isFinish && (
        <div className="bg-gray-300 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div className="bg-white p-8 rounded-md text-center">
            <p>Tebrikler! Egzersizi Tamamladınız.</p>
            <p>
              Doğru: {correctCount} | Yanlış: {incorrectCount}
            </p>
            <div>
              <div>
                <button
                  onClick={handleReturnDashboard}
                  className="bg-blue-400 text-white py-2 px-4 mt-4 rounded"
                >
                  Ana Sayfaya Dön
                </button>
              </div>
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
        </div>
      )}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default HowManyCharacter
