"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import createCheckoutSession from "../actions/create-checkout-session";
import clsx from "clsx";
import createCustomerPortal from "../actions/create-customer-portal";

type CheckoutSessionFormProps = {
  priceId: string;
  organizationId: string | null | undefined;
  children: React.ReactNode;
  activePriceId?: string | null | undefined;
};

const CheckoutSessionForm = ({
  priceId,
  organizationId,
  children,
  activePriceId,
}: CheckoutSessionFormProps) => {
  const [actionState, action] = useActionState(
    !activePriceId
      ? createCheckoutSession.bind(null, organizationId, priceId)
      : createCustomerPortal.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  const isActivePrice = activePriceId === priceId;

  return (
    <Form action={action} actionState={actionState}>
      <Button
        type="submit"
        variant="outline"
        disabled={isActivePrice}
        className={clsx("flex flex-col", {
          "h-16": !!activePriceId,
        })}
      >
        {!activePriceId ? null : isActivePrice ? (
          <span>Current Plan</span>
        ) : (
          <span>Change Plan</span>
        )}
        <div>{children}</div>
      </Button>
    </Form>
  );
};

export default CheckoutSessionForm;
