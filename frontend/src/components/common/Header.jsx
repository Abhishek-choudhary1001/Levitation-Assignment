import React from 'react';
import Button from '../ui/Button';

const Header = () => {
  return (
    <header className="w-full bg-global-1 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-global-3 text-lg sm:text-xl font-pretendard font-semibold">
            Levitation Infotech
          </h1>
        </div>
        <Button 
          variant="gradient" 
          size="small"
          className="rounded-[6px] px-[14px] py-[14px] text-[14px] font-pretendard font-medium leading-[17px]"
          onClick={() => {}}
        >
          Connecting People With Technology
        </Button>
      </div>
    </header>
  );
};

export default Header;