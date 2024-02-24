"use client";
import { useState } from "react";
import Image from "next/image";
import { TbCloudUpload } from "react-icons/tb";

const UploadImage = ({ setFile }) => {
  const [selectedFile, setSelectedFile] = useState();
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label
          for="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-[60vh] lg:h-[95vh] border-2 bg-[#f7fffe] hover:bg-[#ebfffd] transition-all dark:border-[#2c415f] dark:bg-[#1e2a41] dark:hover:bg-[#26354f] border-dashed rounded-lg cursor-pointer"
        >
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <TbCloudUpload className="text-8xl text-gray-600" />
              <p className="mb-2 text-xl text-gray-500 mt-4 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
          ) : null}
          {selectedFile ? (
            <Image
              src={window.URL.createObjectURL(selectedFile)}
              width={500}
              height={800}
              alt="selected-image"
              className="object-contain p-2 w-full h-[90%]  "
            />
          ) : null}
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
    </div>
  );
};

export default UploadImage;
