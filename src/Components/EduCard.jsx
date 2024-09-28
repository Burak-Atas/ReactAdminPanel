import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const EduCard = ({ title, href }) => {
  const location = useLocation() // Mevcut URL'yi almak için useLocation kullanıyoruz.

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
      <Link
        to={`${location.pathname}${href}`} // Mevcut URL'yi alıp sonuna href ekliyoruz.
        className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-blue-400 dark:border-blue-400 dark:hover:bg-blue-500"
      >
        <img src="" alt="" />
        <h5 className="mb-2 text-2xl items-center flex justify-center font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      </Link>
    </div>
  )
}

export default EduCard
