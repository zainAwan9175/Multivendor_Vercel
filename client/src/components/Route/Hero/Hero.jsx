import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

// E-commerce hero background images
const heroImages = [
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-cover bg-center bg-no-repeat overflow-hidden ${styles.normalFlex}`}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(16,185,129,0.18) 0%, rgba(255,255,255,0.75) 100%), url('${heroImages[current]}')`,
      }}
    >
      {/* Slider fade effect */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {heroImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(16,185,129,0.18) 0%, rgba(255,255,255,0.75) 100%), url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: idx === current ? 1 : 0,
            }}
          />
        ))}
      </div>

      <div className={`${styles.section} w-[90%] 800px:w-[60%] flex flex-col 800px:flex-row items-start gap-10 relative z-0`}>
        <div className="flex-1 flex flex-col items-start gap-6 justify-center py-8 800px:py-0">
          <h1 className="text-[42px] leading-tight 800px:text-[68px] text-emerald-900 font-extrabold capitalize drop-shadow-2xl">
            Empowering <span className="text-amber-500">Sellers</span>, Inspiring{" "}
            <span className="text-emerald-600">Shoppers</span>
          </h1>
          <p className="pt-2 text-[20px] font-[Poppins] font-[500] text-slate-800 max-w-2xl bg-white/70 rounded-lg px-4 py-2 shadow">
            Welcome to <span className="text-emerald-600 font-bold">MarketNest</span> — the ultimate multi-vendor marketplace!
            Discover trending products, exclusive deals, and unique finds from trusted sellers across the country. <br />
            <span className="text-amber-600 font-semibold">Shop with confidence. Sell with ease.</span>
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/products" className="inline-block">
              <div className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 px-8 py-3 rounded-full shadow-xl">
                <span className="text-amber-100 font-[Poppins] text-[18px] font-semibold">Start Shopping</span>
              </div>
            </Link>
            <Link to="/shop-create" className="inline-block">
              <div className="bg-amber-400 hover:bg-amber-500 transition-colors duration-300 px-8 py-3 rounded-full shadow-xl">
                <span className="text-emerald-900 font-[Poppins] text-[18px] font-semibold">Become a Seller</span>
              </div>
            </Link>
          </div>
          <div className="mt-8">
            <span className="inline-block bg-white/90 text-emerald-700 font-semibold px-4 py-2 rounded shadow-lg">
              🛒 Free shipping, secure payments, and 24/7 support for all users!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
