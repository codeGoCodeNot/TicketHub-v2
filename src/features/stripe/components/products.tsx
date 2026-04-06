import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripe } from "@/lib/stripe/stripe";
import { LucideCheck } from "lucide-react";
import Prices from "./prices";

type ProductsProps = {
  organizationId: string | null | undefined;
  productId?: string;
};

const Products = async ({ organizationId }: ProductsProps) => {
  const products = await stripe.products.list({
    active: true,
  });

  return (
    <div className="flex-1 flex justify-center items-center gap-x-4">
      {products.data.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
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
            <Prices productId={product.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Products;
