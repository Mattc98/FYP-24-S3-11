// components/TimeSlotDropdown.tsx
"use client"; // This component will be rendered on the client side

import React, { useState } from 'react';

interface TimeSlotDropdownProps {
  timeSlots: string[];
}

const TimeSlotDropdown: React.FC<TimeSlotDropdownProps> = ({ timeSlots }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const handleTimeSlotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeSlot(event.target.value);
  };

  return (
    <div className="mt-4">
      <label htmlFor="timeSlots" className="block text-lg font-semibold mb-2">Select Time Slot:</label>
      <select
        id="timeSlots"
        value={selectedTimeSlot}
        onChange={handleTimeSlotChange}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">-- Select a Time Slot --</option>
        {timeSlots.map((slot, index) => (
          <option key={index} value={slot}>
            {slot}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotDropdown;
