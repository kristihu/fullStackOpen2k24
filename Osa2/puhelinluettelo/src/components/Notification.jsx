import './notification.css';

const Notification = ({ notification, type }) => {
  if (notification === null) {
    return null;
  }

  const className = type === 'error' ? 'error' : 'success';

  return <div className={className}>{notification}</div>;
};

export default Notification;
