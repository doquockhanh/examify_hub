import React, { useState, useEffect } from 'react';

const Notification: React.FC<{ message: string; nKey: string; color?: string }> = ({ message, nKey , color}) => {
  const [visible, setVisible] = useState(true);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return visible ? (
    <div key={nKey} className={`${color ? color : "bg-blue-500"} text-white p-2 px-4 rounded animate__animated animate__slideInDown animate__fadeOut`}>
      {message}
    </div>
  ) : null;
};

export default Notification;
