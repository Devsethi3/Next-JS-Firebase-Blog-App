"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import FeatureSectionSkeleton from "../loadingSkeletons/FeatureSectionSkeleton";

const HeroSection = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-[2rem]">
      <h1 className="text-[2.4rem] leading-[2.5rem] lg:text-left text-center md:text-5xl lg:text-5xl xl:text-7xl">
        <span className="font-bold">Hey, Dev Sethi Here!</span> Discover my
        stories, thoughts and creative ideas
      </h1>
      {!isLoading ? (
        <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center gap-6 mt-[3rem]">
          <div className="img-container relative h-[350px] lg:h-[450px]">
            <Image
              objectFit="cover"
              src="/images/home-image.jpg"
              className="image rounded-md"
              fill
              alt="home"
            />
          </div>
          <div className="content">
            <h1 className="text-2xl xl:text-4xl lg:text-3xl md:text-3xl hero-text title mb-8 font-semibold">
              Become a Co-Creator: Share Your Stories, Engage with Ideas, and
              Contribute to the Creative Spark
            </h1>
            <p>
              Welcome to this vibrant community where storytelling meets
              inspiration! Dive into a tapestry of captivating narratives, share
              your own unique experiences, and join forces with fellow creators
              to ignite the boundless flame of imagination. Here, collaboration
              is king: contribute your ideas, engage in stimulating discussions,
              and let your creative spark illuminate the world. Together, we can
              weave a shared tapestry of stories, build a haven for innovative
              minds, and empower each other to become the co-creators of
              something extraordinary.
            </p>
            <button
              onClick={() => router.push("/about")}
              className="bg-teal-600 mt-8 hover:bg-transparent flex items-center gap-2 py-2 border-2 hover:text-teal-500 border-[#ffffff03] hover:border-teal-700 px-7 rounded-md text-white transition-colors duration-300"
            >
              <FaBook className="text-xl" />
              <span>Read More</span>
            </button>
          </div>
        </div>
      ) : (
        <FeatureSectionSkeleton />
      )}
    </div>
  );
};

export default HeroSection;
