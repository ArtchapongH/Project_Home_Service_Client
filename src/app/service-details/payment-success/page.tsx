import NavbarResponsive from "@/components/service-details/navbar-responsive";
import PaymentSuccess from "@/components/service-details/payment-success";
import { PaymentProvider } from "@/app/service-details/layout";
import { AuthProvider } from "@/contexts/AuthContext";

export default function serverPaymentSuccessPage() {
  return(
    <>
    <AuthProvider>
      <PaymentProvider>
        <PaymentSuccess />
      </PaymentProvider>
     </AuthProvider> 
    </>
  ) 
}