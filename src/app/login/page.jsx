"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <>
      <section className="">
        <div className="py-2 lg:py-8">
          <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6"></aside>

          <main className="flex items-center justify-center lg:col-span-7 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <h1 className="mt-[-2rem] lg:mt-8 login-heading text-center text-3xl font-bold sm:text-3xl md:text-4xl">
               Welcome the Blog App Login to Continue
              </h1>

              <div className="mt-4 text-center leading-relaxed text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Exercitationem saepe natus <br />{" "}
                <p className="hidden md:block">
                  tempore iure a necessitatibus veritatis, iste doloremque!
                  Voluptate, quo.
                </p>
              </div>

              <div>
                <button
                  onClick={() => signIn()}
                  className="flex w-full bg-teal-50 dark:bg-[#334367] dark:text-gray-200 justify-center py-2.5 font-medium text-gray-800 mt-4 rounded-md items-center gap-3"
                >
                  <FcGoogle className="text-xl" />
                  <span>Login With Google</span>
                </button>
              </div>

              <span className="relative mt-5 flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative z-10 bg-white dark:bg-[#0F172A] px-6">or</span>
              </span>

              <form action="#" className="mt-5 grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label
                    htmlFor="Email"
                    className="block font-medium text-gray-700"
                  >
                    {" "}
                    Email{" "}
                  </label>

                  <input
                    placeholder="johndoe@gmail.com"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    id="Email"
                    name="email"
                    className="mt-1 w-full dark:bg-[#334367] placeholder:text-gray-300 dark:placeholder:opacity-50 bg-teal-50 rounded-md py-2 border-2 border-transparent px-4 outline-none focus-visible:border-2 focus-visible:border-cyan-400 "
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="Password"
                    className="block font-medium text-gray-700"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <input
                    placeholder="At Least 6 digits"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    id="Password"
                    name="password"
                    className="mt-1 w-full dark:bg-[#334367] bg-teal-50  placeholder:text-gray-300 dark:placeholder:opacity-50 rounded-md py-2 border-2 border-transparent px-4 outline-none focus-visible:border-2 focus-visible:border-cyan-400  "
                  />
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor="MarketingAccept"
                    className="flex gap-4 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="MarketingAccept"
                      name="marketing_accept"
                      className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                    />

                    <span className="text-gray-600 text-sm">
                      I want to receive emails about events, product updates and
                      company announcements.
                    </span>
                  </label>
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our
                    <a href="#" className="text-gray-700 underline">
                      {" "}
                      terms and conditions{" "}
                    </a>
                    and
                    <a href="#" className="text-gray-700 underline">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button className="inline-block shrink-0 rounded-md border-2 border-teal-600 bg-teal-600 px-8 py-2.5 font-medium text-white transition hover:bg-transparent hover:text-teal-600 focus:outline-none focus:ring active:text-teal-500">
                    Create an account
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
