import React, { useState, useEffect, useRef } from 'react'
import { CircleCheck, CircleX, CircleCheckBig } from 'lucide-react'
import CountdownAnimation from '../../animation/CountdownAnimation'
import { playCorrectSound } from '../../effect/Correct'
import { playInCorrectSound } from '../../effect/Incorrect'
import { playCongrulationSound } from '../../effect/Congrulation'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'
import VocabolaryServices from '../../Services/VocabolaryServices'
import { useParams } from 'react-router-dom'

const IsEqual = ({ dayNumber }) => {
  const exerciseName = 'isequal'
  const [isLoading, setIsLoading] = useState(true)
  const [point, setPoint] = useState(0)
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [correctNum, setCorrectNum] = useState(0)
  const [incorrectNum, setIncorrectNum] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)

  const [problems, setProblems] = useState([]) // Başlangıçta boş bir dizi olarak ayarlayın

  const token = window.localStorage.getItem('token')
  const day = window.localStorage.getItem('day')
  const [isFirst, setIsFirst] = useState(true)
  const timerId = useRef(null)

  const { id,exercise_name } = useParams(); // URL'den id parametresini al


  const [vocabolary,setVocabolary] = useState({});


  const [selectedCategory, setSelectedCategory] = useState('');
  const handleCategoryClick = (category) => {
    // vocabolary dizisindeki sadece "hikaye" kategorisinde olanları filtreler
    const filteredVocabolary = vocabolary.filter(item => item.category === category);
  
    if (filteredVocabolary.length > 0) {
      setSelectedCategory(filteredVocabolary); // Kategori güncellenir
      console.log(filteredVocabolary)

    } else {
      console.log("Hikaye kategorisinde bir sonuç bulunamadı.");
    }
  };

  
  const [selectedPr, setSelectedPr] = useState({"name": "", "text": "text", "speed": 0});

const handleText = (name) => {
  console.log(name)
    const filteredVocabolary = vocabolary.find(item => item.name === name); // find ile ilk bulduğu elemanı alıyoruz
    if (filteredVocabolary) {
        setSelectedPr({
            name: filteredVocabolary.name,
            text: filteredVocabolary.text,
            speed: selectedPr.speed // Mevcut hızı koruyun
        });
    }
}

