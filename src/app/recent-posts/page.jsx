"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePostState } from "@/context/postContext/PostContext";

const RecentPostPage = () => {
  const { listOfPins } = usePostState();
  const router = useRouter();

  const formatDate = (id) => {
    const date = new Date(parseInt(id));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // Reverse the order of listOfPins to display newest posts at the top
  const reversedListOfPins = [...listOfPins].reverse();

  return (
    <div className="mt-5">
      <h1 className="text-center text-3xl text-gray-700 dark:text-gray-200 border-b-[3px] border-teal-600 pb-2 my-8 font-semibold">
        Explore Recent Posts
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-2 border-gray-300 dark:border-[#253954]">
              <th className="border-2 w-20 py-2 px-3 border-gray-300 dark:border-[#253954] dark:bg-[#253954] bg-gray-200 ">
                S.No.
              </th>
              <th className="border-2 w-[150px] py-2 px-3 border-gray-300 dark:border-[#253954] dark:bg-[#253954] bg-gray-200 ">
                Blog Image
              </th>
              <th className="border-2 w-[400px] py-2 px-3 border-gray-300 dark:border-[#253954] dark:bg-[#253954] bg-gray-200 ">
                Title
              </th>
              <th className="border-2 w-[410px] py-2 px-3 border-gray-300 dark:border-[#253954] dark:bg-[#253954] bg-gray-200 ">
                Desc
              </th>
              <th className="border-2 py-2 px-3 border-gray-300 dark:border-[#253954] dark:bg-[#253954] bg-gray-200 ">
                Post By
              </th>
              <th className="border-2 py-2 px-3 w-[150px] border-gray-300 dark:border-[#253954] dark:bg-[#253954] bg-gray-200 ">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {reversedListOfPins.map((pin, index) => (
              <tr
                key={index}
                className="cursor-pointer my-3"
                onClick={() => router.push("/post/" + pin.id)}
              >
                <td className="border-2 border-gray-300 dark:border-[#253954] text-center py-2 px-3">
                  {index + 1}
                </td>
                <td className="border-2 border-gray-300 dark:border-[#253954] py-2 px-3 text-center">
                  <div className="flex justify-center">
                    <div className="relative w-[70px] h-[70px]">
                      <Image
                        fill
                        objectFit="cover"
                        src={pin?.image}
                        className="rounded-full"
                        alt="user-image"
                      />
                    </div>
                  </div>
                </td>
                <td className="border-2 border-gray-300 dark:border-[#253954] leading-tight opacity-80 py-2 px-3 text-xl font-semibold">
                  {truncateDescription(pin.title, 70)}
                </td>
                <td className="border-2 leading-tight border-gray-300 dark:border-[#253954] py-2 text-justify px-3">
                  {truncateDescription(pin.desc, 140)}
                </td>
                <td className="border-2 border-gray-300 dark:border-[#253954] py-2 text-center px-3">
                  <div className="flex flex-col lg:flex-row gap-2 items-center">
                    <Image
                      src={pin?.userImage}
                      width={30}
                      height={30}
                      className="rounded-full"
                      alt="user-image"
                    />
                    <p className="text-sm font-medium">{pin.userName}</p>
                  </div>
                </td>
                <td className="border-2 border-gray-300 dark:border-[#253954] py-2 text-center px-3">
                  {formatDate(pin.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPostPage;
