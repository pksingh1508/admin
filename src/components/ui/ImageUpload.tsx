"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError
} from "@imagekit/next";
import { UPLOAD_CONFIG } from "@/lib/imagekit";

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string, imageData: any) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  currentImage,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Authenticate and get upload credentials
  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      return `File size must be less than ${
        UPLOAD_CONFIG.maxFileSize / (1024 * 1024)
      }MB`;
    }

    // Check file format
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (
      !fileExtension ||
      !UPLOAD_CONFIG.allowedFormats.includes(fileExtension)
    ) {
      return `File format must be one of: ${UPLOAD_CONFIG.allowedFormats.join(
        ", "
      )}`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);

    // Start upload
    handleUpload(file);
  };

  // Handle upload
  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      // Get authentication parameters
      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      // Upload file
      const uploadResponse = await upload({
        file,
        fileName: `${Date.now()}-${file.name}`,
        folder: UPLOAD_CONFIG.folder,
        signature,
        expire,
        token,
        publicKey,
        onProgress: (event) => {
          const progressPercent = (event.loaded / event.total) * 100;
          setProgress(progressPercent);
        },
        abortSignal: abortControllerRef.current.signal
      });

      // Success
      if (!uploadResponse.url) {
        throw new Error("Upload successful but no URL received");
      }
      onUploadSuccess(uploadResponse.url, uploadResponse);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      setProgress(0);
      setPreview(currentImage || "");

      let errorMessage = "Upload failed";

      if (error instanceof ImageKitAbortError) {
        errorMessage = "Upload cancelled";
      } else if (error instanceof ImageKitInvalidRequestError) {
        errorMessage = `Invalid request: ${error.message}`;
      } else if (error instanceof ImageKitUploadNetworkError) {
        errorMessage = `Network error: ${error.message}`;
      } else if (error instanceof ImageKitServerError) {
        errorMessage = `Server error: ${error.message}`;
      }

      onUploadError?.(errorMessage);
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploading(false);
      setProgress(0);
      setPreview(currentImage || "");
    }
  };

  // Remove image
  const removeImage = () => {
    setPreview("");
    onUploadSuccess("", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              disabled={disabled || uploading}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="mb-2">Uploading...</div>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm">{Math.round(progress)}%</div>
                  <button
                    onClick={cancelUpload}
                    className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Click to upload an image</p>
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: {UPLOAD_CONFIG.allowedFormats.join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                Max size: {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={UPLOAD_CONFIG.allowedFormats
          .map((format) => `.${format}`)
          .join(",")}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
