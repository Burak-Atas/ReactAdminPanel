// Notification.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastifyAlert = ({ message, duration }) => {
  const notify = () => {
    toast(message, {
      autoClose: duration,
      className: 'toastify-custom', // Özel CSS sınıfını ekliyoruz
    });
  };

  React.useEffect(() => {
    notify();
  }, [message, duration]);

  return (
    <>
      <style jsx>{`
        .toastify-custom {
          background: linear-gradient(90deg, rgba(0, 123, 255, 1) 0%, rgba(0, 91, 255, 1) 100%);
          color: white;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;
          padding: 10px;
        }
      `}</style>
      <ToastContainer />
    </>
  );
};

export default ToastifyAlert;
