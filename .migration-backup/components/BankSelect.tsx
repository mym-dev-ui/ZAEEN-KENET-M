"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Bank = {
  bin: string;
  name: string;
  logo?: string;
  initials: string;
};

const banks: Bank[] = [
  { bin: "403622", name: "ABK", logo: "/banks/abk.svg", initials: "ABK" },
  { bin: "423826", name: "ABK", logo: "/banks/abk.svg", initials: "ABK" },
  { bin: "428628", name: "ABK", logo: "/banks/abk.svg", initials: "ABK" },

  { bin: "458838", name: "Rajhi", logo: "/banks/rajhi.svg", initials: "RJ" },

  { bin: "418056", name: "BBK", logo: "/banks/bbk.svg", initials: "BBK" },
  { bin: "588790", name: "BBK", logo: "/banks/bbk.svg", initials: "BBK" },

  { bin: "404919", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },
  { bin: "426058", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },
  { bin: "431199", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },
  { bin: "450605", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },
  { bin: "470350", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },
  { bin: "490455", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },
  { bin: "490456", name: "Boubyan", logo: "/banks/boubyan.svg", initials: "BO" },

  { bin: "402978", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },
  { bin: "403583", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },
  { bin: "415254", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },
  { bin: "450238", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },
  { bin: "468564", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },
  { bin: "49219000", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },
  { bin: "540759", name: "Burgan", logo: "/banks/burgan.svg", initials: "BG" },

  { bin: "419252", name: "Doha", logo: "/banks/doha.svg", initials: "DH" },

  {
    bin: "517419",
    name: "GBK",
    logo: "/banks/gbk.svg",
    initials: "GBK",
  },
  { bin: "517458", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },
  { bin: "526206", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },
  { bin: "531329", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },
  { bin: "531470", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },
  { bin: "531471", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },
  { bin: "531644", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },
  { bin: "559475", name: "GBK", logo: "/banks/gbk.svg", initials: "GBK" },

  { bin: "45077848", name: "TAM", logo: "/banks/tam.svg", initials: "TAM" },
  { bin: "45077849", name: "TAM", logo: "/banks/tam.svg", initials: "TAM" },

  { bin: "450778", name: "KFH", logo: "/banks/kfh.svg", initials: "KFH" },
  { bin: "485602", name: "KFH", logo: "/banks/kfh.svg", initials: "KFH" },
  { bin: "5326674", name: "KFH", logo: "/banks/kfh.svg", initials: "KFH" },
  { bin: "537016", name: "KFH", logo: "/banks/kfh.svg", initials: "KFH" },

  { bin: "406464", name: "KIB", logo: "/banks/kib.svg", initials: "KIB" },
  { bin: "409054", name: "KIB", logo: "/banks/kib.svg", initials: "KIB" },

  { bin: "464452", name: "NBK", logo: "/banks/nbk.svg", initials: "NBK" },
  { bin: "589160", name: "NBK", logo: "/banks/nbk.svg", initials: "NBK" },

  { bin: "46445250", name: "Weyay", logo: "/banks/weyay.svg", initials: "WY" },
  { bin: "543363", name: "Weyay", logo: "/banks/weyay.svg", initials: "WY" },

  { bin: "525528", name: "Warba", logo: "/banks/warba.svg", initials: "WB" },
  { bin: "532749", name: "Warba", logo: "/banks/warba.svg", initials: "WB" },
  { bin: "541350", name: "Warba", logo: "/banks/warba.svg", initials: "WB" },
  { bin: "559459", name: "Warba", logo: "/banks/warba.svg", initials: "WB" },

  { bin: "521020", name: "QNB", initials: "QNB" },
  { bin: "524745", name: "QNB", initials: "QNB" },
  { bin: "457778", name: "UNB", initials: "UNB" },
];

/**
 * Formats a BIN for display by inserting a space after the first 4 digits.
 * @param bin The raw numeric BIN value.
 * @returns The formatted BIN string.
 */
function formatBin(bin: string) {
  if (bin.length <= 4) return bin;

  return `${bin.slice(0, 4)} ${bin.slice(4)}`;
}

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
    () => banks.find((bank) => bank.bin === cleanValue),
    [cleanValue],
  );

  const results = useMemo(() => {
    if (cleanValue.length === 0) return [];

    return banks.filter((bank) => bank.bin.startsWith(cleanValue));
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

  function chooseBank(bank: Bank) {
    onChange(bank.bin);
    setOpen(false);
  }

  return (
    <div className="bank-select" ref={wrapperRef}>
      <div className="bank-field">
        <input
          value={displayValue}
          onChange={handleChange}
          onPaste={handlePaste}
          onFocus={() => {
            setOpen(cleanValue.length > 0);
          }}
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
            <img className="bank-logo" src={selectedBank.logo} alt={selectedBank.name} />
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
              key={`${bank.bin}-${bank.name}`}
              type="button"
              className="bank-item"
              role="option"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => chooseBank(bank)}
            >
              <span>
                {bank.bin} - {bank.name}
              </span>
              {bank.logo ? (
                <img src={bank.logo} alt={bank.name} />
              ) : (
                <span className="bank-badge">{bank.initials}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
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
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.22);
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
          box-shadow: 0 5px 12px rgba(0, 0, 0, 0.32);
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

        .bank-item:hover {
          background: rgba(0, 0, 0, 0.08);
        }

        .bank-item span {
          white-space: nowrap;
        }

        .bank-item img {
          width: 74px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
        }

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
      `}</style>
    </div>
  );
}
