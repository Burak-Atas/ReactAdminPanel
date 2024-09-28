import React, { useState, useEffect } from 'react'

const BodyCode = () => {
  const [step, setStep] = useState(0)
  const [bodyParts, setBodyParts] = useState({
    Head: { high: false, hidden: false, right: false, left: false },
    'Right-Arm': { high: false, hidden: false },
    'Left-Arm': { high: false, hidden: false },
    'Right-Leg': { high: false, hidden: false },
    'Left-Leg': { high: false, hidden: false },
  })

  const [isStarted, setIsStarted] = useState(false)
  const [isStartScreen, setIsstartScreen] = useState(false)
  const [currentMatrixCell, setCurrentMatrixCell] = useState([0, 0])

  const startScreen = () => {
    setIsstartScreen(true)
  }
  const exerciseSteps = [
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: false },
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true },
      'Right-Arm': { high: false, hidden: false },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: true, hidden: false },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: false }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: false },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: true, hidden: false }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: false },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: true, hidden: false },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: true, hidden: false }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: false }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: false },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: true, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: false },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: false }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: false },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: false },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: true },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: true },
      'Right-Leg': { high: false, hidden: true },
    },
    {
      Head: { high: false, hidden: false, right: false, left: false },
      'Left-Arm': { high: false, hidden: true }, // high: true olarak ayarlandı
      'Right-Arm': { high: false, hidden: true },
      'Left-Leg': { high: false, hidden: false },
      'Right-Leg': { high: false, hidden: false },
    },
  ]

  useEffect(() => {
    let interval
    if (isStarted && step < exerciseSteps.length) {
      interval = setTimeout(() => {
        setBodyParts(exerciseSteps[step])
        setStep((prevStep) => prevStep + 1)
      }, 1000)
    }
    return () => clearTimeout(interval)
  }, [step, isStarted])

  const handleStart = () => {
    setIsStarted(true)
    setStep(0)
  }

  return (
    <div className="overflow-hidden h-screen">
      {/* Header */}
      <header className="w-full fixed top-0 flex justify-center items-center p-4 bg-blue-300">
        <h1 className="text-3xl font-semibold text-white">Body Code</h1>
      </header>

      {/* Body Figure */}
      <div className="flex justify-center items-center h-3/4">
        <div className="relative">
          {/* Head */}
          <div
            className={`absolute -top-16 w-16 h-16 border-4 border-black rounded-full flex justify-center items-center transition-transform duration-300
${bodyParts.Head.hidden ? 'hidden' : ''}
              ${bodyParts.Head.left ? 'animate-headLeft' : ''}
              ${bodyParts.Head.right ? 'animate-headRight' : ''}
              ${
                !bodyParts.Head.left && !bodyParts.Head.right
                  ? 'left-1/2 transform -translate-x-1/2'
                  : ''
              }
            `}
          >
            <div className="relative w-full h-full flex justify-center items-center">
              <div className="absolute top-3 left-3 w-3 h-3 border-4 border-black rounded-full"></div>
              <div className="absolute top-3 right-3 w-3 h-3 border-4 border-black rounded-full"></div>
              <div className="absolute bottom-3 w-8 h-2 border-b-4 border-black rounded-b-full"></div>
            </div>
          </div>

          {/* Body */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-32 border-4 border-black"></div>

          {/* Left Arm */}
          <div
            className={`absolute left-1/2 transform -translate-x-8  w-2 h-6 border-4 border-black transition-all duration-500
              ${bodyParts['Left-Arm'].hidden ? 'hidden' : ''}
              ${bodyParts['Left-Arm'].high ? 'top-2' : 'top-7'}
            `}
          ></div>

          {/* Right Arm */}
          <div
            className={`absolute left-1/2 transform translate-x-6  w-2 h-6 border-4 border-black transition-all duration-500
              ${bodyParts['Right-Arm'].hidden ? 'hidden' : ''}
              ${bodyParts['Right-Arm'].high ? 'top-2 ' : 'top-7'}
            `}
          ></div>

          {/* Left Leg */}
          <div
            className={`absolute left-1/2 transform -translate-x-8 w-6 h-6 border-4 border-black transition-all duration-500
              ${bodyParts['Left-Leg'].hidden ? 'hidden' : ''}
              ${bodyParts['Left-Leg'].high ? 'top-24' : 'top-32'}`}
          ></div>

          {/* Right Leg */}
          <div
            className={`absolute left-1/2 transform translate-x-2 w-6 h-6 border-4 border-black transition-all duration-500
              ${bodyParts['Right-Leg'].hidden ? 'hidden' : ''}
              ${bodyParts['Right-Leg'].high ? 'top-24' : 'top-32'}`}
          ></div>
        </div>
      </div>
      <div className="flex justify-center">
        {/* Start Button */}
        <button
          onClick={handleStart}
          className=" 2 px-4 py-2 bg-green-500 text-white text-xl rounded-xl mt-8 hover:bg-green-400"
        >
          Başla
        </button>
      </div>
      {/* Footer */}

      <div className="fixed inset-x-0 bottom-0">
        <footer className="w-full flex justify-center items-center p-4 bg-blue-300">
          <span className="text-white font-semibold">
            © 2024 Eleven. Tüm hakları saklıdır.
          </span>
        </footer>
      </div>
      {!isStartScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-gray-300 p-8 rounded-md text-center w-1/3">
            <h2 className="font-semibold text-2xl p-1">Body Code Egzersizi</h2>
            <p className="pb-2">
              Ekranda gösterilen hareketleri sizde kendinizle beraber yapın
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
    </div>
  )
}

export default BodyCode
