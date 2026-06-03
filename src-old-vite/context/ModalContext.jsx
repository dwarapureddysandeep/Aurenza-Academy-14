import { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillCourse, setPrefillCourse] = useState('');

  const openModal = (courseName = '') => {
    setPrefillCourse(courseName);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPrefillCourse('');
  };

  return (
    <ModalContext.Provider value={{ isOpen, prefillCourse, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useLeadModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useLeadModal must be used within a ModalProvider');
  }
  return context;
};
