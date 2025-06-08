import { useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "../Backdrop/index";
import axios from "axios"; // Import axios
import { useFetchData } from "../../hooks/useFetchData";
import { useAuthContext } from "../../hooks/useAuthContext";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

function WithDrawModal({ handleClose, bonus }) {
  console.log(bonus);
  
  const { auth } = useAuthContext();
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const { data, loading, error } = useFetchData("mandoub/leveldata?id=" + auth?.user?._id, [auth]);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSelect = (value) => {
    setSelectedPayment(value);
  };

  

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess(false);

    const withdrawalData = {
      paymentMethod: selectedPayment,
      bonus: data?.level.rewardTarget <= bonus ? true : false,
      bonusReached: data?.level.rewardTarget - bonus
    };

    try {
      // Make the POST request to create a withdrawal
      const response = await axios.post(process.env.REACT_APP_API_URL+"mandoub/withdraw", withdrawalData,{
        headers: {
            Authorization : `Bearer ${JSON.parse(localStorage.getItem('authMandoub'))?.token}`
        },
        withCredentials: true,
    });
      setSubmitSuccess(true);
      setIsLoading(false);
      // Handle success (e.g., show a success message or close modal)
      handleClose();
      console.log(response.data);
    } catch (err) {
      setIsLoading(false);
      setSubmitError(err?.response?.data?.message ||"Error processing your withdrawal request.");
      console.error(err);
    }
  };
  console.log(data);
  

  

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="g0 withdraw-modal !py-12"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="df ai-stretch">
          <div className="df-c w-2/3 jc-sb">
            <h1 className="title">سحب الراتب {data?.level.rewardTarget - bonus}</h1>
            <p className="text">
              مرحبًا بك! لقد حان الوقت لسحب راتبك. يرجى اختيار طريقة الدفع المناسبة والتحقق من بياناتك لضمان عملية سلسة.
            </p>
            <div className="df justify-center wrap mt-4">
              <label
                htmlFor="payment1"
                className={`df-c payment-label ${selectedPayment === "bank" ? "selected" : ""}`}
              >
                <div className="payment-card !w-44 !h-28">
                  <img className="!object-contain" src="https://cdn-icons-png.freepik.com/512/4140/4140809.png" alt="ماستركارد" />
                </div>
                <span className="ta-c font-bold text-sm">bank transfer</span>
                <input
                  type="radio"
                  name="payment"
                  id="payment1"
                  value="bank"
                  onChange={() => handleSelect("bank")}
                  checked={selectedPayment === "bank"}
                />
              </label>

              <label
                htmlFor="payment3"
                className={`df-c payment-label ${selectedPayment === "cash" ? "selected" : ""}`}
              >
                <div className="payment-card !w-44 !h-28">
                  <img src="https://c8.alamy.com/comp/HY60CY/hand-gives-money-icon-outline-style-HY60CY.jpg" alt="باي بال" />
                </div>
                <span className="ta-c font-bold text-sm ">cash</span>
                <input
                  type="radio"
                  name="payment"
                  id="payment3"
                  value="cash"
                  onChange={() => handleSelect("cash")}
                  checked={selectedPayment === "cash"}
                />
              </label>
            </div>
          </div>
          <div className="df-c">
            <h1 className="title">سحب الراتب</h1>
            <p className="text">
              تهانينا! لقد أكملت جميع الأهداف بنجاح، كما أنك حققت المتطلبات اللازمة للحصول على المكافأة.
            </p>
            <div className="total-salary">
              <span className="text-8xl text-indigo-600">${data?.level.monthlySalary}</span>/شهري
            </div>
            <div className="p-4 df-c">
              <div className="df jc-sb border-b">
                <span>{data?.level.monthlySalary}$</span>
                <span>الراتب</span>
              </div>
              <div className="df jc-sb border-b">
                <span className={`status ${data?.level.rewardTarget <= bonus ? 'delivered' : 'pending'}`}>{data?.level.rewardTarget <= bonus? "reached" : "not reached"}</span>
                <span>المكافأة</span>
              </div>
              {data?.level.rewardTarget >= bonus &&<div className="df jc-sb border-b">
                <span>{data?.level.rewardTarget - bonus} kg</span>
                <span>المكافأة</span>
              </div>}
            </div>
            <button className="btn mt-auto" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Processing..." : "إرسال السحب"}
            </button>
            {submitError && <p className="text-red-500">{submitError}</p>}
            {submitSuccess && <p className="text-green-500">Withdrawal request submitted successfully!</p>}
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
}

export default WithDrawModal;
