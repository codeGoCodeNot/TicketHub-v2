"use client";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import CropImageDialog from "@/features/account/components/crop-image-dialog";
import createCroppedImage from "@/features/account/utils/create-cropped-image";
import { LucideBuilding } from "lucide-react";
import Image from "next/image";
import { useActionState, useCallback, useRef, useState } from "react";
import updateOrganization from "../actions/update-organization";
import useActionFeedback from "@/components/form/hooks/use-action-feedback";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type CroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type UpdateOrganizationFormProps = {
  organizationId: string;
  name: string;
  slug: string;
  logo?: string | null;
};

const UpdateOrganizationForm = ({
  organizationId,
  name,
  slug,
  logo,
}: UpdateOrganizationFormProps) => {
  const [actionState, action] = useActionState(
    updateOrganization.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(logo ?? null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CroppedArea | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { refetch } = authClient.useActiveOrganization();

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
    <div className="w-full justify-center flex">
      <div className="w-full max-w-[420px]">
        <Form action={action} actionState={actionState}>
          <div className="flex flex-col items-center gap-y-2 justify-center">
            <div
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer relative w-24 h-24 rounded-lg overflow-hidden border"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  key={previewUrl}
                  alt="Organization Logo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <LucideBuilding className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to change logo
            </p>
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
              name="logo"
              accept="image/png,image/jpg,image/jpeg"
              className="hidden"
            />
          </div>

          <Input
            name="name"
            placeholder="Organization Name"
            defaultValue={(actionState.payload?.get("name") as string) ?? name}
          />
          <FieldError actionState={actionState} name="name" />

          <Input
            name="slug"
            placeholder="organization-slug"
            defaultValue={(actionState.payload?.get("slug") as string) ?? slug}
          />
          <FieldError actionState={actionState} name="slug" />

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
      </div>
    </div>
  );
};

export default UpdateOrganizationForm;
