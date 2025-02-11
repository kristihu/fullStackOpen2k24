import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification.visible) {
    return null;
  }

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    backgroundColor: "#e1f5fe",
    color: "#0277bd",
    marginBottom: "10px",
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
