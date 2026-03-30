import {
  LucideArchive,
  LucideFile,
  LucideFileCode,
  LucideFileSpreadsheet,
  LucideFileText,
  LucideImage,
  LucidePresentation,
  LucideVideo,
} from "lucide-react";

type FileIconConfig = {
  icon: React.ElementType;
  className: string;
};

const FILE_TYPE_MAP: Record<string, FileIconConfig> = {
  // Images
  png: { icon: LucideImage, className: "text-blue-500" },
  jpg: { icon: LucideImage, className: "text-blue-500" },
  jpeg: { icon: LucideImage, className: "text-blue-500" },
  gif: { icon: LucideImage, className: "text-blue-500" },
  webp: { icon: LucideImage, className: "text-blue-500" },
  svg: { icon: LucideImage, className: "text-blue-500" },

  // Documents
  pdf: { icon: LucideFileText, className: "text-red-500" },
  doc: { icon: LucideFileText, className: "text-blue-700" },
  docx: { icon: LucideFileText, className: "text-blue-700" },
  txt: { icon: LucideFileText, className: "text-gray-500" },

  // Spreadsheets
  xls: { icon: LucideFileSpreadsheet, className: "text-green-600" },
  xlsx: { icon: LucideFileSpreadsheet, className: "text-green-600" },
  csv: { icon: LucideFileSpreadsheet, className: "text-green-600" },

  // Presentations
  ppt: { icon: LucidePresentation, className: "text-orange-500" },
  pptx: { icon: LucidePresentation, className: "text-orange-500" },

  // Code
  js: { icon: LucideFileCode, className: "text-yellow-500" },
  ts: { icon: LucideFileCode, className: "text-blue-400" },
  tsx: { icon: LucideFileCode, className: "text-blue-400" },
  jsx: { icon: LucideFileCode, className: "text-yellow-400" },
  html: { icon: LucideFileCode, className: "text-orange-400" },
  css: { icon: LucideFileCode, className: "text-purple-400" },
  json: { icon: LucideFileCode, className: "text-gray-400" },

  // Video
  mp4: { icon: LucideVideo, className: "text-pink-500" },
  mov: { icon: LucideVideo, className: "text-pink-500" },
  avi: { icon: LucideVideo, className: "text-pink-500" },

  // Archives
  zip: { icon: LucideArchive, className: "text-yellow-700" },
  tar: { icon: LucideArchive, className: "text-yellow-700" },
  gz: { icon: LucideArchive, className: "text-yellow-700" },
  rar: { icon: LucideArchive, className: "text-yellow-700" },
};

const FALLBACK: FileIconConfig = {
  icon: LucideFile,
  className: "text-muted-foreground",
};

const getFileIcon = (filename: string): FileIconConfig => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return FILE_TYPE_MAP[ext] ?? FALLBACK;
};

export default getFileIcon;
