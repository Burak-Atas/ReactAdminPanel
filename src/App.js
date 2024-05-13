import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import User from './Pages/User';
import Comminications from './Pages/Comminications';
import Videos from './Pages/Videos';
import Profile from './Pages/Profile';

function App() {
  return (
    <div className="App">
      <div className='flex w-full'>
        <div className='w-1/5'>
      <Navbar/></div>
        <div className='w-4/5  p-5'>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path='/analyze' element={<Dashboard />} />

            <Route path='/users' element={<User />} />
            <Route path='/Videos' element={<Videos />} />
            <Route path='/comminications' element={<Comminications />} />

            <Route path='/profil' element={<Profile />} />



          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
