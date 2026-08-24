import PaymentSuccess from "@/components/service-details/payment-success";
import { PaymentProvider } from "@/app/service-details/layout";

export default function ServicePaymentSuccessPage() {
  return (
    <PaymentProvider>
      <PaymentSuccess />
    </PaymentProvider>
  );
}