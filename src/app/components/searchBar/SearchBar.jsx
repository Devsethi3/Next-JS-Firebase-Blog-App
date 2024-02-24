"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePostState } from "@/context/postContext/PostContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchData = ({ searchQuery }) => {
  const { listOfPins } = usePostState();
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    setScreenWidth(window.innerWidth);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredPins = listOfPins.filter((pin) =>
    pin.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateDescription = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const showPinTitle = (title) => {
    if (screenWidth <= 680) {
      return truncateDescription(title, 45);
    } else {
      return title;
    }
  };

  return (
    <div>
      {filteredPins.length === 0 ? (
        <div className="text-center dark:text-gray-400 text-gray-600 py-4">
          No matching blog found.
        </div>
      ) : (
        <div className="flex py-3 flex-col gap-5 cursor-pointer">
          {filteredPins.map((pin, index) => (
            <div
              onClick={() => router.push(`/post/${pin.id}`)}
              key={index}
              className="flex border-b-[2px] border-gray-200 py-2 -mt-5 dark:border-[#27385c] items-center gap-6"
            >
              <div className="relative lg:w-[90px] w-[100px] box-shadow: rgba(13, 38, 76, 0.19) 0px 9px 20px; lg:h-[85px] h-[65px] rounded-full">
                <Image
                  src={pin?.image}
                  fill
                  alt={pin?.title}
                  objectFit="cover"
                />
              </div>
              <h4 className="text-normal lg:text-xl text-gray-800 dark:text-gray-300 leading-tight font-medium">
                {showPinTitle(pin.title)}
              </h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
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
            onChange={handleInputChange}
          />
        </div>
      </div>
      {(isFocused || isHovered) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute p-3 lg:p-5 z-30 top-24 dark:bg-[#1C2A49] shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] rounded-md w-[85%] lg:w-[80%] bg-[#f4fffb]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {searchQuery ? (
            <SearchData searchQuery={searchQuery} />
          ) : (
            <div className="text-center dark:text-gray-400 text-gray-600 py-4">
              Search Blog by Title
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
