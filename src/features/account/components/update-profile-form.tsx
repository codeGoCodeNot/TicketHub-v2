"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import useActionFeedback from "@/components/form/hooks/use-action-feedback";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { LucideUserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useRef, useState } from "react";
import updateProfile from "../actions/update-profile";
import createCroppedImage from "../utils/create-cropped-image";
import CropImageDialog from "./crop-image-dialog";

type UpdateProfileFormProps = {
  username: string;
  email: string;
  image?: string | null;
};

type CroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const UpdateProfileForm = ({
  username,
  email,
  image,
}: UpdateProfileFormProps) => {
  const [actionState, action] = useActionState(
    updateProfile,
    EMPTY_ACTION_STATE,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(image ?? null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CroppedArea | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { refetch } = authClient.useSession();

  useActionFeedback(actionState, {
    onSuccess: () => {
      refetch();
      router.refresh();
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    setCropDialogOpen(true);
  };

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CroppedArea) => {
      setCroppedArea(croppedAreaPixels);
    },
    [],
  );

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedArea) return;

    const file = inputRef.current?.files?.[0];
    const mimeType = file?.type ?? "image/jpeg";

    const croppedFile = await createCroppedImage(
      cropSrc,
      croppedArea,
      mimeType,
    );
    setPreviewUrl(URL.createObjectURL(croppedFile));

    const dt = new DataTransfer();
    dt.items.add(croppedFile);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;

    setCropDialogOpen(false);
  };

  return (
    <>
      <Form action={action} actionState={actionState}>
        <div className="flex flex-col items-center gap-y-2">
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer relative w-24 h-24 rounded-full overflow-hidden border"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                key={previewUrl}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <LucideUserCircle className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Click to change photo</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
          />

          <input
            type="file"
            ref={fileInputRef}
            name="image"
            accept="image/png,image/jpg,image/jpeg"
            className="hidden"
          />
        </div>

        <Input
          name="email"
          placeholder="Email"
          defaultValue={(actionState.payload?.get("email") as string) ?? email}
        />
        <FieldError actionState={actionState} name="email" />

        <Input
          name="name"
          placeholder="Username"
          defaultValue={
            (actionState.payload?.get("name") as string) ?? username
          }
        />
        <FieldError actionState={actionState} name="name" />

        <SubmitButton label="Save Changes" />
      </Form>
      <CropImageDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        cropSrc={cropSrc}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onConfirm={handleCropConfirm}
      />
    </>
  );
};

export default UpdateProfileForm;
