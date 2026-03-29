"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { LucideUserCircle } from "lucide-react";
import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import updateProfile from "../actions/update-profile";
import { authClient } from "@/lib/auth-client";
import useActionFeedback from "@/components/form/hooks/use-action-feedback";
import { useRouter } from "next/navigation";

type UpdateProfileFormProps = {
  username: string;
  email: string;
  image?: string | null;
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
    setPreviewUrl(URL.createObjectURL(file));
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
            name="image"
            accept="image/png,image/jpg,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
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
    </>
  );
};

export default UpdateProfileForm;
