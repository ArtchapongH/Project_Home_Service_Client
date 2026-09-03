import React from "react";

interface DragVerticalIconProps {
  className?: string;
}

export const DragVerticalIcon: React.FC<DragVerticalIconProps> = ({
  className = "text-[#C8CCDB] hover:text-gray-500 transition-colors",
}) => {
  return (
    <svg
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="4" cy="3.5" r="1.6" />
      <circle cx="10" cy="3.5" r="1.6" />
      <circle cx="4" cy="10" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="4" cy="16.5" r="1.6" />
      <circle cx="10" cy="16.5" r="1.6" />
    </svg>
  );
};

export default DragVerticalIcon;
