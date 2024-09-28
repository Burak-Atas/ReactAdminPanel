import React from 'react'
import EduCard from '../Components/EduCard'
const Educations = () => {
  return (
    <div className="h-full w-full">
      <div className="h-32 flex items-center">
        <header className="text-3xl font-semibold">EĞİTİMLER</header>
      </div>
      <div className="flex flex-wrap justify-between mt-24">
        <EduCard title={'1.Seviye Egzersizleri'} href={'/seviye-1'} />
        <EduCard title={'2.Seviye Egzersizleri'} href={'/seviye-2'} />
        <EduCard title={'3.Seviye Egzersizleri'} href={'/seviye-3'} />
        <EduCard title={'Body Code Egzersizi'} href={'/body_code'} />
        <EduCard title={'Kelime Hazinesi Egzersizi'} href={'/kelime_hazinesi'} />
      </div>
    </div>
  )
}

export default Educations
