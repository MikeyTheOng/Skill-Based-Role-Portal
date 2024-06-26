import React from 'react';

const GoBackButton = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <button onClick={goBack} className='flex items-center space-x-2 pb-5'>
        <img className="w-8 h-8"src="https://img.icons8.com/ios-filled/50/left.png" alt="back"/> 
        <span>Back</span>
    </button>
  );
};

export default GoBackButton;




