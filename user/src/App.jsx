import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './sass.scss'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Carousel from './components/Carousel'
import Categories from './components/Categories'
import BestSeller from './components/BestSeller'
import Balance4 from './components/Balance4'
import NewLaunches from './components/NewLaunches'
import SpiruSwasthaTabs from './components/SpiruSwasthaTabs'
import SuperFood from './components/SuperFood'
import Blog from './components/Blog'
import SubscribeEmail from './components/SubscribeEmail'
import Footer from './components/Footer'
import Transformation from './components/Transformation'
import Copyright from './components/Copyright'
import Test from './components/Test'
import Wishlist from './components/Whishlist'
import { WishlistProvider } from './components/WhishlistContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Collection from './components/Collection'
import ImmunityPage from './components/Test'
// import ViewCart from './components/ViewCart'
import ProductDetails from './components/ProductDetails'
import Checkout from './components/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './components/Cart'
import Dashboard from './components/Dashboard'
import OrderHistory from './components/OrderHistory'
import { ToastContainer } from 'react-toastify'
import AddressComponent from './components/AddressComponent'

function App() {
const user = JSON.parse(localStorage.getItem('userData'))
console.log(user)
  return (
    <>
      <WishlistProvider>
        <BrowserRouter>
          <Header />
          <Navbar />
          <Routes>
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/collection" element={<Collection />} >
             <Route path=':category' />
             </Route>
            <Route path="/products" element={<ProductDetails />} >
             <Route path=':product' />
             </Route>
             <Route path='/view-cart' element={<Cart />} />
             <Route path='/checkout' element={<Checkout />} />
             <Route path='/login' element={<Login />} />
             <Route path='/signup' element={<Signup />} />
             <Route path='/dashboard' element={<Dashboard />} />
             <Route path='/order-history' element={<OrderHistory userId={user?._id}/>} />
             <Route path='/address' element={<AddressComponent userId={user?._id}/>} />

            <Route
              path="/"
              element={
                <>
                  <Carousel />
                  <Categories />
                  <BestSeller />
                  <Transformation />
                  <Balance4 />
                  <NewLaunches openCart={() => setIsCartOpen(true)} />
                  <SpiruSwasthaTabs />
                  <SuperFood />
                  <Blog />
                  <SubscribeEmail />
                </>
              }
            />
          </Routes>
          <Footer />
          <Copyright />
        </BrowserRouter>
      </WishlistProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
