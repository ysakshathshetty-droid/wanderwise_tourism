import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Destination from './pages/Destination'
import DestinationDetails from './pages/Destinationdetails'
import Recommendations from './pages/Recommendations'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

function App() {
 

  return (
  <BrowserRouter>
  <ToastContainer position='top-center' autoClose={1500}/>
  <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path="/destination" element={<Destination/>}/>
    <Route path="/destinations/:id" element={<DestinationDetails/>} />
    <Route path='/recommendations' element={<Recommendations/>}/>
    <Route path="/dashboard"  element={<Dashboard/>}/>
    <Route path="/profile" element={<Profile/>}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App
