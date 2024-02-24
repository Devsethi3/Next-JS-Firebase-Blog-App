"use client";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import SearchData from "./SearchData";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div>
      <div className="relative">
        <div className="flex items-center mx-3 bg-gray-100 rounded-md dark:bg-[#18233e] px-4 py-2">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="search"
            className="bg-transparent w-full outline-none"
            placeholder="Search..."
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>
      {(isFocused || isHovered) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute p-5 z-30 top-20 w-[80%] min-h-[400px] bg-slate-500"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SearchData />
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
