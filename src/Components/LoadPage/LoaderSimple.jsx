import React from 'react'

const LoaderSimple = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-x-2">
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-blue"
          role="status"
        ></div>
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-purple"
          role="status"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-success"
          role="status"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-danger"
          role="status"
          style={{ animationDelay: '0.3s' }}
        ></div>
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-warning"
          role="status"
          style={{ animationDelay: '0.4s' }}
        ></div>
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-info"
          role="status"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_1s_linear_infinite] rounded-full bg-current text-neutral-100"
          role="status"
          style={{ animationDelay: '0.6s' }}
        ></div>
        <div className="flex justify-center items-center pt-4 animate-pulse">
          <span className="text-xl font-semibold">Yükleniyor...</span>
        </div>
      </div>
    </div>
  )
}

export default LoaderSimple
