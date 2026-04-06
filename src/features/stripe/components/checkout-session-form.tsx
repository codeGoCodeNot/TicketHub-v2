"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import createCheckoutSession from "../actions/create-checkout-session";

type CheckoutSessionFormProps = {
  priceId: string;
  organizationId: string | null | undefined;
  children: React.ReactNode;
};

const CheckoutSessionForm = ({
  priceId,
  organizationId,
  children,
}: CheckoutSessionFormProps) => {
  const [actionState, action] = useActionState(
    createCheckoutSession.bind(null, organizationId, priceId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit" variant="outline">
        {children}
      </Button>
    </Form>
  );
};

export default CheckoutSessionForm;
