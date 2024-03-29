"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaRegShareSquare } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import ProfileSkeleton from "../components/loadingSkeletons/ProfileSkeleton";
import PostList from "../components/posts/PostList";

const ProfilePage = () => {
  const db = getFirestore();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [listOfPins, setListOfPins] = useState([]);

  useEffect(() => {
    const getUserPins = async () => {
      try {
        if (!session?.user.email) {
          return;
        }
        const q = query(
          collection(db, "blog-post"),
          where("email", "==", session.user.email)
        );
        const querySnapshot = await getDocs(q);
        const pinsData = querySnapshot.docs.map((doc) => doc.data());
        setListOfPins(pinsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user pins:", error);
        setIsLoading(false);
      }
    };

    if (session?.user.email) {
      getUserPins();
    }
  }, [db, session]);

  const handleShare = async () => {
    await navigator.share({
      title: document.title,
      url: window.location.href,
    });
  };

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="grid place-items-center mt-12">
          <Image
            src={session?.user.image}
            width={180}
            height={180}
            alt="user-image"
            className="rounded-full"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center mt-5 gap-2">
              <p className="font-medium text-gray-800 dark:text-gray-400">
                Name:
              </p>
              <p className="font-medium">{session.user.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 dark:text-gray-400">
                Email:
              </p>
              <p>{session.user.email}</p>
            </div>
          </div>
          <div className="flex mt-8 items-center gap-8">
            <button
              onClick={handleShare}
              className="bg-indigo-600 flex items-center gap-2 py-2.5 px-7 rounded-md text-white transition-colors hover:bg-indigo-700 duration-300"
            >
              <FaRegShareSquare />
              <span>Share</span>
            </button>
            <button className="bg-red-500 flex items-center gap-2 py-2.5 px-7 rounded-md text-white transition-colors hover:bg-red-600 duration-300">
              <TbLogout className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
      <PostList listOfPins={listOfPins} />
    </>
  );
};

export default ProfilePage;
