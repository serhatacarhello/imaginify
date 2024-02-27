import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { Loader } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";

const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = () => {
    //
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <button className="download-btn" onClick={(e) => downloadHandler}>
            <Image
              src={"/assets/icons/download.svg"}
              alt="Download"
              className="pb-1.5"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            src={image.publicId}
            alt={image.title}
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            sizes="(max-width:767px) 100vw, 50vw"
            placeholder={dataUrl as PlaceholderValue}
            className="transformed-image"
            // try
            // preserveTransformations

            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src={"/assets/icons/spinner.svg"}
                width={50}
                height={50}
                alt="spinner"
              />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};

export default TransformedImage;