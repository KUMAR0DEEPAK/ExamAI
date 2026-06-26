import React, { useEffect, useState } from "react";
("use client");
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../services/api.js";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const handlePaying = async (amount) => {
    try {
      setPayingAmount(amount);
      setPaying(true);
      const isLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const { data } = await axios.post(
        serverUrl + "/api/credit/order",
        { amount },
        { withCredentials: true }
      );

      if (!window.Razorpay) {
        alert("Razorpay not loaded");
        return;
      }

      const paymentObject = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_T5QXCkfm8nqbfP",
        order_id: data.id,
        amount: data.amount,
        currency: "INR",
        handler: function (response) {
          axios
            .post(
              serverUrl + "/api/credit/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount,
              },
              { withCredentials: true }
            )
            .then((res) => {
              if (res?.data?.success) {
                alert("Payment Successful ✅");
                getCurrentUser(dispatch);
              } else {
                alert("Payment Failed ❌");
              }
            });
        },
      });

      paymentObject.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed ❌");
    } finally {
      setPaying(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 px-6 py-10 relative text-black dark:text-white transition-colors duration-300">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white mb-6"
      >
        ⬅️ Back
      </button>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold ">Buy Credits</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose a plan that fits your study needs
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <PricingCard
          title="Starter"
          price="₹99"
          amount={99}
          credits="150 credits"
          description="Perfect for Quick Revision"
          features={[
            "Generate AI notes",
            "Exam-focused answers",
            "Diagram and charts support",
            "Fast Generation",
          ]}
          popular={false}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          popular
          title="Popular"
          price="₹ 200"
          amount={200}
          credits="450 credits"
          description="Best Value For Students"
          features={[
            "All Starter Features",
            "More Credits per ₹",
            "Revision Mode Access",
            "Priority Ai Response",
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          title="Pro Learner"
          price="₹500"
          amount={500}
          credits="1500 credits"
          description="for Serious Exam Preparation "
          features={[
            "Maximum Credit Value",
            "unlimited Revison",
            "Diagram and charts",
            "Ideal for full syllabus",
          ]}
          popular={false}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />
      </div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount,
}) {
  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;
  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -4 }}
      className={`relative cursor-pointer rounded-xl p-6 bg-white dark:bg-gray-900 border transition ${
        isSelected
          ? "border-black dark:border-white"
          : popular
          ? "border-indigo-500"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      {popular && !isSelected && (
        <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded bg-indigo-600 text-white">
          Popular
        </span>
      )}
      {isSelected && (
        <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded text-white bg-black dark:bg-white dark:text-black">
          Selected
        </span>
      )}

      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ">{description}</p>

      <div className="mt-4">
        <p className="text-3xl font-bold ">{price}</p>
        <p className="text-sm text-indigo-600 ">{credits}</p>
      </div>
      <button
        disabled={isPayingThisCard}
        onClick={(e) => {
          e.stopPropagation();
          onBuy(amount);
        }}
        className={`w-full mt-5 py-2 rounded-lg font-medium transition ${
          isPayingThisCard
            ? "bg-gray-300 cursor-not-allowed"
            : isSelected
            ? "bg-black dark:bg-white text-white dark:text-black"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {isPayingThisCard ? "Redirecting..." : "Buy now"}
      </button>

      <ul className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2 ">
            <span className="text-green-600 ">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
export default Pricing;
