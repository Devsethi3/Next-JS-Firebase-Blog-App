"use client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadImage from "../components/uploadImage/UploadImage";
import UserPinBuilderSkeleton from "../components/loadingSkeletons/UserPinBuilderSkeleton";
import UserTag from "../components/userTag/UserTag";
import Modal from "../components/modal/Modal";
import { useSession } from "next-auth/react";
import { app } from "../../../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const CreatePost = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);

  const router = useRouter();
  const postId = Date.now().toString();

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

  useEffect(() => {
    if (session) {
      setIsLoading(false);
    }
  }, [session]);

  const uploadFile = () => {
    const storageRef = ref(storage, "posts/" + file.name);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("File Uploaded");
      })
      .then((res) => {
        getDownloadURL(storageRef).then(async (url) => {
          console.log("Download url", url);
          const postData = {
            id: postId,
            title: title,
            desc: desc,
            link: link,
            image: url,
            category: tags.join(", "),
            userName: session.user.name,
            email: session.user.email,
            userImage: session.user.image,
          };
          await setDoc(doc(db, "blog-post", postId), postData).then(
            (response) => {
              setLoading(true);
              router.push("/" + session.user?.email);
              setTimeout(() => {
                setSuccessMsg(true);
              }, 20000);
            }
          );
        });
      });
  };

  const handleSave = () => {
    if (!title || !desc || !file || !link || tags.length === 0) {
      toggleModal();
      return;
    }
    setCategory(tags.join(", "));
    setLoading(true);
    uploadFile();
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
        <UploadImage setFile={setFile} />
        <div className="">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-gray-500">
              Give A Title To Your Subject :
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
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
          {loading ? "Publishing..." : "Publish"}
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

export default CreatePost;
