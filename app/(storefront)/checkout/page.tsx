"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, ArrowLeft, ArrowRight, CreditCard, MapPin, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCart, useProducts } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ShippingData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
};

type PaymentData = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
};

type FormErrors<T> = Partial<Record<keyof T, string>>;

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardList },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                currentStep === step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep > step.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted-foreground/30 bg-muted text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1.5 font-medium hidden sm:block",
                currentStep === step.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                "w-16 sm:w-24 h-0.5 mx-2 mt-0 sm:-mt-5 transition-colors",
                currentStep > step.id ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field component
// ---------------------------------------------------------------------------

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function validateShipping(data: ShippingData): FormErrors<ShippingData> {
  const errors: FormErrors<ShippingData> = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.address.trim()) errors.address = "Address is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.state.trim()) errors.state = "State is required";
  if (!data.zip.trim()) {
    errors.zip = "ZIP code is required";
  } else if (!/^\d{5}(-\d{4})?$/.test(data.zip.trim())) {
    errors.zip = "Enter a valid ZIP code (e.g. 12345 or 12345-6789)";
  }
  return errors;
}

function validatePayment(data: PaymentData): FormErrors<PaymentData> {
  const errors: FormErrors<PaymentData> = {};
  const digits = data.cardNumber.replace(/\s/g, "");
  if (!digits) {
    errors.cardNumber = "Card number is required";
  } else if (!/^\d{16}$/.test(digits)) {
    errors.cardNumber = "Card number must be 16 digits";
  }
  if (!data.expiry.trim()) {
    errors.expiry = "Expiry date is required";
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry.trim())) {
    errors.expiry = "Enter expiry as MM/YY";
  }
  if (!data.cvv.trim()) {
    errors.cvv = "CVV is required";
  } else if (!/^\d{3,4}$/.test(data.cvv.trim())) {
    errors.cvv = "CVV must be 3 or 4 digits";
  }
  if (!data.nameOnCard.trim()) errors.nameOnCard = "Name on card is required";
  return errors;
}

