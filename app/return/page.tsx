import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import SuccessUI from "@/components/SuccessUI";

interface ReturnPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function Return({ searchParams }: ReturnPageProps) {
  const params = await searchParams;
  const session_id = params.session_id;

  if (!session_id) {
    return redirect("/");
  }

  // Retrieve the session
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const status = session.status;
  const customerEmail = session.customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    // Pass the extracted data to the Client Component
    return <SuccessUI customerEmail={customerEmail} />;
  }

  // Fallback for unexpected status
  return redirect("/");
}