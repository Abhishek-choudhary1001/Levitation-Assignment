import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EditText = ({ 
  placeholder = '', 
  value = '', 
  onChange, 
  type = 'text',
  disabled = false,
  fullWidth = true,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-global-3 focus:border-global-3';
  
  const inputClasses = `
    ${baseClasses}
    bg-edittext-1
    text-global-3
    placeholder-edittext-1
    border border-solid border-[#424647]
    rounded-[4px]
    px-[10px] py-[16px]
    text-sm font-poppins font-normal leading-[21px]
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
    ${isFocused ? 'border-global-3' : 'border-[#424647]'}
    ${className}
  `?.trim()?.replace(/\s+/g, ' ');
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      className={inputClasses}
      {...props}
    />
  );
};

EditText.propTypes = {
  placeholder: PropTypes?.string,
  value: PropTypes?.string,
  onChange: PropTypes?.func,
  type: PropTypes?.string,
  disabled: PropTypes?.bool,
  fullWidth: PropTypes?.bool,
  className: PropTypes?.string,
};

export default EditText;