import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow bg-white p-6 rounded-xl`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-8 rounded-xl shadow mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="w-full h-[110px] flex items-center justify-between cursor-pointer overflow-hidden bg-white rounded-xl shadow transition-all duration-300 border-2 border-transparent hover:border-emerald-200 hover:shadow-xl hover:scale-105 p-4 group"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <h5 className={`text-[20px] font-bold text-emerald-700 group-hover:text-amber-500 transition-colors duration-200 leading-[1.3]`}>{i.title}</h5>
                  <img
                    src={i.image_Url}
                    className="w-[100px] object-cover rounded-lg shadow"
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;