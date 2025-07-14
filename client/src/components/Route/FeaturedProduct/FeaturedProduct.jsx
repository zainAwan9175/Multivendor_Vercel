
import React from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
 const { allProducts } = useSelector((state) => state.product);



  return (
    <div className="bg-white rounded-xl shadow p-8 mb-12">
      <div className="w-full flex items-center justify-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold font-[Poppins] text-emerald-700 drop-shadow-lg tracking-wide">
          Featured <span className="text-amber-500">Products</span>
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {allProducts && allProducts.length !== 0 && (
          <>
            {allProducts &&
              allProducts.slice(0, 4).map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
