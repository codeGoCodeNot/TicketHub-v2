type CroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const createCroppedImage = async (
  imageSrc: string,
  croppedArea: CroppedArea,
  mimeType: string = "image/jpeg",
): Promise<File> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = croppedArea.width;
  canvas.height = croppedArea.height;
  const ctx = canvas.getContext("2d");

  ctx?.drawImage(
    image,
    croppedArea.x,
    croppedArea.y,
    croppedArea.width,
    croppedArea.height,
    0,
    0,
    croppedArea.width,
    croppedArea.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const extension = mimeType === "image/png" ? "png" : "jpg";
      resolve(new File([blob!], `profile.${extension}`, { type: mimeType }));
    }, mimeType);
  });
};

export default createCroppedImage;
