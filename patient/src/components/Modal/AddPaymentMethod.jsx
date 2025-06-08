import { useState } from 'react';
import axios from 'axios'; // Import Axios
import Backdrop from '../Backdrop';
import { motion } from 'framer-motion';
import { dropIn } from '../../utils/modals';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddPaymentMethod({ handleClose }) {
  const [selectedPayment, setSelectedPayment] = useState("payment1");
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');

  const handleSelect = (value) => {
    setSelectedPayment(value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(process.env.REACT_APP_API_URL + 'mandoub/edit?scope=bank', {
        bankName: bankName.trim(),
        accountName: accountHolderName.trim(), // Correct mapping and trimming
        accountNumber: accountNumber.trim(),
        iban: iban.trim(),
        swiftCode: swiftCode.trim(),
      }, 
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('authMandoub'))?.token}`,
        },
      });
      console.log('Response:', response.data);
      handleClose();
      toast.success('تم تحديث المعلومات بنجاح!');
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('حدث خطأ أثناء تحديث معلوماتك.');
    }
  };
  
  

  return (
    <Backdrop onClick={handleClose} isNotification={true}>
      <ToastContainer />
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal g0"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="df-c">
          <div className="title">اختر وسيلة الدفع</div>
        
          <div className="df w-full">
            <div className="df wrap mt-4 w-full">
              <label
                htmlFor="payment1"
                className={`df-c payment-label mx-auto ${
                  selectedPayment === "payment1" ? "selected" : ""
                }`}
              >
                <div className="payment-card !w-20 !h-12">
                  <img src="https://cdn.iconscout.com/icon/free/png-512/bank-transfer-1817143-1538011.png" alt="تحويل بنكي" />
                </div>
                <span className="ta-c font-bold text-sm">تحويل بنكي</span>
                <input
                  type="radio"
                  name="payment"
                  id="payment1"
                  value="payment1"
                  onChange={() => handleSelect("payment1")}
                  checked={selectedPayment === "payment1"}
                />
              </label>
            </div>
          </div>

          <div className="df-c">
            <div className="df w-full jc-sb">
              <div className="df-c pr">
                <label htmlFor="bankName" className="label-trans">اسم البنك</label>
                <input
                  type="text"
                  id="bankName"
                  placeholder="بنك ABC"
                  className="input-field"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="df-c pr">
                <label htmlFor="accountHolderName" className="label-trans">اسم صاحب الحساب</label>
                <input
                  type="text"
                  id="accountHolderName"
                  placeholder="جون دو"
                  className="input-field"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                />
              </div>
            </div>
            <div className="df-c pr">
              <label htmlFor="accountNumber" className="label-trans">رقم الحساب</label>
              <input
                type="text"
                id="accountNumber"
                placeholder="12345678901234"
                className="input-field"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="df-c pr">
              <label htmlFor="iban" className="label-trans">IBAN</label>
              <input
                type="text"
                id="iban"
                placeholder="US59 1234 5678 9012 3456 7890"
                className="input-field"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />
            </div>
            <div className="df w-full">
              <div className="df-c pr w-full">
                <label htmlFor="swiftCode" className="label-trans">رمز SWIFT/BIC</label>
                <input
                  type="text"
                  id="swiftCode"
                  placeholder="ABCIT12345"
                  className="input-field"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="df header-btns mr-auto">
            <div className="details-btn df" onClick={handleClose}>إلغاء</div>
            <div className="details-btn df" onClick={handleSubmit}>تأكيد</div>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
}

export default AddPaymentMethod;
