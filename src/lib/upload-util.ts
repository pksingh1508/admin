import { UploadFile } from "@/hooks/use-imagekit-upload";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getFileIcon = (file: File): string => {
  if (file.type.startsWith("image/"))
    return "🖼️";
  if (file.type.startsWith("video/"))
    return "🎥";

  return "📄";
};

export const getStatusIcon = (status: UploadFile["status"]): string => {
  switch (status) {
    case "success":
      return "✅";
    case "error":
      return "❌";
    case "uploading":
      return "⏳";
    default:
      return "⭕";
  }
};
