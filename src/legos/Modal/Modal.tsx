import { FC, ReactNode, TouchEvent, useEffect, useState } from 'react';
import { IconButton } from '@/legos';

type Props = {
  isOpen: boolean;
  toggleModal: () => void;
  children: ReactNode;
};

export const Modal: FC<Props> = ({ isOpen, toggleModal, children }) => {
  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.overflow = 'auto';
      }, 100);
    }
  }, [isOpen]);

  const handelTouchStart = (e: TouchEvent) => {
    setTouchStartY(e.changedTouches[0].clientY);
  };

  const handelTouchEnd = (e: TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientX;
    const deltaY = touchEndY - touchStartY;

    if (deltaY > 50) {
      toggleModal();
    }
  };

  return (
    <div
      onTouchStart={handelTouchStart}
      onTouchEnd={handelTouchEnd}
      className={`fixed z-50 top-0 left-0 w-full h-full bg-black/50 flex justify-center items-end transition-all duration-300 sm:items-center${
        !isOpen ? ' opacity-0 pointer-events-none invisible' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden w-full h-[90%] sm:h-full sm:max-h-[600px] rounded-t-3xl transition-all duration-200 py-4 md:py-10 sm:w-4/6 xl:w-2/6 sm:rounded-2xl bg-white before:sm:hidden before:absolute before:w-20 before:h-1 before:top-2 before:left-1/2 before:-ml-10 before:rounded-xl before:bg-[#2E0F42]${
          isOpen ? ' translate-y-0' : ' translate-y-full sm:translate-y-96'
        }`}
      >
        <IconButton
          className="absolute top-3 right-3 w-6 h-6 hidden sm:block"
          icon="Close"
          onClick={toggleModal}
        />
        <div className="px-4 md:px-10 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};
