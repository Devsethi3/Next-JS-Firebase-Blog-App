"use client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import UploadImage from "@/app/components/uploadImage/UploadImage";
import UserPinBuilderSkeleton from "@/app/components/loadingSkeletons/UserPinBuilderSkeleton";
import UserTag from "@/app/components/userTag/UserTag";
import Modal from "@/app/components/modal/Modal";
import { app } from "../../../../firebaseConfig";
import Image from "next/image";

const EditPostPage = ({ params }) => {
  console.log(params);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [postId, setPostId] = useState();
  const [postDetail, setPostDetail] = useState([]);

  const router = useRouter();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const [fieldsError, setFieldsError] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState();
  const [category, setCategory] = useState();
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [link, setLink] = useState();
  const [successMsg, setSuccessMsg] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    setPostId(params.postId);

    const getPinDetail = async () => {
      const docRef = doc(db, "blog-post", params.postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setPostDetail(docSnap.data());
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    };

    getPinDetail();
  }, [params.postId]);

  useEffect(() => {
    // Set the initial values from postDetail only if postDetail is available
    if (postDetail) {
      setTitle(postDetail.title);
      setDesc(postDetail.desc);
      setLink(postDetail.link);
      setCategory(postDetail.category);
      setFile(postDetail.image);
    }
  }, [postDetail]);

  useEffect(() => {
    if (session) {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    setDesc(postDetail.desc);
  }, []);

  const updateFile = () => {};

  const handleSave = () => {
    if (!title || !desc || !file || !link || tags.length === 0) {
      toggleModal();
      return;
    }
    setCategory(tags.join(", "));
    setLoading(true);
    updateFile();
    toggleSuccess();
  };

  const handleCategory = () => {
    if (!category) {
      <Modal text="At least save 1 category for your blog" theme="error" />;
      return;
    }
    if (!category.trim()) return;
    setTags((prevTags) => [...prevTags, category.trim()]);
    setCategory("");
  };
  const toggleModal = () => {
    setFieldsError(!fieldsError);
  };
  const toggleSuccess = () => {
    setSuccessMsg(!successMsg);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-5">
        <div className="flex items-center justify-center w-full">
          <label
            for="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-[60vh] lg:h-[95vh] border-2 bg-[#f7fffe] hover:bg-[#ebfffd] transition-all dark:border-[#2c415f] dark:bg-[#1e2a41] dark:hover:bg-[#26354f] border-dashed rounded-lg cursor-pointer"
          >
            {selectedFile ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-[80px] h-[80px] text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-xl text-gray-500 mt-4 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
            ) : null}
            <Image
              src={postDetail?.image}
              width={500}
              height={800}
              alt="selected-image"
              className="object-contain p-2 w-full h-[90%]  "
            />
            <input
              onChange={(e) => {
                setFile(e.target.files[0]);
                setSelectedFile(e.target.files[0]);
              }}
              id="dropzone-file"
              type="file"
              className="hidden"
            />
          </label>
        </div>
        <div className="">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-gray-500">
              Give A Title To Your Subject :
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className="input-field py-2 px-4 text-xl lg:text-2xl border-2-[#e9e9e9] bg-[#f8fffc] rounded-md border-2 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:focus-visible:border-teal-600 outline-none dark:bg-[#1e2a41] dark:border-[#394f79] focus-visible:border-teal-600"
              placeholder="Their Impact on the Digital..."
            />
            <span className="text-gray-400 text-sm">
              It should not less than 15-20 words. It make blog understandable
            </span>
          </div>
          {isLoading ? (
            <div>
              <UserPinBuilderSkeleton />
            </div>
          ) : (
            <UserTag session={session} />
          )}
          <div className="flex flex-col mt-8 gap-1">
            <label htmlFor="title" className="text-gray-500">
              Blog Description :
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={6}
              className="input-field py-2 px-4 resize-none text-normal lg:text-lg border-2-[#e9e9e9] bg-[#f8fffc] rounded-md border-2 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:focus-visible:border-teal-600 outline-none dark:bg-[#1e2a41] dark:border-[#394f79] focus-visible:border-teal-600"
              placeholder="Why are they causing such a..."
            />
          </div>
          <div className="flex flex-col gap-1 mt-12">
            <label htmlFor="title" className="text-gray-500">
              Add Category to your blog
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-teal-600 flex items-center gap-3 text-white px-3 py-1 rounded-md"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setTags((prevTags) =>
                        prevTags.filter((_, i) => i !== index)
                      )
                    }
                    className="text-red-200 font-bold text-xs hover:text-white focus:outline-none"
                  >
                    &#10005;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <input
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                type="text"
                className="input-field py-2 w-[75%] lg:w-[85%] category-input px-4 text-lg lg:text-xl border-2-[#e9e9e9] bg-[#f8fffc] rounded-md border-2 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:focus-visible:border-teal-600 outline-none dark:bg-[#1e2a41] dark:border-[#394f79] focus-visible:border-teal-600"
                placeholder="travel,food,fitness..."
              />
              <button
                onClick={handleCategory}
                className="bg-teal-600 w-[25%] lg:w-[15%] px-5 text-white py-2.5 rounded-md"
              >
                Save
              </button>
            </div>
            <span className="text-gray-400 text-sm">
              Category related to your blog topic for better understanding
            </span>
          </div>
          <div className="flex flex-col gap-1 mt-10">
            <label htmlFor="title" className="text-gray-500">
              Add Link To The Subject
            </label>
            <input
              onChange={(e) => setLink(e.target.value)}
              value={link}
              type="text"
              className="input-field py-2 px-4 text-lg lg:text-xl rounded-md border-2-[#e9e9e9] bg-[#f8fffc] rounded-md border-2 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:focus-visible:border-teal-600 outline-none dark:bg-[#1e2a41] dark:border-[#394f79] focus-visible:border-teal-600"
              placeholder="https://youtube.com"
            />
          </div>
        </div>
      </div>
      <div className="mb-24">
        <button
          onClick={handleSave}
          className="float-end py-2.5 px-8 rounded-md bg-teal-600 text-white my-8"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </div>

      {successMsg && (
        <Modal
          toggleModal={toggleModal}
          text="Blog Published Successfully"
          theme="success"
        />
      )}
      {fieldsError && (
        <Modal
          toggleModal={toggleModal}
          text="Please fill all the fields before publishing!"
          theme="error"
        />
      )}
    </>
  );
};

export default EditPostPage;
