"use client";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Modal from "@/components/ui/Modal";
import { FiMail, FiTag, FiFileText, FiDollarSign } from "react-icons/fi";
import FileUploader, {
  FileWithPreview,
} from "@/components/ui/FileUploader/FileUploader";
import Button from "@/components/ui/Button";

const EditMealModal = () => {
  const [, setProductImages] = useState<FileWithPreview[]>([]);

  const handleFileChange = (files: FileWithPreview[]) => {
    setProductImages(files);
  };

  return (
    <Modal
      modalType="edit_meal_modal"
      title="Edit Article"
      description="Store settings"
      variant="aside"
      position="right"
      hideTitle={false}
      titleClassName="text-2xl font-semibold"
      contentClassName="flex flex-col h-full"
    >
      {/* Content area with no automatic overflow */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-6 border-b border-gray-200 pb-6">
          <h4 className="mb-1 text-[16px] font-medium uppercase">
            Product Upload
          </h4>
          <p className="mb-5 text-[13px] text-[#6D6D6D]">
            Add your product here, and you can upload up to 5 product images
          </p>
          <FileUploader
            maxFiles={5}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            onChange={handleFileChange}
            dropzoneText="Drag your Product to start uploading"
          />
        </div>

        <div className="py-6">
          <div className="flex flex-col gap-4">
            <InputField
              label="PRODUCT NAME"
              type="text"
              icon={<FiTag size={18} />}
              iconClassName="size-[44px]"
              labelClassName="text-md"
              variant="secondary"
              size="sm"
              placeholder="Enter product name"
            />
            <InputField
              label="SECTION"
              type="text"
              icon={<FiMail size={18} />}
              iconClassName="size-[44px]"
              labelClassName="text-md"
              variant="secondary"
              size="sm"
              placeholder="Select product category"
            />
            <InputField
              label="DESCRIPTION"
              type="textarea"
              icon={<FiFileText size={18} />}
              iconClassName="size-[44px]"
              labelClassName="text-md"
              variant="secondary"
              size="sm"
              placeholder="Enter product description"
            />
            <InputField
              label="PRICE (MAD)"
              type="text"
              icon={<FiDollarSign size={18} />}
              iconClassName="size-[44px]"
              labelClassName="text-md"
              variant="secondary"
              size="sm"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Button area */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white py-4">
        <Button size="lg" className="w-full font-semibold">
          Confirm Edit
        </Button>
      </div>
    </Modal>
  );
};

export default EditMealModal;
