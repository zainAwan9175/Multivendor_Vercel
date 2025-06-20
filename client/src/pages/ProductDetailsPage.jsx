"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Footer from "../components/Layout/Footer"
import Header from "../components/Layout/Header"
import ProductDetails from "../components/Products/ProductDetails"
import SuggestedProduct from "../components/Products/SuggestedProduct"
import { useSelector } from "react-redux"

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.product);
   const { allEvents } = useSelector((state) => state.event);
  
 
  const { id: idParam } = useParams()

  const [data, setData] = useState(null)
  const [searchParams] = useSearchParams()
  const eventData = searchParams.get("isEvent")

  useEffect(() => {
    const id = idParam // Keep as string

    if (eventData !== null) {
      console.log("hi allevents",allEvents)
      const data = allEvents && allEvents.find((i) => String(i._id) === id)
      setData(data)
    } else {
      const data = allProducts && allProducts.find((i) => String(i._id) === id)
      setData(data)
    }
  }, [allProducts, allEvents, eventData, idParam])

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
      <Footer />
    </div>
  )
}

export default ProductDetailsPage
