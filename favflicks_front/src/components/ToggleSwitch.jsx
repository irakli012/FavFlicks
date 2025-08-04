// components/ToggleSwitch.jsx
import React from 'react';

// Change this from named export to default export
const ToggleSwitch = ({ isOn, handleToggle, label }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-white text-sm font-medium">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isOn ? 'bg-[#e82626]' : 'bg-gray-600'
        }`}
        onClick={handleToggle}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch; // Changed to default export