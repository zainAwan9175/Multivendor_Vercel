import React, { useRef, useEffect, useState } from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const brands = [
    { id: 1, name: "Sony", logo: "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png" },
    { id: 2, name: "Dell", logo: "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png" },
    { id: 3, name: "HP", logo: "https://logos-world.net/wp-content/uploads/2020/11/HP-Logo.png" },
    { id: 4, name: "Samsung", logo: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png" },
    { id: 11, name: "Nike", logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png" },
    { id: 12, name: "Adidas", logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png" },
  ];

  // Duplicate brands to make seamless scroll
  const infiniteBrands = [...brands, ...brands, ...brands];

  // Inline keyframes as string
  const scrollAnimation = `
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;

  // Inject keyframes into the document
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = scrollAnimation;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <div className={`${styles.section} hidden sm:block bg-white py-8 px-6 mb-12 rounded-xl shadow-lg border border-emerald-100 overflow-hidden`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">Sponsored Brands</h2>
        <p className="text-emerald-600">Trusted by leading companies worldwide</p>
      </div>

      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className="flex gap-8"
          style={{
            width: "fit-content",
            animation: "scrollLeft 30s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {infiniteBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 w-[200px] h-[100px] flex items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-[150px] h-[70px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default Sponsored;
