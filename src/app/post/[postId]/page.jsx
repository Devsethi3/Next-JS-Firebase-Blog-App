"use client";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeftLong, FaTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FaEdit, FaShareSquare } from "react-icons/fa";
import { useSession } from "next-auth/react";
import LikePost from "@/app/components/likePost/LikePost";
import SinglePostSkeleton from "@/app/components/loadingSkeletons/SinglePostSkeleton";
import { app } from "../../../../firebaseConfig";
import RecentPosts from "@/app/components/recentPosts/RecentPost";

const SinglePostPage = ({ params }) => {
  const db = getFirestore(app);
  const [postId, setPostId] = useState();
  const [postDetail, setPostDetail] = useState([]);
  const router = useRouter();

  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPostId(params.postId);

    const getPinDetail = async () => {
      const docRef = doc(db, "blog-post", params.postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPostDetail(docSnap.data());
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    };

    getPinDetail();
  }, [params.postId]);

  const createdAtDate = new Date(parseInt(postId)).toLocaleDateString();

  const handleGoBack = () => {
    router.back();
  };

  const handleShare = async () => {
    await navigator.share({
      title: document.title,
      url: window.location.href,
    });
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "blog-post", id);
      await deleteDoc(docRef);
      router.push("/");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      router.push(`/edit-post/${id}`);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="mb-10 mt-4">
      <div onClick={handleGoBack} className="lg:block hidden">
        <FaArrowLeftLong className="text-5xl p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1a2d47] rounded-full" />
      </div>
      {isLoading ? (
        <SinglePostSkeleton />
      ) : postDetail ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
            <div className="text-center md:text-left">
              <h1 className="lg:-mt-4 font-bold xl:text-5xl lg:text-4xl md:text-3xl text-[1.6rem] leading-[2rem]">
                {postDetail.title}
              </h1>
              <div className="bg-teal-600 text-white mt-10 py-1.5 px-5 rounded-full block w-fit">
                {postDetail?.category}
              </div>
              <div className="flex mt-10 items-center single-post-flex gap-12 md:gap-16 lg:gap-32">
                <div className="flex items-center gap-4">
                  <Image
                    className="rounded-full single-post-user-image"
                    src={postDetail?.userImage}
                    width={50}
                    height={50}
                    alt="user"
                  />
                  <div className="flex flex-col">
                    <p className="text-normal lg:text-xl font-medium">
                      {postDetail?.userName}
                    </p>
                    <span className="mt-[-5px] text-sm lg:text-normal">
                      {createdAtDate}
                    </span>
                  </div>
                </div>
                <div>
                  <Link
                    className="bg-teal-600 text-white font-medium text-sm lg:text-normal lg:px-8 hover:bg-teal-700 transition-all px-6 py-3 rounded-md"
                    href={postDetail?.link}
                  >
                    Open URL
                  </Link>
                </div>
              </div>
              <div className="mt-10 flex items-center gap-5">
                <LikePost postId={postId} />
                <div
                  onClick={handleShare}
                  className="flex cursor-pointer flex-col items-center"
                >
                  <FaShareSquare className="text-[3.2rem] p-3 post-action rounded-md" />
                  <span className="mt-[-5px] text-sm post-action-text">
                    Share
                  </span>
                </div>
              </div>
            </div>
            <div className="relative z-[-10] w-full h-[50vh] lg:h-[80vh]">
              <Image
                src={postDetail?.image}
                layout="fill"
                objectFit="cover"
                alt={postDetail?.title}
              />
            </div>
          </div>
          <div className="flex items-center flex-col lg:flex-row gap-10 mt-16">
            <div className="flex-[6]">
              <p className="text-justify text-normal lg:text-xl leading-tight opacity-80">
                {postDetail?.desc}
              </p>
            </div>
            <div className="flex-[2]">
              <RecentPosts postDetail={postDetail} number={6} />
            </div>
          </div>
          {session?.user.email == postDetail.email ? (
            <div className="flex pt-5 items-center gap-8 mt-4 border-t-2 dark:border-gray-600">
              <button
                onClick={() => handleEdit(postId)}
                className="flex py-2.5 px-6 bg-teal-600 text-white rounded-md items-center gap-2"
              >
                <FaEdit />
                <span className="font-medium">Edit Post</span>
              </button>
              <button
                onClick={() => handleDelete(postId)}
                className="flex py-2.5 px-6 bg-red-600 text-white rounded-md items-center gap-2"
              >
                <FaTrashCan />
                <span className="font-medium">Delete Post</span>
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default SinglePostPage;
