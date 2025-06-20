import React from 'react'
import Header from '../components/Layout/Header'
import Hero from '../components/Route/Hero/Hero'
import Categories from '../components/Route/Categories/categories'
import BestDeals from '../components/Route/BestDeals/BestDeals'
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct'
import Events from '../components/Events/Events'
import Sponsored from '../components/Route/Sponsored'
import Footer from '../components/Layout/Footer'
const HomePage = () => {
  return (
    <div>
     <Header></Header>
      <Hero></Hero>
      <Categories></Categories>
      <BestDeals></BestDeals>
      <FeaturedProduct></FeaturedProduct>
      <Events></Events>
      <Sponsored></Sponsored>
      <Footer></Footer>
    </div>
  )
}

export default HomePage