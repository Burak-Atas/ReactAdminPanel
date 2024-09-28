import React, { useState, useEffect } from 'react'
import { playCountSound } from '../effect/Count'

const CountdownAnimation = () => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000)
      playCountSound()
    }
  }, [count])
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`text-9xl  font-bold ${count > 0 ? 'animate-bounce' : ''}`}
      >
        {count || 'Başla!'}
      </div>
    </div>
  )
}

export default CountdownAnimation
