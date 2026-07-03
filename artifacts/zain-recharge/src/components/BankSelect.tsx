import { useEffect, useMemo, useRef, useState } from "react";

import { knetBankBins, type KnetBankBin } from "../lib/knet-banks";

function formatBin(bin: string) {
  if (bin.length <= 4) return bin;
  return `${bin.slice(0, 4)} ${bin.slice(4)}`;
}

const bankSelectStyles = `
  .bank-select {
    position: relative;
    width: 340px;
    max-width: 100%;
    direction: ltr;
    z-index: 999999;
    --bank-logo-space: 88px;
    --bank-input-height: 34px;
  }
  .bank-field {
    position: relative;
    width: 100%;
  }
  .bank-input {
    width: 100%;
    height: var(--bank-input-height);
    border: 1px solid #b8c5c9;
    border-radius: 6px;
    background: #fff;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.22);
    font-size: 18px;
    font-weight: 700;
    color: #666;
    padding: 0 var(--bank-logo-space) 0 10px;
    outline: none;
    box-sizing: border-box;
    direction: ltr;
  }
  .bank-list {
    position: absolute;
    top: calc(var(--bank-input-height) + 4px);
    left: 0;
    width: 100%;
    max-height: 260px;
    overflow-y: auto;
    background: linear-gradient(#e6e6e6, #ffffff);
    border: 1px solid #bfc8cc;
    border-radius: 7px;
    box-shadow: 0 5px 12px rgba(0,0,0,0.32);
    z-index: 999999;
  }
  .bank-item {
    width: 100%;
    height: 55px;
    border: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 0 18px;
    cursor: pointer;
    font-size: 28px;
    color: #707070;
    text-align: left;
  }
  .bank-item:hover { background: rgba(0,0,0,0.08); }
  .bank-item span { white-space: nowrap; }
  .bank-item img { width: 74px; height: 24px; object-fit: contain; flex-shrink: 0; }
  .bank-logo {
    position: absolute;
    right: 8px;
    top: 50%;
    width: 74px;
    height: 24px;
    transform: translateY(-50%);
    object-fit: contain;
    pointer-events: none;
  }
  .bank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: #e8edf0;
    color: #5d676b;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 0 6px;
    box-sizing: border-box;
  }
`;

export default function BankSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const cleanValue = value.replace(/\D/g, "");
  const formattedValue = useMemo(() => formatBin(cleanValue), [cleanValue]);
  const displayValue = open ? cleanValue : formattedValue;
  const selectedBank = useMemo(
    () => knetBankBins.find((bank) => bank.bin === cleanValue),
    [cleanValue],
  );

  const results = useMemo(() => {
    if (cleanValue.length === 0) return [];
    return knetBankBins.filter((bank) => bank.bin.startsWith(cleanValue));
  }, [cleanValue]);

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 8);
    onChange(onlyNumbers);
    setOpen(onlyNumbers.length > 0);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const onlyNumbers = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    onChange(onlyNumbers);
    setOpen(onlyNumbers.length > 0);
  }

  function chooseBank(bank: KnetBankBin) {
    onChange(bank.bin);
    setOpen(false);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: bankSelectStyles }} />
      <div className="bank-select" ref={wrapperRef}>
        <div className="bank-field">
          <input
            value={displayValue}
            onChange={handleChange}
            onPaste={handlePaste}
            onFocus={() => { setOpen(cleanValue.length > 0); }}
            inputMode="numeric"
            autoComplete="off"
            aria-label="Enter your bank identification number (BIN)"
            maxLength={open ? 8 : 9}
            aria-autocomplete="list"
            aria-expanded={open && results.length > 0 ? "true" : "false"}
            aria-controls="bank-listbox"
            role="combobox"
            className="bank-input"
          />
          {selectedBank && (
            selectedBank.logo ? (
              <img className="bank-logo" src={selectedBank.logo} alt={selectedBank.displayName} />
            ) : (
              <span className="bank-logo bank-badge" aria-hidden="true">
                {selectedBank.initials}
              </span>
            )
          )}
        </div>

        {open && results.length > 0 && (
          <div className="bank-list" id="bank-listbox" role="listbox">
            {results.map((bank) => (
              <button
                key={`${bank.bin}-${bank.displayName}`}
                type="button"
                className="bank-item"
                role="option"
                onMouseDown={(e) => { e.preventDefault(); }}
                onClick={() => chooseBank(bank)}
              >
                <span>{bank.bin} - {bank.displayName}</span>
                {bank.logo ? (
                  <img src={bank.logo} alt={bank.displayName} />
                ) : (
                  <span className="bank-badge">{bank.initials}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
