import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage'
import Dashboard from './pages/DashboardPage';
import Home from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
