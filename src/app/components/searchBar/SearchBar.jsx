import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div>
      <div className="flex items-center mx-3 bg-gray-100 rounded-md dark:bg-[#18233e] px-4 py-2">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          className="bg-transparent w-full outline-none"
          name="search"
          id="search"
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default SearchBar;
