import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("=== CHECKOUT CALLED ===");
  console.log("STRIPE_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("STRIPE_KEY starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 10));

  if (!process.env.STRIPE_SECRET_KEY) {
    console.log("ERROR: No Stripe key");
    return NextResponse.json({ error: "Stripe key missing" }, { status: 500 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    console.log("Stripe initialized");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "OrigineTrace — Full Origin Profile",
            },
            unit_amount: 490,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://originetrace.com/preview?paid=true",
      cancel_url: "https://originetrace.com/preview",
    });

    console.log("Session created:", session.id);
    return NextResponse.json({ url: session.url });

  } catch (error: unknown) {
    const err = error as { message?: string; type?: string };
    console.error("STRIPE ERROR:", err.message);
    console.error("ERROR TYPE:", err.type);
    return NextResponse.json(
      {
        error: err.message ?? String(error),
        type: err.type,
      },
      { status: 500 }
    );
  }
}
