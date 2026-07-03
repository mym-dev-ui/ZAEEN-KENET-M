import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, CreditCard } from "lucide-react"

interface PaymentMethodProps {
  setStepNumber: (n: number) => void
}

type PaymentOption = "knet"

function KnetBadge() {
  return (
    <div className="flex h-[26px] w-[46px] overflow-hidden rounded-[2px] border border-[#d6d5da] bg-white">
      <div className="flex w-[34%] items-center justify-center bg-[#0054a4] text-[7px] font-black tracking-[0.18em] text-white">
        K
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#f4d105] text-[7px] font-black tracking-wide text-[#0054a4]">
        NET
      </div>
    </div>
  )
}

function ApplePayBadge() {
  return (
    <div className="flex h-[28px] min-w-[42px] items-center justify-center rounded-[2px] border border-[#eceaf0] bg-white px-2 text-[11px] font-semibold text-black shadow-[0_0_0_1px_rgba(244,243,247,0.75)]">
       Pay
    </div>
  )
}

function RadioIndicator({ selected, disabled = false }: { selected: boolean; disabled?: boolean }) {
  return (
    <span
      className={[
        "flex h-7 w-7 items-center justify-center rounded-full border",
        selected ? "border-[#7b2ea1]" : disabled ? "border-[#e5e4ea]" : "border-[#d8d7de]",
      ].join(" ")}
      aria-hidden="true"
    >
      <span
        className={[
          "h-[15px] w-[15px] rounded-full",
          selected ? "bg-[#7b2ea1]" : "bg-transparent",
        ].join(" ")}
      />
    </span>
  )
}

function PaymentRow({
  label,
  icon,
  selected = false,
  disabled = false,
  onClick,
}: {
  label: string
  icon: ReactNode
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  const rowClasses = [
    "flex h-[98px] w-full items-center px-6 text-[#17161b]",
    disabled ? "cursor-not-allowed bg-white/80" : "bg-white",
  ].join(" ")

  const content = (
    <>
      <div className="flex items-center">
        <RadioIndicator selected={selected} disabled={disabled} />
      </div>
      <div className="ml-auto flex flex-row-reverse items-center gap-3">
        {icon}
        <div className="flex flex-col items-end">
          <span className={disabled ? "text-[1.02rem] font-medium text-[#202025]" : "text-[1.02rem] font-medium text-[#17161b]"}>
            {label}
          </span>
          {disabled && <span className="mt-1 text-[0.68rem] font-medium text-[#a1a0a7]">قريبًا</span>}
        </div>
      </div>
    </>
  )

  if (disabled) {
    return <div className={rowClasses}>{content}</div>
  }

  return (
    <button type="button" onClick={onClick} className={rowClasses}>
      {content}
    </button>
  )
}

export default function PaymentMethod({ setStepNumber }: PaymentMethodProps) {
  const [amount] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("amount") || "6.000" : "6.000",
  )
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption>("knet")

  return (
    <div className="min-h-screen bg-[#f4f3f8]" dir="rtl">
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#f4f3f8] md:shadow-[0_0_0_1px_rgba(232,230,238,0.85)]">
        <header className="relative flex h-[68px] items-center justify-center border-b border-[#ecebf0] bg-[#fbfafc]">
          <button
            type="button"
            aria-label="رجوع"
            onClick={() => setStepNumber(1)}
            className="absolute right-5 top-1/2 flex h-[56px] w-[56px] -translate-y-1/2 items-center justify-center border border-[#e9e7ed] bg-white text-[#26242b]"
          >
            <ChevronRight className="h-7 w-7 stroke-[1.8]" />
          </button>
          <h1 className="text-[1.06rem] font-semibold text-[#14131a]">الدفع</h1>
        </header>

        <main className="px-5 pb-[190px] pt-11">
          <section className="mb-[46px] pr-[2px]">
            <div className="text-right text-[3.35rem] font-normal leading-none tracking-[-0.04em] text-[#111017]">
              {amount} د.ك
            </div>
          </section>

          <button type="button" className="mb-[52px] flex w-full items-center" dir="ltr">
            <ChevronDown className="h-6 w-6 text-[#2b2930] stroke-[1.8]" />
            <span className="ml-auto text-[1.02rem] font-medium text-[#1e1c24]" dir="rtl">
              عرض التفاصيل
            </span>
          </button>

          <section className="mb-[40px]">
            <h2 className="mb-4 text-right text-[1.02rem] font-medium text-[#1a1820]">طريقة الدفع المفضلة</h2>
            <button
              type="button"
              className="flex h-[68px] w-full items-center border border-[#f0eef3] bg-white px-6 text-[#1a1820]"
              dir="ltr"
            >
              <ChevronLeft className="h-6 w-6 text-[#201e25] stroke-[1.8]" />
              <div className="ml-auto flex flex-row-reverse items-center gap-3">
                <div className="flex h-[28px] w-[38px] items-center justify-center rounded-[2px] border border-[#eaddea] bg-white text-[#9d7fa3]">
                  <CreditCard className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </div>
                <span className="text-[1.02rem] font-medium">بطاقة/ائتمان</span>
              </div>
            </button>
          </section>

          <section>
            <h2 className="mb-4 text-right text-[1.02rem] font-medium text-[#1a1820]">طرق دفع أخرى</h2>
            <div className="overflow-hidden border border-[#f0eef3] bg-white">
              <PaymentRow
                label="KNET"
                icon={<KnetBadge />}
                selected={selectedMethod === "knet"}
                onClick={() => setSelectedMethod("knet")}
              />
              <div className="h-px bg-[#e8e7ec]" />
              <PaymentRow label="Apple Pay" icon={<ApplePayBadge />} disabled />
            </div>
          </section>
        </main>
      </div>

      <footer className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 border-t border-[#ecebf0] bg-[#fbfafc] px-5 pb-[calc(env(safe-area-inset-bottom)+22px)] pt-4 md:shadow-[0_-1px_0_rgba(232,230,238,0.85)]">
        <p className="mb-5 text-center text-[0.96rem] leading-7 text-[#26242b]">
          بإتمام الدفع، فإنك توافق على{" "}
          <span className="font-medium text-[#d45673]">الشروط والأحكام</span>
        </p>
        <button
          type="button"
          onClick={() => {
            if (selectedMethod === "knet") setStepNumber(3)
          }}
          className="flex h-[88px] w-full items-center justify-center bg-[#ff3f6e] text-[1.2rem] font-bold text-white"
        >
          تأكيد الدفع
        </button>
      </footer>
    </div>
  )
}
