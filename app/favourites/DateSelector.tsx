"use client"; // This component will be rendered on the client side

import React from 'react';

interface DateSelectorProps {
  dates: string[];
}

const DateSelector: React.FC<DateSelectorProps> = ({ dates }) => {
  return (
    <div className="mt-4">
      <label htmlFor="dates" className="block text-lg font-semibold mb-2">Date:</label>
      <select
        id="dates"
        className="p-2 border border-gray-300 rounded text-black bg-white" // Set text color and background color
      >
        <option value="" className="text-gray-500">-- Choose a date --</option> {/* Grey color for placeholder */}
        {dates.map((date, index) => (
          <option key={index} value={date} className="text-black">
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
