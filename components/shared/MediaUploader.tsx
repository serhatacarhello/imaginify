"use client";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  image: any;
  setImage: React.Dispatch<any>;
  publicId: string;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  image,
  setImage,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    onValueChange(result?.info?.public_id);

    toast({
      variant: "default",
      title: "Image upload successfully.",
      description: "1 credit was deducted from your account.",
      className: "success-toast",
      duration: 5000,
    });
  };

  const onUploadErrorHandler = () => {
    toast({
      variant: "destructive",
      title: "Something went wrong.",
      description: "Please try again.",
      className: "error-toast",
      duration: 5000,
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="jsm_imaginify"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>
          {publicId && (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                src={publicId}
                alt="image"
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                sizes="(max-width:767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          )}

          {!publicId && (
            <div
              className="media-uploader_cta"
              onClick={() => {
                open();
              }}
            >
              <div className="media-uploader_cta-image">
                <Image
                  src={"/assets/icons/add.svg"}
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