// ---------------------------------------------------------------------------
// Format card number with spaces
// ---------------------------------------------------------------------------

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { getProduct } = useProducts();

  const [step, setStep] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });

  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const [shippingErrors, setShippingErrors] = useState<FormErrors<ShippingData>>({});
  const [paymentErrors, setPaymentErrors] = useState<FormErrors<PaymentData>>({});

  const enrichedItems = items.map((item) => ({
    ...item,
    product: getProduct(item.productId),
  }));

  function updateShipping(field: keyof ShippingData, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) {
      setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function updatePayment(field: keyof PaymentData, value: string) {
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleNextFromShipping() {
    const errors = validateShipping(shipping);
    if (Object.keys(errors).length > 0) {
      setShippingErrors(errors);
      return;
    }
    setStep(2);
  }

  function handleNextFromPayment() {
    const errors = validatePayment(payment);
    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }
    setStep(3);
  }

  async function handlePlaceOrder() {
    setIsPlacingOrder(true);
    // Simulate 2-second processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setIsPlacingOrder(false);
    setOrderPlaced(true);
    toast.success("Order placed successfully! Thank you for your purchase.");
  }

  // -----------------------------------------------------------------------
  // Success screen
  // -----------------------------------------------------------------------

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you, {shipping.firstName}. Your order has been placed and is
          being processed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Empty cart guard
  // -----------------------------------------------------------------------

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-center mb-2">Checkout</h1>
      <p className="text-center text-muted-foreground mb-8">
        Complete your purchase in just a few steps
      </p>

      <StepIndicator currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Area */}
        <div className="lg:col-span-2">
          {/* ---- STEP 1: SHIPPING ---- */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="firstName" label="First Name" required error={shippingErrors.firstName}>
                    <Input
                      id="firstName"
                      value={shipping.firstName}
                      onChange={(e) => updateShipping("firstName", e.target.value)}
                      placeholder="John"
                      aria-invalid={!!shippingErrors.firstName}
                    />
                  </Field>
                  <Field id="lastName" label="Last Name" required error={shippingErrors.lastName}>
                    <Input
                      id="lastName"
                      value={shipping.lastName}
                      onChange={(e) => updateShipping("lastName", e.target.value)}
                      placeholder="Doe"
                      aria-invalid={!!shippingErrors.lastName}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="email" label="Email" required error={shippingErrors.email}>
                    <Input
                      id="email"
                      type="email"
                      value={shipping.email}
                      onChange={(e) => updateShipping("email", e.target.value)}
                      placeholder="john@example.com"
                      aria-invalid={!!shippingErrors.email}
                    />
                  </Field>
                  <Field id="phone" label="Phone (optional)">
                    <Input
                      id="phone"
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => updateShipping("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </Field>
                </div>

                <Field id="address" label="Street Address" required error={shippingErrors.address}>
                  <Input
                    id="address"
                    value={shipping.address}
                    onChange={(e) => updateShipping("address", e.target.value)}
                    placeholder="123 Main St"
                    aria-invalid={!!shippingErrors.address}
                  />
                </Field>

                <Field id="apartment" label="Apartment / Suite (optional)">
                  <Input
                    id="apartment"
                    value={shipping.apartment}
                    onChange={(e) => updateShipping("apartment", e.target.value)}
                    placeholder="Apt 4B"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field id="city" label="City" required error={shippingErrors.city} >
                    <Input
                      id="city"
                      value={shipping.city}
                      onChange={(e) => updateShipping("city", e.target.value)}
                      placeholder="New York"
                      aria-invalid={!!shippingErrors.city}
                    />
                  </Field>
                  <Field id="state" label="State" required error={shippingErrors.state}>
                    <Input
                      id="state"
                      value={shipping.state}
                      onChange={(e) => updateShipping("state", e.target.value)}
                      placeholder="NY"
                      maxLength={2}
                      aria-invalid={!!shippingErrors.state}
                    />
                  </Field>
                  <Field id="zip" label="ZIP Code" required error={shippingErrors.zip}>
                    <Input
                      id="zip"
                      value={shipping.zip}
                      onChange={(e) => updateShipping("zip", e.target.value)}
                      placeholder="10001"
                      aria-invalid={!!shippingErrors.zip}
                    />
                  </Field>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleNextFromShipping} size="lg">
                    Continue to Payment
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---- STEP 2: PAYMENT ---- */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field
                  id="cardNumber"
                  label="Card Number"
                  required
                  error={paymentErrors.cardNumber}
                >
                  <Input
                    id="cardNumber"
                    value={payment.cardNumber}
                    onChange={(e) =>
                      updatePayment("cardNumber", formatCardNumber(e.target.value))
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    aria-invalid={!!paymentErrors.cardNumber}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    id="expiry"
                    label="Expiry Date"
                    required
                    error={paymentErrors.expiry}
                  >
                    <Input
                      id="expiry"
                      value={payment.expiry}
                      onChange={(e) =>
                        updatePayment("expiry", formatExpiry(e.target.value))
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      aria-invalid={!!paymentErrors.expiry}
                    />
                  </Field>
                  <Field id="cvv" label="CVV" required error={paymentErrors.cvv}>
                    <Input
                      id="cvv"
                      value={payment.cvv}
                      onChange={(e) =>
                        updatePayment(
                          "cvv",
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="123"
                      maxLength={4}
                      aria-invalid={!!paymentErrors.cvv}
                      type="password"
                    />
                  </Field>
                </div>

                <Field
                  id="nameOnCard"
                  label="Name on Card"
                  required
                  error={paymentErrors.nameOnCard}
                >
                  <Input
                    id="nameOnCard"
                    value={payment.nameOnCard}
                    onChange={(e) => updatePayment("nameOnCard", e.target.value)}
                    placeholder="John Doe"
                    aria-invalid={!!paymentErrors.nameOnCard}
                  />
                </Field>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    Your payment information is encrypted and secure. This is a demo — no real charges will be made.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleNextFromPayment} size="lg">
                    Review Order
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---- STEP 3: REVIEW ---- */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Review Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipping Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Shipping To</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {shipping.firstName} {shipping.lastName}
                    </p>
                    <p>{shipping.email}</p>
                    {shipping.phone && <p>{shipping.phone}</p>}
                    <p>
                      {shipping.address}
                      {shipping.apartment ? `, ${shipping.apartment}` : ""}
                    </p>
                    <p>
                      {shipping.city}, {shipping.state} {shipping.zip}
                    </p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Payment</h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.nameOnCard}
                      </p>
                      <p className="text-muted-foreground">
                        Card ending in{" "}
                        {payment.cardNumber.replace(/\s/g, "").slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    Order Items ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {enrichedItems.map(({ productId, quantity, product }) => {
                      if (!product) return null;
                      return (
                        <div
                          key={productId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground flex-1 mr-2 line-clamp-1">
                            {product.title}{" "}
                            <span className="text-xs">x{quantity}</span>
                          </span>
                          <span className="font-medium flex-shrink-0">
                            {formatCurrency(product.price * quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="min-w-40"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 order-first lg:order-last">
          <div className="rounded-xl border bg-card p-5 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {enrichedItems.map(({ productId, quantity, product }) => {
                if (!product) return null;
                return (
                  <div key={productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex-1 mr-2 line-clamp-1">
                      {product.title}{" "}
                      <span className="text-xs font-medium">x{quantity}</span>
                    </span>
                    <span className="flex-shrink-0 font-medium">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
