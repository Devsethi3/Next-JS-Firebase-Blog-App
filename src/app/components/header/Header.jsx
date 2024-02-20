"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuMenu } from "react-icons/lu";
import ThemeToggle from "../themeToggle/ThemeToggle";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiArrowDropDownLine, RiCloseCircleLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import SearchBar from "../searchBar/SearchBar";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../../../firebaseConfig";

const Header = () => {
  const router = useRouter();
  const [navToggle, setNavToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("notauthenticated");
  const [user, setUser] = useState(null);
  const { data: session } = useSession();
  const db = getFirestore(app);

  useEffect(() => {
    if (session) {
      setStatus("authenticated");
      saveUserInfo();
    } else {
      setStatus("notauthenticated");
    }
  }, [session]);

  const handleProfile = async () => {
    try {
      router.push(`/${session.user.email}`);
    } catch (error) {
      console.error("Error navigating to profile:", error.message);
    } finally {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      setIsOpen(false);
    }
  };

  const saveUserInfo = async () => {
    if (session && session.user.email) {
      await setDoc(doc(db, "user", session.user.email), {
        userName: session.user.name,
        email: session.user.email,
        userImage: session.user.image,
      });
    }
  };

  const onCreateClick = () => {
    if (session) {
      router.push("/pin-builder");
      toggle();
    } else {
      router.push("/login");
    }
  };

  const toggle = () => {
    setNavToggle(!navToggle);
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavToggle(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0F172A]">
        <div className="flex border-b-2 dark:border-[#334367] h-[5rem] items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link href="/" className="flex items-center gap-4">
              <div className="relative lg:w-[40px] lg:h-[40px] w-[38px] h-[38px]">
                <Image
                  src="/images/logo.png"
                  fill
                  objectFit="cover"
                  alt="logo"
                />
              </div>
              <p className="text-[1.8rem] font-bold nav-logo-text">LUMINA</p>
            </Link>
          </div>
          <SearchBar />
          <ThemeToggle />

          <div
            className={`flex items-center nav-menu ${
              navToggle ? "show-menu" : ""
            } w-[50%]`}
          >
            <RiCloseCircleLine
              onClick={toggle}
              className="text-5xl nav-close p-2 rounded-full cursor-pointer absolute top-[3%] right-[5%]"
            />
            <div className="nav-list">
              <nav aria-label="Global">
                <ul className="flex items-center nav-links gap-8">
                  <li>
                    <Link onClick={toggle} href="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link onClick={toggle} href="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggle}
                      href="/recent-posts"
                      className="whitespace-nowrap"
                    >
                      Recent Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={toggle}
                      href="/blogs"
                      className="whitespace-nowrap"
                    >
                      Blogs
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex nav-right-links items-center ml-auto nav-right-section gap-4">
              {status === "notauthenticated" ? (
                <div className="sm:flex ml-4 sm:gap-4">
                  <Link
                    onClick={toggle}
                    className="rounded-md login-button bg-teal-600 text-white px-5 py-2.5 font-medium shadow"
                    href="/login"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="flex profile-actions items-center gap-8">
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex relative cursor-pointer items-center"
                  >
                    <Image
                      className="rounded-full cursor-pointer p-2 profile-picture"
                      src={session?.user.image}
                      width={54}
                      height={54}
                      alt="user"
                    />
                    <RiArrowDropDownLine
                      className={`text-3xl transition-transform transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute profile-toggle top-16 mt-2 w-48 rounded-md bg-white dark:bg-[#1a2644] shadow-lg z-[100]"
                      >
                        <ul className="py-1">
                          <li className="profile-toggle-text cursor-pointer">
                            <button
                              className="flex items-center gap-2 border-s-[5px] border-[#fff0] w-full hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-gray-100 dark:bg-[#1a2644] dark:hover:bg-[#263762] px-4 py-3"
                              onClick={handleProfile}
                            >
                              <FaUserCircle className="text-xl" />
                              <span>Profile</span>
                            </button>
                          </li>
                          <li className="flex items-center gap-2 border-s-[5px] border-[#fff0] dark:text-gray-100 hover:border-teal-600 w-full dark:hover:bg-[#263762] hover:text-teal-700 hover:bg-teal-50 px-4 py-3">
                            <button
                              className="flex items-center gap-2"
                              onClick={handleLogout}
                            >
                              <MdLogout className="text-xl" />
                              Logout
                            </button>
                          </li>
                          <li className="flex items-center px-2 py-2">
                            <Image
                              className="rounded-full cursor-pointer p-2"
                              src={session?.user.image}
                              width={40}
                              height={40}
                              alt="user"
                            />
                            <div className="flex flex-col">
                              <p className="text-sm dark:text-gray-300 text-gray-800">
                                {session?.user.name}
                              </p>
                              <span className="text-xs dark:text-gray-400 text-gray-600 mt-[-3px]">
                                {session?.user.email}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={onCreateClick}
                    className="rounded-md whitespace-nowrap text-gray-100 flex items-center gap-2 hover:bg-teal-700 hover:text-white transition-all px-5 py-2.5 bg-teal-600 font-medium shadow"
                  >
                    <span>Create Post</span>
                    <IoMdAddCircleOutline className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div onClick={toggle} className="">
            <button className="rounded nav-toggle p-1 text-gray-700 bg-gray-200 dark:text-gray-300 dark:bg-[#182442] mx-2">
              <LuMenu className="text-[1.5rem]" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
