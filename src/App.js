import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './Pages/Dashboard';
import User from './Pages/User';
import Communications from './Pages/Communications';
import Videos from './Pages/Videos';
import Profile from './Pages/Profile';
import Calendar from './Components/Calender';
import Educations from './Pages/Educations';
import LoginPage from './Pages/LoginPage';
import Activate from './Pages/Activate';
import GenerateCertificate from './Pages/GenerateCertificate';
import Report from './Pages/Report';
import PasswordChange from './Pages/PasswordChange';
import StudentReport from './Pages/StudentReport';
import Exercises from './Pages/Exercises';
import Navbar from './Components/Navbar';
import ExercisesLevel from './Pages/ExercisesLevel';
import IsEqual from './Components/Exercises/IsEqual';
import FastRead from './Components/Exercises/FastRead';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex w-full">
      {location.pathname !== '/login' && ( // Eğer login sayfasında değilse Navbar gösterilir
        <div className="w-1/5">
          <Navbar />
        </div>
      )}
      <div className={location.pathname !== '/login' ? "w-4/5" : "w-full"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<StudentReport />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/certificate" element={<GenerateCertificate />} />
          <Route path="/report" element={<Report />} />
          <Route path="/password-change" element={<PasswordChange />} />
          <Route path="/users" element={<User />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/education" element={<Educations />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/education/:id" element={<ExercisesLevel />} />
          <Route path="/education/:id/isequal" element={<IsEqual />} />
          <Route path="/education/:id/fastread" element={<FastRead />} />


        </Routes>
      </div>
    </div>
  );
}

export default App;
