import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripe } from "@/lib/stripe/stripe";
import { LucideBadgeCheck, LucideCheck } from "lucide-react";
import Prices from "./prices";
import getStripeCustomer from "../queries/get-stripe-customer";

type ProductsProps = {
  organizationId: string | null | undefined;
  productId?: string;
};

const Products = async ({ organizationId }: ProductsProps) => {
  if (!organizationId) return null;

  const products = await stripe.products.list({
    active: true,
  });

  const stripeCustomer = await getStripeCustomer(organizationId);
  const subscriptionStatus = stripeCustomer?.subscriptionStatus;

  const activeSubscription = subscriptionStatus === "active";
  const activeProductId = activeSubscription ? stripeCustomer?.productId : null;
  const activePriceId = activeSubscription ? stripeCustomer?.priceId : null;

  return (
    <div className="flex-1 flex flex-col lg:flex-row justify-center items-center gap-4">
      {products.data.map((product) => (
        <Card key={product.id} className="w-72">
          <CardHeader>
            <CardTitle>
              <span className="flex justify-between">
                {product.name}
                {activeProductId === product.id && <LucideBadgeCheck />}
              </span>
            </CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {product.marketing_features.map((feature) => (
              <div key={feature.name} className="flex gap-x-2 items-center">
                <LucideCheck />
                {feature.name}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Prices
              productId={product.id}
              organizationId={organizationId}
              activePriceId={activePriceId}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Products;
