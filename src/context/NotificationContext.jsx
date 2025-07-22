import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now(); // Simple unique ID

    setNotifications(current => [...current, { id, message, type }]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      setNotifications(current => current.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const value = {
    notifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
