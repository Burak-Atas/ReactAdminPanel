import React, { useState, useEffect } from 'react'
import image from '../../assets/EyeYogaHorizontal.png'
import Footer from '../Footer'
import Header from '../Header'
import { playCongrulationSound } from '../../effect/Congrulation'
import FinishScreen from '../FinishScreen'
import StartScreen from '../StartScreen'
import ExerciseService from '../../services/ExerciseService'
import LoaderSimple from '../LoadPage/LoaderSimple'
import FullscreenAlert from '../LoadPage/FullscreenAlert'

const EyeYogaHorizontal = ({dayNumber}) => {
  const positions1 = [
    { top: '10%', left: '0%' },
    { bottom: '10%', left: '0%' },
    { bottom: '10%', right: '0%' },

    { top: '10%', right: '0%' },
  ]
  const positions2 = [
    { top: '10%', left: '0%' },
    { top: '50%', left: '0%' },
    { bottom: '10%', left: '0%' },
    { bottom: '10%', left: '50%' },
    { bottom: '10%', right: '0%' },
    { top: '50%', right: '0%' },
    { top: '10%', right: '0%' },
    { top: '10%', left: '50%' },
  ]
  const positions3 = [
    {
      top: '10%',
      left: '0%',
    },
    { top: '10%', right: '0%' },
    { bottom: '10%', left: '0%' },
    { bottom: '10%', right: '0%' },
  ]
  const positions4 = [
    { top: '10%', left: '0%' },
    { top: '50%', left: '50%' },
    { bottom: '10%', right: '0%' },
    { top: '10%', right: '0%' },
    { top: '50%', left: '50%' },
    { bottom: '10%', left: '0%' },
  ]
  const positions6 = [
    { top: '10%', left: '0%' }, // Üstten başla, sol başlangıç
    { bottom: '10%', left: '0%' }, // Alttan başla, sol başlangıç
    { top: '10%', left: '5%' }, // Üstten başla, sol %5
    { bottom: '10%', left: '5%' }, // Alttan başla, sol %5
    { top: '10%', left: '10%' }, // Üstten başla, sol %10
    { bottom: '10%', left: '10%' }, // Alttan başla, sol %10
    { top: '10%', left: '15%' }, // Üstten başla, sol %15
    { bottom: '10%', left: '15%' }, // Alttan başla, sol %15
    { top: '10%', left: '20%' }, // Üstten başla, sol %20
    { bottom: '10%', left: '20%' }, // Alttan başla, sol %20
    { top: '10%', left: '25%' }, // Üstten başla, sol %25
    { bottom: '10%', left: '25%' }, // Alttan başla, sol %25
    { top: '10%', left: '30%' }, // Üstten başla, sol %30
    { bottom: '10%', left: '30%' }, // Alttan başla, sol %30
    { top: '10%', left: '35%' }, // Üstten başla, sol %35
    { bottom: '10%', left: '35%' }, // Alttan başla, sol %35
    { top: '10%', left: '40%' }, // Üstten başla, sol %40
    { bottom: '10%', left: '40%' }, // Alttan başla, sol %40
    { top: '10%', left: '45%' }, // Üstten başla, sol %45
    { bottom: '10%', left: '45%' }, // Alttan başla, sol %45
    { top: '10%', left: '50%' }, // Üstten başla, sol %50
    { bottom: '10%', left: '50%' }, // Alttan başla, sol %50
    { top: '10%', left: '55%' }, // Üstten başla, sol %55
    { bottom: '10%', left: '55%' }, // Alttan başla, sol %55
    { top: '10%', left: '60%' }, // Üstten başla, sol %60
    { bottom: '10%', left: '60%' }, // Alttan başla, sol %60
    { top: '10%', left: '65%' }, // Üstten başla, sol %65
    { bottom: '10%', left: '65%' }, // Alttan başla, sol %65
    { top: '10%', left: '70%' }, // Üstten başla, sol %70
    { bottom: '10%', left: '70%' }, // Alttan başla, sol %70
    { top: '10%', left: '75%' }, // Üstten başla, sol %75
    { bottom: '10%', left: '75%' }, // Alttan başla, sol %75
    { top: '10%', left: '80%' }, // Üstten başla, sol %80
    { bottom: '10%', left: '80%' }, // Alttan başla, sol %80
    { top: '10%', left: '85%' }, // Üstten başla, sol %85
    { bottom: '10%', left: '85%' }, // Alttan başla, sol %85
    { top: '10%', left: '90%' }, // Üstten başla, sol %90
    { bottom: '10%', left: '90%' }, // Alttan başla, sol %90
    { top: '10%', left: '95%' }, // Üstten başla, sol %95
    { bottom: '10%', left: '95%' }, // Alttan başla, sol %95
  ]
  const positions5 = [
    { top: '10%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '10%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '20%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '20%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '30%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '30%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '40%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '40%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '50%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '50%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '60%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '60%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '70%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '70%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '80%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '80%', right: '0%' }, // Üstten başla, sol başlangıç
    { top: '87%', left: '0%' }, // Üstten başla, sol başlangıç
    { top: '87%', right: '0%' }, // Üstten başla, sol başlangıç
  ]

  const exerciseName = "eye-yoga-horizontal"
  const [positionIndex, setPositionIndex] = useState(0)
  const [speed, setSpeed] = useState(500)
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [level, setLevel] = useState(1)
  const [isLevelChanging, setIsLevelChanging] = useState(false) // Level değişimi kontrolü
  const [totalExerciseTime, setTotalExerciseTime] = useState(10);

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
          setTotalExerciseTime(response.data[0].exercise_time[dayNumber-1]);
          setSpeed(response.data[0].speed[dayNumber-1]);
          setLevel(response.data[0].level[dayNumber-1])

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

  // Her level için süre (saniye cinsinden)
  const levelDuration = totalExerciseTime / 6

  const getCurrentPositions = () => {
    switch (level) {
      case 1:
        return positions1
      case 2:
        return positions2
      case 3:
        return positions3
      case 4:
        return positions4
      case 5:
        return positions5
      case 6:
        return positions6
      default:
        return positions1
    }
  }

  useEffect(() => {
    let timer
    if (isStart && !isLevelChanging) {
      // Level değişimi sırasında durdur
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + speed / 1000)
        setPositionIndex(
          (prevIndex) => (prevIndex + 1) % getCurrentPositions().length
        )

        // Level değişimi kontrolü
        if (elapsedTime >= levelDuration * level) {
          if (level < 6) {
            setIsLevelChanging(true) // Level değişimi başlıyor
            setTimeout(() => {
              // 1 saniye bekle
              setLevel((prevLevel) => prevLevel + 1)
              setPositionIndex(0) // Level'ın ilk pozisyonuna sıfırla
              setIsLevelChanging(false) // Level değişimi bitti
            }, 1000) // 1 saniye bekleme
          } else {
            // Tüm leveller tamamlandı
            setIsFinish(true)
            exerciseOver();
            playCongrulationSound()
            setIsStart(false)
          }
        }
      }, speed)
    }
    return () => clearInterval(timer)
  }, [isStart, speed, level, elapsedTime, isLevelChanging]) // isLevelChanging eklendi

  const handleStart = () => {
    setIsStart(true)
  }

  const repeatExercise = () => {
    setIsFinish(false)
    setIsStart(true)
    setElapsedTime(0)
    setPositionIndex(0)
    setLevel(1) // Level'ı başlangıç değerine sıfırla
  }

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel)
    repeatExercise()
  }


  const handleReturnDashboard = () => {
    window.location.href = `/day${day}`
  }

  if (isLoading) {
    return <LoaderSimple />
  }

  return (
    <div>
      <div className={`${isFinish ? 'hidden' : ''}`}>
        {isStart && !isFinish && (
          <div>
            <img
              key={positionIndex}
              src={image} // "image" değişkenini tanımlamanız gerekiyor
              style={{
                ...getCurrentPositions()[positionIndex],
                width: '80px',
                height: '80px',
                margin: '10px',
                position: 'absolute',
                transition: 'left 0.3s ease-linear',
              }}
              alt=""
            />
            <Header title="Göz Yogası" />
            <Footer />
          </div>
        )}
        {!isStart && (
          <StartScreen
            onStart={handleStart}
            title="Göz Yogası"
            explanation="Ekranda olan çıkacak resmi kafanızı hareket ettirmeden sadece gözleriniz ile takip edin."
            onLevelChange={handleLevelChange}
          />
        )}
      </div>
      {isFinish && <FinishScreen onRestart={repeatExercise} />}
      <FullscreenAlert onConfirm={handleConfirm} />
    </div>
  )
}

export default EyeYogaHorizontal
