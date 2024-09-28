import { useState, useEffect } from 'react'
import { playCongrulationSound } from '../../effect/Congrulation'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const LetterComplete = ({ dayNumber }) => {
  const exerciseName = 'letter-complete'
  const [letters, setLetters] = useState(['A'])
  const [isStart, setIsStart] = useState(false)
  const [words, setWords] = useState(['MANTA'])
  const [isFinish, setIsFinish] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)

  // Aşamaların sürelerini tutan dizi (saniye cinsinden)
  const phaseDurations = [600, 300] // Örnek: 1. aşama 60 saniye, 2. aşama 10 saniye

  const [timer, setTimer] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0) // Başlangıç aşaması 0. index

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
          setLetters(response.data[0].letters[dayNumber - 1])
          setWords(response.data[0].words[dayNumber - 1])
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
        time: timer,
        correct: 0,
        incorrect: 0,
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

  const restartExercise = () => {
    setTimer(0)
    setCurrentPhase(0)
    setIsFinish(false)
    setCompletedWords([])
    setScore(0)
    setSelectedLetters([])
  }

  const [isChecking, setIsChecking] = useState(false)

  const [completedWords, setCompletedWords] = useState([])
  const [score, setScore] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState([])

  const selectLetter = (letter) => {
    setSelectedLetters([...selectedLetters, letter])
  }

  const clearSelectedLetters = () => {
    setSelectedLetters([])
  }

  const renderSelectedLetters = () => {
    return selectedLetters.map((item, index) => {
      const { letter, color } =
        typeof item === 'object' ? item : { letter: item, color: 'blue' }
      return (
        <div
          key={index}
          className={`m-1 p-2 rounded-full h-14 w-14 flex justify-center items-center text-white text-lg cursor-pointer ${
            color === 'red'
              ? 'bg-red-500'
              : color === 'green'
              ? 'bg-green-500'
              : 'bg-blue-300'
          }`}
        >
          {letter}
        </div>
      )
    })
  }

  const handleClear = () => {
    clearSelectedLetters()
  }

  useEffect(() => {
    let interval = null

    if (isStart && !isFinish) {
      const totalDuration = phaseDurations.reduce(
        (sum, duration) => sum + duration,
        0
      ) // Toplam süreyi hesapla

      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)

        // Toplam geçen süreyi kontrol et
        if (timer >= totalDuration) {
          setIsFinish(true)

          // Süre dolduğunda eksik kelimeleri tamamla
          words.forEach((word) => {
            if (!completedWords.includes(word)) {
              setCompletedWords((prevCompletedWords) => [
                ...prevCompletedWords,
                word,
              ])
            }
          })

          if (isFirst) {
            exerciseOver()
          }
          setIsFirst(false)
        } else {
          // Geçerli aşamanın sonuna gelip gelmediğimizi kontrol et
          let elapsedTime = 0
          for (let i = 0; i <= currentPhase; i++) {
            elapsedTime += phaseDurations[i]
          }
          if (timer >= elapsedTime) {
            setCurrentPhase(currentPhase + 1)
          }
        }
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isStart, timer, isFinish, currentPhase])

  useEffect(() => {
    if (completedWords.length === words.length && isStart) {
      setIsFinish(true)
      playCongrulationSound()

      if (isFirst) {
        exerciseOver()
      }
      setIsFirst(false)
    }
  }, [completedWords, words.length, isStart])

  const handleStart = () => {
    setIsStart(true)
  }

  const formatTime = () => {
    const seconds = timer % 60
    const minutes = Math.floor(timer / 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  const maxLength = Math.max(...words.map((word) => word.length))

  const handleLetterClick = (letter) => {
    if (selectedLetters.length < maxLength) {
      setSelectedLetters([...selectedLetters, letter])
    }
  }

  const renderLetters = () => {
    return letters.map((letter, index) => (
      <div
        key={index}
        className="bg-blue-300 m-1 p-2 rounded-full h-14 w-14 flex justify-center items-center text-white text-lg cursor-pointer hover:bg-blue-200"
        onClick={() => handleLetterClick(letter)}
      >
        {letter}
      </div>
    ))
  }

  const renderGroupedWords = () => {
    return Object.entries(groupedWords).map(([length, words]) => (
      <div key={length} className="flex flex-col items-center">
        {words.map((word) => (
          <div key={word} className="flex">
            {renderWordBlocks(word)}
          </div>
        ))}
      </div>
    ))
  }

  const renderWordBlocks = (word) => {
    return word.split('').map((letter, index) => (
      <div
        key={index}
        className={`bg-blue-300 mt-0.5 mr-0.5 p-1 h-10 w-9 flex justify-center items-center rounded text-white text-sm  ${
          completedWords.includes(word) ? 'bg-green-400' : ''
        }`}
      >
        {completedWords.includes(word) ? letter : ''}
      </div>
    ))
  }

  const groupedWords = words.reduce((acc, word) => {
    const length = word.length
    if (!acc[length]) {
      acc[length] = []
    }
    acc[length].push(word)
    return acc
  }, {})

  const [wordStatus, setWordStatus] = useState({})

  const updateWordStatus = (word, status) => {
    setWordStatus({ ...wordStatus, [word]: status })
  }

  const handleCheck = () => {
    if (!isChecking) {
      setIsChecking(true)
      const selectedWord = selectedLetters.join('')
      if (words.includes(selectedWord)) {
        playCorrectSound()
        setSelectedLetters(
          selectedLetters.map((letter) => ({ letter, color: 'green' }))
        )
        setTimeout(() => {
          setCompletedWords([...completedWords, selectedWord])
          updateWordStatus(selectedWord, true)
          setScore((prevScore) => prevScore + 100)
          clearSelectedLetters()
          setIsChecking(false)
        }, 1000)
      } else {
        playInCorrectSound()
        setSelectedLetters(
          selectedLetters.map((letter) => ({ letter, color: 'red' }))
        )
        setTimeout(() => {
          clearSelectedLetters()
          setIsChecking(false)
        }, 1000)
      }
    }
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div className="h-screen flex flex-col py-6 ">
      <header className="w-full fixed top-0 flex justify-center items-center p-1 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white"> Kelime Türetme</h1>
      </header>

      <div className="  flex-grow flex flex-col justify-between bg-blue-200  mt-7  overflow-auto relative ">
        <div className="absolute top-0 right-0 m-4 flex space-x-4">
          <span className=" flex justify-center text-lg font-semibold rounded-xl bg-blue-300 p-1 text-white w-32">
            Puan: {score}
          </span>
          <span className=" flex  justify-center text-lg w-16 font-semibold rounded-xl bg-blue-300 p-1 text-white">
            {formatTime()}
          </span>
        </div>
        <div className="flex justify-center space-x-6 mt-4 w-full ">
          {renderGroupedWords()}
        </div>
        <div className="flex justify-center mt-2">{renderLetters()}</div>
        <div className="flex justify-center mt-2 h-16">
          {renderSelectedLetters()}
        </div>
        <div className=" flex justify-center  mb-16">
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-300 text-white py-2 px-4  rounded-xl hover:bg-red-300"
              onClick={handleClear}
            >
              Temizle
            </button>
            <button
              className="bg-green-400 text-white py-4 px-8   flex justify-center items-center rounded-xl hover:bg-green-300"
              onClick={handleCheck}
            >
              Kontrol Et
            </button>
          </div>

          <footer className="w-full fixed bottom-0 flex justify-center items-center p-1 bg-blue-300">
            <span className="text-white font-semibold">
              © 2024 Eleven. Tüm hakları saklıdır.
            </span>
          </footer>
        </div>
      </div>
      {isFinish && (
        <div className="bg-gray-500 bg-opacity-50 flex h-screen items-center justify-center fixed inset-0">
          <div
            className="bg-white p-8 rounded-md text-center"
            style={{ width: '300px' }}
          >
            <p style={{ fontSize: '20px' }}>
              {completedWords.length === words.length && (
                <div>
                  Tebrikler! Egzersizi başarıyla tamamladınız. <br />
                  <div className="flex flex-col">
                    <span> Geçen Süre: {formatTime()} </span>
                  </div>
                </div>
              )}
            </p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={restartExercise}
            >
              Tekrar
            </button>
            <button
              onClick={handleReturnDashboard}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      )}
      {!isStart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">
              Kelime Türetme Egzersizi
            </h2>
            <p className="pb-2">
              Verilen harfler ile kelimeleri türetin. <br />
              Süre sınırı olmadan en iyi puanınızı elde etmeye çalışın.
            </p>
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

export default LetterComplete
