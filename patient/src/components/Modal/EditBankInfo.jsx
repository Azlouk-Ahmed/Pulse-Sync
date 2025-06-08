import { useState } from "react";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import { dropIn } from "../../utils/modals";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

function EditBankInfo({ handleClose, method }) {
  const { auth, dispatch } = useAuthContext();

  // Initialize state for each form field
  const [bankName, setBankName] = useState(method.requirements[0].example || "");
  const [accountHolderName, setAccountHolderName] = useState(method.requirements[1].example || "");
  const [accountNumber, setAccountNumber] = useState(method.requirements[2].example || "");
  const [iban, setIban] = useState(method.requirements[3].example || "");
  const [swiftCode, setSwiftCode] = useState(method.requirements[4].example || "");

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/mandoub/edit?scope=bank`, {
        bankName: bankName.trim(),
        accountName: accountHolderName.trim(),
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
      dispatch({ type: 'LOGIN', payload: { ...auth, user: response.data.mandoub } });
      handleClose();
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  return (
    <Backdrop onClick={handleClose} isNotification={true}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal g0 !w-fit"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {method.name === "تحويل بنكي" && (
          <div className="df-c">
            <div className="df w-full">
              <div className="df-c pr">
                <label htmlFor="bankName" className="label-trans">
                  {method.requirements[0].field}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  id="bankName"
                />
              </div>
              <div className="df-c pr">
                <label htmlFor="accountHolderName" className="label-trans">
                  {method.requirements[1].field}
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  id="accountHolderName"
                />
              </div>
            </div>
            <div className="df-c pr">
              <label htmlFor="accountNumber" className="label-trans">
                {method.requirements[2].field}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                id="accountNumber"
              />
            </div>
            <div className="df-c pr">
              <label htmlFor="iban" className="label-trans">
                {method.requirements[3].field}
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                id="iban"
              />
            </div>
            <div className="df w-full">
              <div className="df-c pr w-full">
                <label htmlFor="swiftCode" className="label-trans">
                  {method.requirements[4].field}
                </label>
                <input
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  id="swiftCode"
                />
              </div>
            </div>
            <div className="df header-btns mr-auto">
              <div
                className="details-btn df"
                onClick={handleClose}
              >
                إلغاء
              </div>
              <div
                className="details-btn df"
                onClick={handleSubmit}
              >
                تأكيد
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Backdrop>
  );
}

export default EditBankInfo;
