"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PaymentForm() {
  const [amount, setAmount] = useState("6.000");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAmount(localStorage.getItem("amount") || "6.000");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="bg-[#1a1240] px-5 py-4 text-white">
            <p className="text-sm opacity-80">المرحلة الثانية</p>
            <h1 className="text-lg font-bold">إكمال الدفع</h1>
          </div>

          <div className="space-y-4 p-5">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-600">إجمالي المبلغ</div>
              <div className="mt-1 text-3xl font-bold text-[#d62598]">د.ك {amount}</div>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              هذه نسخة أولية لواجهة الدفع. يمكن استبدالها لاحقًا بخطوات الدفع الفعلية.
            </p>

            {done && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                تم إرسال بيانات الدفع بنجاح.
              </div>
            )}

            <Button
              onClick={() => setDone(true)}
              className="w-full bg-gradient-to-r from-[#d62598] to-[#e94aa1] text-white hover:from-[#c01e85] hover:to-[#d62598]"
            >
              متابعة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
