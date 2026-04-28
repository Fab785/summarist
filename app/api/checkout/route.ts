import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    const isYearly = plan === "yearly";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: isYearly ? 9900 : 999,
            recurring: {
              interval: isYearly ? "year" : "month",
            },
            product_data: {
              name: isYearly
                ? "Summarist Premium Plus"
                : "Summarist Premium",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: isYearly
        ? {
            trial_period_days: 7,
          }
        : undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}