const handleSpeed = (speed) => {
    console.log(speed);
    setSelectedPr((prev) => ({
        ...prev, // Önceki durumu koru
        speed: speed
    }));
}


  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  const vocabolaryservices = new VocabolaryServices()

  useEffect(() => {
   vocabolaryservices.getVocabolary()
   .then((response)=>{
      console.log(response.data)
      setVocabolary(response.data)
   })
   .catch((error)=>{
    
   })
  }, [])

  const exerciseOver = async () => {
    
  }
  useEffect(() => {
    if (isFinish) {
      exerciseOver()
    }
  }, [correctNum, incorrectNum, isFinish])

  const handleStart = () => {
    setShowCountdown(true)
    setTimeout(() => {
      setIsStart(true)
      setShowCountdown(false)
      timerId.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    }, 4000)
  }

  const getRandomOperation = () => {
    const unusedProblems = problems.filter((problem) => !problem.used)

    if (unusedProblems.length === 0) {
      console.log('Tüm soruları kullandınız!')
      setIsFinish(true)
      playCongrulationSound()
      return null
    }

    const randomIndex = Math.floor(Math.random() * unusedProblems.length)
    const newProblems = [...problems]
    const problem = unusedProblems[randomIndex]

    problem.used = true
    newProblems.splice(newProblems.indexOf(problem), 1, problem)

    setProblems(newProblems)
    return problem
  }

  useEffect(() => {
    if (isStart) {
      setCurrentProblem(getRandomOperation())
    }
  }, [isStart])

  useEffect(() => {
    if (isFinish && timerId.current) {
      clearInterval(timerId.current)
      timerId.current = null
    }
  }, [isFinish])

  const handleAnswer = (isCorrect) => {
    if (!currentProblem) {
      return
    }

    if (isCorrect === currentProblem.isTrue) {
      setPoint(point + 10)
      setCorrectNum(correctNum + 1)
      setIsCorrectAnswer(true)
      playCorrectSound()
    } else {
      setIncorrectNum(incorrectNum + 1)
      setIsCorrectAnswer(false)
      playInCorrectSound()
    }
    setIsTransitioning(true)
    setTimeout(() => {
      setIsCorrectAnswer(null)
      setIsTransitioning(false)
      setCurrentProblem(getRandomOperation())
    }, 1000)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`
  }

  const restartExercise = () => {
    // Tüm durumları sıfırla
    setIsFinish(false)
    setElapsedTime(0)
    setPoint(0)
    setCurrentProblemIndex(0)
    setIncorrectNum(0)
    setCorrectNum(0)
    setIsStart(false)
    setShowCountdown(false)

    // Soruları tekrar kullanılabilir hale getirin
    setProblems(problems.map((problem) => ({ ...problem, used: false })))

    // Yeni bir problem seti çekin
    const fetchData = async () => {

    }
    fetchData()
  }

  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }


  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed top-24 right-4 flex items-center justify-center bg-blue-300 p-2 rounded-xl text-white w-40 h-12">
        <div className="flex justify-center items-center w-full h-full">
          {formatTime(elapsedTime)}
        </div>
      </div>
      <div className="flex-col p-2 fixed top-36 right-16 border border-gray-300 mt-2 w-20 flex justify-center items-center">
        <span className="flex gap-2 items-center">
          <CircleCheckBig size={20} color="#14cb1f" strokeWidth={1.75} />
          {correctNum}
        </span>
        <span className="flex gap-2  items-center">
          <CircleX size={20} strokeWidth={1.75} color="#ff0000" />
          {incorrectNum}
        </span>
      </div>
      <div className="flex justify-center items-center my-auto h-full">
        <div className="w-full h-1/2 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            {currentProblem && (
              <div
                className={`mb-8 flex justify-center items-center rounded-xl p-3 ${
                  isCorrectAnswer === true
                    ? 'bg-green-400'
                    : isCorrectAnswer === false
                    ? 'bg-red-400'
                    : 'bg-white'
                }`}
              >
                <span className="text-9xl ">{currentProblem.operation}</span>
                <span className="text-9xl pl-24 ">{currentProblem.answer}</span>
              </div>
            )}
            <div className="flex items-center gap-x-20 mt-16">
              {!showCountdown && (
                <>
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={isTransitioning}
                  >
                    <CircleCheck size={100} color="#1cc819" strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={isTransitioning}
                  >
                    <CircleX size={100} color="#ff0000" strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {isFinish && (
          <div className="bg-gray-500 bg-opacity-50 flex items-center justify-center fixed inset-0">
            <div
              className="bg-white p-8 rounded-md text-center"
              style={{ width: '300px' }}
            >
              <p style={{ fontSize: '20px' }}>
                Tebrikler! Egzersizi tamamladınız.
              </p>
              <div className="border-2 rounded-xl">
                <p>Doğru: {correctNum}</p>
                <p>Yanlış: {incorrectNum}</p>
                <p>Geçen Süre: {formatTime(elapsedTime)}</p>
              </div>
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
        {!isStart && !isFinish && !showCountdown && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 ">
            <div className="bg-gray-300 p-8 rounded-md  w-4/5 h-4/5">
              <h2 className="font-semibold text-3xl p-1 text-center">
                Egzersiz Ayarla
              </h2>

              <div className=''>
                <h3 className='text-xl '>Kategoriler</h3>
                <div>
              <p onClick={() => handleCategoryClick('hikaye')} className="cursor-pointer">
                Hikaye
              </p>
              <p onClick={() => handleCategoryClick('roman')} className="cursor-pointer">
                Roman
              </p>
              <p onClick={() => handleCategoryClick('makale')} className="cursor-pointer">
                Makale
              </p>
              <p onClick={() => handleCategoryClick('resim')} className="cursor-pointer">
                Resim
              </p>
            </div>
            <div>
  {selectedCategory && (
    <ul>
      {selectedCategory.map((item, index) => (
        <li onClick={()=>handleText(item.name)} key={index}>{item.name}</li>
      ))}
    </ul>
  )}
</div>
<div>
      <label htmlFor="speed">Hızı ayarla</label>
      <input
        type="text"
        name="speed"
        onChange={(e) => {
          handleSpeed(e.target.value); // handleSpeed fonksiyonuna değeri geçir
        }}
      />
    </div>
            </div>


              <button
                className="bg-blue-400 text-white py-2 px-4 mt-4 rounded hover:bg-blue-300"
                onClick={handleStart}
              >
                Devam
              </button>
            </div>
          </div>
        )}
        {showCountdown && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
            <CountdownAnimation />
          </div>
        )}
      </div>
    </div>
  )
}

export default IsEqual
