import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";


const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.product);
  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

useEffect(()=>{
    const allProductsData = allProducts ? [...allProducts] : [];
    setData(allProductsData)
},[])

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="w-full flex items-center justify-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold font-[Poppins] text-emerald-700 drop-shadow-lg tracking-wide">
            Best <span className="text-amber-500">Deals</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {data.slice(0, 4).map((item) => (
            <ProductCard data={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;