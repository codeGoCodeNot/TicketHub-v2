import { stripe } from "@/lib/stripe/stripe";
import { toCurrencyFromCents } from "@/utils/currency";
import CheckoutSessionForm from "./checkout-session-form";

type PricesProps = {
  productId: string;
  organizationId: string | null | undefined;
  activePriceId?: string | null | undefined;
};

const Prices = async ({
  productId,
  organizationId,
  activePriceId,
}: PricesProps) => {
  const prices = await stripe.prices.list({
    active: true,
    product: productId,
  });

  return (
    <div className="flex gap-x-2">
      {prices.data.map((price) => (
        <CheckoutSessionForm
          key={price.id}
          organizationId={organizationId}
          priceId={price.id}
          activePriceId={activePriceId}
        >
          <span className="font-bold text-lg">
            {toCurrencyFromCents(price.unit_amount || 0, price.currency)}
          </span>
          &nbsp;/&nbsp;<span>{price.recurring?.interval}</span>
        </CheckoutSessionForm>
      ))}
    </div>
  );
};

export default Prices;
