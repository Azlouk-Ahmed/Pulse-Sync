import { useState } from "react";

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const close = () => setModalOpen(false);
  const open = () => {console.log("clicked");setModalOpen(true)};
  
  return { modalOpen, close, open };
};

export default useModal;