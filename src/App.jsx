import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home           from './components/Home'
import About          from './components/About'
import Auth           from './auth/Auth'
import Products       from './components/Products'
import ProductView    from './components/ProductView'
import AdminDashboard from './dashboard/AdminDashboard'
import Contact        from './components/Contact'
import Blog        from './pages/Blog'
import Cart from './pages/Cart'
import ProtectedRoute from './components/Productedroute'


function App() {
  return (
    <>
      <Routes>
        {/* Public routes — accessible without login */}
        <Route path='/'      element={<Home />}    />
        <Route path='/login' element={<Auth />}    />
        <Route path='/about' element={<About />}   />
        <Route path='/contact' element={<Contact />} />
        <Route path='/blog' element={<Blog />} />

        {/* Protected routes — redirect to /login if not logged in */}
        <Route path='/products' element={
          <ProtectedRoute><Products /></ProtectedRoute>
        } />
        <Route path='/products/:id' element={
          <ProtectedRoute><ProductView /></ProtectedRoute>
        } />
        <Route path='/cart' element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path='/dashboard' element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App