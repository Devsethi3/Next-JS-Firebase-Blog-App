"use client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import UserPinBuilderSkeleton from "@/app/components/loadingSkeletons/UserPinBuilderSkeleton";
import UserTag from "@/app/components/userTag/UserTag";
import Modal from "@/app/components/modal/Modal";
import { app } from "../../../../firebaseConfig";
import Image from "next/image";
import { TbCloudUpload } from "react-icons/tb";

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
  const [selectedFile, setSelectedFile] = useState(false);

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

  const updatePost = async () => {
    try {
      if (file) {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, "posts/" + file.name);
        const snapshot = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update Firestore document with download URL
        const postData = {
          title: title,
          desc: desc,
          link: link,
          image: downloadURL, // Update image field with download URL
          category: tags.join(", "),
          // Add other fields as needed
        };

        await setDoc(doc(db, "blog-post", postId), postData, { merge: true });
        setLoading(false);
        router.push("/" + session.user?.email);
        setTimeout(() => {
          setSuccessMsg(true);
        }, 2000); // Adjust as needed
      } else {
        // If no file is selected, update Firestore document without changing the image field
        const postData = {
          title: title,
          desc: desc,
          link: link,
          category: tags.join(", "),
          // Add other fields as needed
        };

        await setDoc(doc(db, "blog-post", postId), postData, { merge: true });
        setLoading(false);
        router.push("/" + session.user?.email);
        setTimeout(() => {
          setSuccessMsg(true);
        }, 2000); // Adjust as needed
      }
    } catch (error) {
      console.error("Error updating post: ", error);
      // Handle error
    }
  };
  const handleSave = () => {
    if (!title || !desc || !file || !link || tags.length === 0) {
      toggleModal();
      return;
    }

    setCategory(tags.join(", "));
    setLoading(true);
    updatePost();
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
            <Image
              src={
                selectedFile
                  ? window.URL.createObjectURL(selectedFile)
                  : postDetail?.image
              }
              width={500}
              height={800}
              alt="selected-image"
              className="object-contain p-2 w-full h-[90%]"
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
          text="Blog Updated Successfully"
          theme="success"
        />
      )}
      {fieldsError && (
        <Modal
          toggleModal={toggleModal}
          text="An error might possible for because you didn't save categories tags"
          theme="error"
        />
      )}
    </>
  );
};

export default EditPostPage;
