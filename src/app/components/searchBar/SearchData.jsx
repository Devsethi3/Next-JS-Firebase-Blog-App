"use client";
import Image from "next/image";
import { usePostState } from "@/context/postContext/PostContext";

const SearchData = () => {
  const { listOfPins } = usePostState();

  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {listOfPins.map((pin, index) => (
          <div key={index}>
            <div className="flex items-center gap-4">
              <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
                <Image
                  src={pin?.image}
                  fill
                  alt={pin?.title}
                  className="rounded-full"
                  objectFit="cover"
                />
              </div>
              <h2 className="text-xl font-semibold">
                {truncateDescription(pin.title, 200)}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchData;
