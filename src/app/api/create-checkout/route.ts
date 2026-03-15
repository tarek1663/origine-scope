import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const BASE_URL = "https://originetrace.com";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe key missing" }, { status: 500 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
    const url = new URL(req.url);
    const expired = url.searchParams.get("expired") === "true";
    const unitAmount = expired ? 990 : 490; // $9.90 or $4.90

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "OrigineTrace — Full Origin Profile",
              description: "Unlock your complete ethnic origin analysis",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}/preview?paid=true`,
      cancel_url: `${BASE_URL}/preview`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
