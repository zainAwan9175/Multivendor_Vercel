import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      <Header activeHeading={5} />
      <div className="flex-1 flex flex-col justify-center">
      <Faq />
      </div>
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item.",
    },
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday.",
    },
    {
      question: "Can I change or cancel my order?",
      answer:
        "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only offer shipping within the United States.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept visa, mastercard, paypal payment method also we have cash on delivery system.",
    },
  ];

  return (
    <div className={`${styles.section} py-12`}>
      <h2 className="text-4xl md:text-5xl font-extrabold font-[Poppins] text-emerald-700 drop-shadow-lg tracking-wide text-center mb-10">
        <span className="text-amber-500">F</span>AQ
      </h2>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 border-b last:border-b-0 border-emerald-100 pb-4 ${activeTab === idx + 1 ? "bg-emerald-50/60" : ""}`}
            >
          <button
                className="flex items-center justify-between w-full focus:outline-none group"
                onClick={() => toggleTab(idx + 1)}
                aria-expanded={activeTab === idx + 1}
              >
                <span className={`text-lg md:text-xl font-semibold font-[Poppins] transition-colors duration-200 ${activeTab === idx + 1 ? "text-emerald-700" : "text-emerald-900"}`}>
                  {faq.question}
            </span>
                {activeTab === idx + 1 ? (
              <svg
                    className="h-6 w-6 text-amber-500 group-hover:text-amber-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                    className="h-6 w-6 text-emerald-400 group-hover:text-amber-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
              {activeTab === idx + 1 && (
                <div className="mt-4 pl-1">
                  <p className="text-base text-emerald-800 leading-relaxed">
                    {faq.answer}
              </p>
            </div>
          )}
        </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;