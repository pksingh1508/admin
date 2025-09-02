"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/util";
import { Progress } from "@/components/ui/progress";
import { formatFileSize, getFileIcon, getStatusIcon } from "@/lib/upload-util";
import { X, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

interface BlogImageUploadProps {
  onImageUploaded: (url: string) => void;
}

const BlogImageUpload = ({ onImageUploaded }: BlogImageUploadProps) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  const {
    files,
    addFiles,
    removeFile,
    clearAllFiles,
    uploadAllFiles,
    retryFile,
    pendingCount,
    uploadingCount,
    successCount,
    errorCount,
    isUploading,
    hasFiles,
    allComplete
  } = useImageKitUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"]
    },
    multiple: false // Only single image for blog
  });

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleUploadAll = () => {
    uploadAllFiles({ folder: "/blog-images" });
  };

  const handleRetry = (id: string) => {
    retryFile(id, { folder: "/blog-images" });
  };

  const handleModalClose = (open: boolean) => {
    setUploadModalOpen(open);
    
    // Check for successful uploads and pass URL to parent
    if (!open && successCount > 0) {
      const successfulFiles = files.filter(file => file.status === "success" && file.url);
      if (successfulFiles.length > 0) {
        const latestUpload = successfulFiles[successfulFiles.length - 1];
        if (latestUpload.url) {
          onImageUploaded(latestUpload.url);
          toast.success("Image uploaded successfully!");
          clearAllFiles(); // Clear files after successful upload
        }
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleUploadClick}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Image
      </Button>
      
      <Dialog open={uploadModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Blog Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                "cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors",
                isDragActive && "bg-blue-50 border-blue-300"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the image here...</p>
              ) : (
                <div>
                  <p className="mb-2 text-gray-600">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PNG, JPG, JPEG, GIF, WebP
                  </p>
                </div>
              )}
            </div>

            {hasFiles && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Image ({files.length})</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFiles}
                    disabled={isUploading}
                  >
                    Clear
                  </Button>
                </div>

                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="flex items-center">
                        <span className="text-lg">{getFileIcon(uploadFile.file)}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getStatusIcon(uploadFile.status)}</span>
                        <span className="min-w-16 text-sm font-medium">
                          {uploadFile.status === "success" && "Complete"}
                          {uploadFile.status === "error" && "Failed"}
                          {uploadFile.status === "uploading" &&
                            `${uploadFile.progress}%`}
                          {uploadFile.status === "pending" && "Ready"}
                        </span>

                        <div className="flex items-center gap-1">
                          {uploadFile.status === "error" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetry(uploadFile.id)}
                              disabled={isUploading}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                            disabled={uploadFile.status === "uploading"}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {uploadFile.status === "uploading" && (
                      <Progress value={uploadFile.progress} className="w-full" />
                    )}

                    {uploadFile.status === "error" && uploadFile.error && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <span>❌</span>
                        {uploadFile.error}
                      </div>
                    )}

                    {uploadFile.status === "success" && uploadFile.url && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>✅</span>
                        <span className="flex-1">
                          Image uploaded successfully!
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500">
              {errorCount > 0 && (
                <span className="text-red-500">{errorCount} failed</span>
              )}
              {successCount > 0 && errorCount > 0 && " • "}
              {successCount > 0 && (
                <span className="text-green-600">{successCount} uploaded</span>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => handleModalClose(false)}
                disabled={isUploading}
              >
                {allComplete ? "Done" : "Cancel"}
              </Button>

              {pendingCount > 0 && (
                <Button
                  onClick={handleUploadAll}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading
                    ? "Uploading..."
                    : `Upload Image`}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogImageUpload;
