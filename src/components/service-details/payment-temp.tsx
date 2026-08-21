import { useState } from "react";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const amount = 4999; // $49.99

  async function handleSubmit(event) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Ask our backend to create a PaymentIntent
      const response = await fetch(
        "http://localhost:4242/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create payment");
      }

      // 2. Get the card element
      const cardNumberElement =
        elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error("Card field is not ready");
      }

      // 3. Confirm the PaymentIntent
      const result = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardNumberElement,

            billing_details: {
              name,
              email
            }
          }
        }
      );

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        setSuccess(true);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="success-box">
        <h2>Payment successful 🎉</h2>

        <p>
          Thank you for your payment.
        </p>
      </div>
    );
  }

  return (
    <form
      className="payment-form"
      onSubmit={handleSubmit}
    >

      {/* Customer name */}

      <div className="field">
        <label>
          Cardholder name
        </label>

        <input
          type="text"
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email */}

      <div className="field">
        <label>
          Email
        </label>

        <input
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Card number */}

      <div className="field">
        <label>
          Card number
        </label>

        <div className="stripe-input">
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#222",
                  fontFamily:
                    "Arial, sans-serif",
                  "::placeholder": {
                    color: "#999"
                  }
                },

                invalid: {
                  color: "#dc2626"
                }
              }
            }}
          />
        </div>
      </div>

      {/* Expiry + CVC */}

      <div className="row">

        <div className="field">
          <label>
            Expiration
          </label>

          <div className="stripe-input">
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#222"
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="field">
          <label>
            CVC
          </label>

          <div className="stripe-input">
            <CardCvcElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#222"
                  }
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="pay-button"
      >
        {loading
          ? "Processing..."
          : "Pay $49.99"}
      </button>

    </form>
  );
}

export default CheckoutForm;
