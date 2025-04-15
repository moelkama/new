"use client";
import { FiFile, FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import Icon from "../Icon";

const styles = tv({
  slots: {
    container: "flex w-full flex-col",
    dropzone:
      "flex flex-col items-center justify-around rounded-lg border-1 border-dashed p-4 transition-colors",
    previewContainer: "mb-4 grid w-full grid-cols-3 gap-3",
    previewItem:
      "relative aspect-square overflow-hidden rounded-lg border border-gray-200",
    previewImage: "h-full w-full object-cover",
    previewFile: "flex h-full w-full items-center justify-center bg-gray-100",
    removeButton:
      "absolute top-2 right-2 rounded-full border-2 border-red-500 bg-red-200 text-red-500 transition-colors hover:bg-red-300",
    uploadText: "text-center text-[12px] uppercase",
    separator: "my-2 flex w-full items-center text-[10px]",
    separatorLine: "flex-1 border-t border-gray-300",
    separatorText: "px-4 text-sm font-medium text-gray-500",
    browseButton:
      "text-brand-main border-brand-main hover:bg-brand-accent/80 mt-3 rounded-md border bg-white px-4 py-2 text-[12px] font-medium transition-colors",
  },
  variants: {
    isDragging: {
      true: {
        dropzone: "bg-brand-accent/10 hover:border-brand-main",
      },
      false: {
        dropzone: "border-brand-main",
      },
    },
    hasError: {
      true: {
        dropzone: "border-error text-error",
      },
      false: {},
    },
    hasFiles: {
      true: {
        dropzone: "pt-4 pb-3",
      },
      false: {
        dropzone: "",
      },
    },
  },
  defaultVariants: {
    isDragging: false,
    hasError: false,
    hasFiles: false,
  },
});

export interface FileWithPreview extends File {
  id: string;
  preview: string;
}

interface FileUploaderProps {
  maxFiles?: number;
  accept?: string;
  maxSize?: number; // in bytes
  onChange?: (files: FileWithPreview[]) => void;
  className?: string;
  dropzoneText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  maxFiles = 5,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  onChange,
  className,
  dropzoneText = "Drag your files here to start uploading",
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const {
    container,
    dropzone,
    previewContainer,
    previewItem,
    previewImage,
    previewFile,
    removeButton,
    uploadText,
    separator,
    separatorLine,
    separatorText,
    browseButton,
  } = styles();

  const handleFiles = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Validate file count
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles
        .filter((file) => {
          // Validate file size
          if (file.size > maxSize) {
            setError(
              `File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
            );
            return false;
          }

          // Validate file type if accept is provided
          if (accept && !file.type.match(accept.replace("*", ".*"))) {
            setError(`File ${file.name} is not a valid type`);
            return false;
          }

          return true;
        })
        .map((file) => {
          const id = `${file.name}-${Date.now()}`;
          const preview = URL.createObjectURL(file);
          return Object.assign(file, { preview, id });
        });

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, maxFiles, maxSize, accept, onChange],
  );

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
      }
    },
    [handleFiles],
  );

  // Use useState to track drag state for styling
  const [isDragging, setIsDragging] = useState(false);

  // Set up event handlers for drag state
  useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (!dropzone) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
      }
    };

    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);

    return () => {
      dropzone.removeEventListener("dragenter", handleDragEnter);
      dropzone.removeEventListener("dragover", handleDragOver);
      dropzone.removeEventListener("dragleave", handleDragLeave);
      dropzone.removeEventListener("drop", handleDrop);
    };
  }, [handleFiles]);

  return (
    <div className={container({ className })}>
      <div
        ref={dropzoneRef}
        className={dropzone({
          isDragging,
          hasError: !!error,
          hasFiles: files.length > 0,
        })}
      >
        {/* Preview Images Section */}
        {files.length > 0 && (
          <div className={previewContainer()}>
            {files.map((file) => (
              <div key={file.id} className={previewItem()}>
                {file.type.startsWith("image/") ? (
                  <Image
                    src={file.preview}
                    alt={file.name}
                    className={previewImage()}
                    width={114}
                    height={114}
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className={previewFile()}>
                    <FiFile size={24} />
                    <p className="mt-2 truncate px-2 text-center text-xs">
                      {file.name}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className={removeButton()}
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropzone Text */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <Icon
              as={FiUpload}
              wrapperSize="sm"
              iconSize="sm"
              wrapperClassName="text-brand-main bg-light-1"
            />
            <p className={uploadText()}>{dropzoneText}</p>
          </div>
          {error && <p className="text-error mt-2 text-sm">{error}</p>}
        </div>

        {/* Separator */}
        <div className={separator()}>
          <div className={separatorLine()} />
          <span className={separatorText()}>OR</span>
          <div className={separatorLine()} />
        </div>

        {/* Browse Button */}
        <button
          type="button"
          className={browseButton()}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          Browse Files
        </button>

        {/* Hidden File Input */}
        <input
          id="file-upload"
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default FileUploader;
