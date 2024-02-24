"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

const UserTag = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="mt-5 flex items-center gap-2">
        <Image
          className="rounded-full cursor-pointer p-2 profile-picture"
          src={session?.user.image}
          width={54}
          height={54}
          alt="user"
        />
        <div className="flex flex-col">
          <p className="opacity-70 font-medium">{session?.user.name}</p>
          <span className="text-sm text-gray-600 mt-[-3px]">
            {session?.user.email}
          </span>
        </div>
      </div>
    </>
  );
};

export default UserTag;
