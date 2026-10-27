import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../services/api.js";
import Navbar from "../component/Navbar.jsx";
import { toast } from "sonner";
import { FaCheck, FaGem, FaShieldAlt, FaBolt, FaCrown, FaStar } from "react-icons/fa";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [selectedPrice, setSelectedPrice] = useState(200);
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
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
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
      const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!isLoaded) {
        toast.error("Razorpay payment gateway failed to load. Please check your connection.");
        return;
      }

      const { data } = await axios.post(
        serverUrl + "/api/credit/order",
        { amount },
        { withCredentials: true }
      );

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not initialized.");
        return;
      }

      const paymentObject = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_T5QXCkfm8nqbfP",
        order_id: data.id,
        amount: data.amount,
        currency: "INR",
        name: "ExamAI Study Credits",
        description: `Top up credits for exam notes generation`,
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              serverUrl + "/api/credit/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount,
              },
              { withCredentials: true }
            );

            if (verifyRes?.data?.success) {
              toast.success("Payment Successful! Credits added to your balance 🎉");
              getCurrentUser(dispatch);
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification error.");
          }
        },
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate checkout. Please ensure you are logged in.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <FaGem className="text-[11px]" />
            <span>Instant Balance Top-Up</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight bg-linear-to-r from-gray-900 via-indigo-900 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
            Choose Your Study Plan
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Each note generation costs 10 credits. Purchase credits anytime with secure Razorpay checkout.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <PricingCard
            icon={<FaBolt className="text-amber-500" />}
            title="Starter Pack"
            price="₹99"
            amount={99}
            credits="150 Credits"
            noteCount="15 Full Note Generations"
            description="Ideal for single-chapter exam revision"
            features={[
              "150 AI Generation Credits",
              "15 Full Syllabus Notes",
              "Interactive Mermaid Flowcharts",
              "Visual Recharts Data Graphs",
              "Standard AI Response Time",
              "Printable PDF Export",
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
            icon={<FaCrown className="text-amber-400" />}
            title="Student Pro"
            price="₹200"
            amount={200}
            credits="450 Credits"
            noteCount="45 Full Note Generations"
            badge="Best Value (Most Popular)"
            description="Best for full subject exam preparation"
            features={[
              "450 AI Generation Credits",
              "45 Full Syllabus Notes",
              "33% Extra Bonus Credits",
              "Interactive Mermaid Flowcharts",
              "Visual Recharts Data Graphs",
              "Priority Gemini 2.5 Flash Response",
              "Unlimited PDF Downloads",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          <PricingCard
            icon={<FaStar className="text-indigo-500" />}
            title="Exam Master"
            price="₹500"
            amount={500}
            credits="1,500 Credits"
            noteCount="150 Full Note Generations"
            description="Designed for competitive entrance exams"
            features={[
              "1,500 AI Generation Credits",
              "150 Full Syllabus Notes",
              "Max Cost-Per-Credit Savings",
              "Complete Multi-Subject Syllabus",
              "Unlimited Quick Revision Summaries",
              "Priority Support & Generation Queue",
              "Lifetime Saved Notes Archive",
            ]}
            popular={false}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />
        </div>

        {/* Assurance Banner */}
        <div className="mt-14 max-w-2xl mx-auto p-4 rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-emerald-500 text-sm" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBolt className="text-amber-500 text-sm" />
            <span>Instant Automatic Credit Activation</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function PricingCard({
  icon,
  title,
  price,
  amount,
  credits,
  noteCount,
  description,
  features,
  popular,
  badge,
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
        popular
          ? "bg-white dark:bg-gray-900 border-2 border-indigo-500 dark:border-indigo-400 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/10"
          : isSelected
          ? "bg-white dark:bg-gray-900 border-2 border-gray-900 dark:border-white shadow-lg"
          : "bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-xs"
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
          {badge || "Most Popular"}
        </span>
      )}

      <div>
        {/* Title and Icon */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{description}</p>

        {/* Pricing Figures */}
        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold font-heading text-gray-900 dark:text-white tracking-tight">
              {price}
            </span>
            <span className="text-xs text-gray-400 font-medium">/ one-time</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {credits}
            </span>
            <span className="text-[11px] text-gray-400">≈ {noteCount}</span>
          </div>
        </div>

        {/* Features Checklist */}
        <ul className="space-y-3 mb-8">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                <FaCheck />
              </span>
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Buy Button */}
      <button
        disabled={isPayingThisCard}
        onClick={(e) => {
          e.stopPropagation();
          onBuy(amount);
        }}
        className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isPayingThisCard
            ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            : popular
            ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25"
            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
        }`}
      >
        {isPayingThisCard ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Opening Checkout...</span>
          </>
        ) : (
          `Get ${credits}`
        )}
      </button>
    </motion.div>
  );
}

export default Pricing;
