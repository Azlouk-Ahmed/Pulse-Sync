import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { GrNotification } from "react-icons/gr";
import { BsEye } from "react-icons/bs";

const dropIn = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 500 } },
  exit: { y: "100vh", opacity: 0 },
};

function NotificationsModal({ handleClose }) {
  // Static notifications data
  const notifications = [
    {
      _id: "1",
      content: "تم تحديث حالة الطلب #1234",
      createdAt: "2023-05-15T10:30:00Z",
      isSeen: false
    },
    {
      _id: "2",
      content: "تم استلام طلب جديد #5678",
      createdAt: "2023-05-14T14:20:00Z",
      isSeen: true
    },
    {
      _id: "3",
      content: "تمت الموافقة على طلب السحب الخاص بك",
      createdAt: "2023-05-13T09:45:00Z",
      isSeen: true
    },
    {
      _id: "4",
      content: "لديك رسالة جديدة من الإدارة",
      createdAt: "2023-05-12T16:10:00Z",
      isSeen: false
    }
  ];

  // Static count of unseen notifications
  const unseenCount = 2;

  const handleNotificationClick = () => {
    // Static function - would mark notifications as seen in a real app
    handleClose();
  };

  return (
    <Backdrop onClick={handleClose} isNotification={true}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal !py-1 g0 notifications-modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex gap-5 items-center justify-between w-full notif-panel">
          <div className="bold-1">الإشعارات</div>
          <div className="flex gap-5 items-center">
            <div className="new"><span>{unseenCount} جديدة</span></div>
            <GrNotification />
            <div className="flex gap-5 items-center cursor-pointer" onClick={handleNotificationClick}>تمت المشاهدة <BsEye /></div>
          </div>
        </div>
        <div className="notification-body df-c g0">
          {notifications.map((notif) => (
            <div key={notif._id} className={`notification ${notif.isSeen === false ? 'seenn' : ''} w-full flex gap-5 items-center ai-fs`}>
              <div
                className="rounded-icon"
              >
                <GrNotification />
              </div>
              <div className="df-c w-full g0">
                <div className="text">{notif.content}</div>
                <div className="text mt-4 w-fit mr-auto">{notif.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Backdrop>
  );
}

export default NotificationsModal;