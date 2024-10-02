"use client"; // This component will be rendered on the client side

import React, { useState } from 'react';

interface TimeSlotDropdownProps {
  timeSlots: string[];
  onChange: (slot: string) => void; // Add onChange prop
}

const TimeSlotDropdown: React.FC<TimeSlotDropdownProps> = ({ timeSlots, onChange }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const handleTimeSlotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlot = event.target.value;
    setSelectedTimeSlot(newSlot);
    onChange(newSlot); // Call the onChange prop to notify the parent
  };

  return (
    <div className="mt-4">
      <label htmlFor="timeSlots" className="block text-lg font-semibold mb-2">Time:</label>
      <select
        id="timeSlots"
        value={selectedTimeSlot}
        onChange={handleTimeSlotChange}
        className="p-2 border border-gray-300 rounded text-black bg-white" // Set text color and background color
      >
        <option value="" className="text-gray-500">-- Choose a Time Slot --</option> {/* Grey color for placeholder */}
        {timeSlots.map((slot, index) => (
          <option key={index} value={slot} className="text-black"> {/* Set option text color */}
            {slot}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotDropdown;
