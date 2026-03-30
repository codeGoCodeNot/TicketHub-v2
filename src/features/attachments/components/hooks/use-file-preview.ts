import { useRef, useState } from "react";
import { ACCEPTED } from "../../constants";

type PreviewFile = {
  file: File;
  previewURL: string | null;
};

const useFilePreview = () => {
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const IMAGE_TYPES = ACCEPTED.filter((type) => type.startsWith("image/"));
    const newPreviews = files.map((file) => ({
      file,
      previewURL: IMAGE_TYPES.includes(file.type)
        ? URL.createObjectURL(file)
        : null,
    }));

    setPreviews(newPreviews);
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      const dt = new DataTransfer();
      updated.forEach((preview) => dt.items.add(preview.file));
      if (inputRef.current) inputRef.current.files = dt.files;
      return updated;
    });
  };

  const reset = () => {
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return {
    previews,
    inputRef,
    handleFileChange,
    handleRemove,
    reset,
  };
};

export default useFilePreview;
