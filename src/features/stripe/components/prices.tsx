import { stripe } from "@/lib/stripe/stripe";
import { toCurrencyFromCents } from "@/utils/currency";

type PricesProps = {
  productId: string;
  organizationId: string | null | undefined;
};

const Prices = async ({ productId, organizationId }: PricesProps) => {
  const prices = await stripe.prices.list({
    active: true,
    product: productId,
  });

  return (
    <div className="flex gap-x-2">
      {prices.data.map((price) => (
        <button key={price.id}>
          <span className="font-bold text-lg">
            {toCurrencyFromCents(price.unit_amount || 0, price.currency)}
          </span>
          &nbsp;/&nbsp;<span>{price.recurring?.interval}</span>
        </button>
      ))}
    </div>
  );
};

export default Prices;
