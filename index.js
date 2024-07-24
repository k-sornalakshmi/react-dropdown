import React, { useState, useRef, useEffect } from 'react';
import './FloatingDropdown.css';

const index = ({ options, label, selectedValue, onSelect, onClose, selectionColor, dropdownStyle, menuStyle, menuItemStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [focused, setFocused] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [isSelectFocused, setSelectFocused] = useState(false)
  const [dropdownData, setDropdownData] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedOption(selectedValue);
    setDropdownData(options.map((i) => {
      return {
        value: i.value,
        name: i.label,
        isHover: false
      }
    }))
  }, [selectedValue, options])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    setSelectFocused(true)
  };
  const selectOption = (option) => {
    setIsOpen(false);
    setSelectFocused(false)
    onSelect(option);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSelectFocused(false)
    }
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (!selectedOption) {
      setFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`floating-label-dropdown ${focused || isOpen || selectedOption ? 'focused' : ''}`}
      ref={dropdownRef}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <label style={{ color: focused ? 'rgb(0, 107, 214)' : '#000' }}>{label}</label>
      <div className="dropdown-header" onClick={toggleDropdown} style={{
        ...dropdownStyle, borderColor: isSelectFocused ? 'rgb(0, 107, 214)' : mouseOver ? '#000' : '#f0f0ff'
      }}
        onMouseOver={() => {
          setMouseOver(true)
        }}
        onMouseLeave={() => {
          setMouseOver(false)
        }}
      >
        <div>{selectedOption ? selectedOption.name : ''}</div>
        <div className='dropdown-arrow-container'>
          {selectedOption &&
            <div onClick={onClose}>&#x2715;</div>
          }
          <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>&#9662;</div>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-list" style={menuStyle}>
          {dropdownData.map((option, index) => (
            <div
              key={index}
              className="dropdown-list-item"
              onClick={() => selectOption(option)}
              onMouseOver={() => {
                setDropdownData(dropdownData.map((i) => {
                  return {
                    ...i,
                    isHover: i.value === option.value ? true : false
                  }
                }))
              }}
              onMouseLeave={() => {
                setDropdownData(dropdownData.map((i) => {
                  return {
                    ...i,
                    isHover: false
                  }
                }))
              }}
              style={{
                ...menuItemStyle,
                backgroundColor: option.isHover ? selectionColor : 'transparent'
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default index;
