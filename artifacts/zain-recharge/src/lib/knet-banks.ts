export type KnetBankBin = {
  bin: string
  bankCode: string
  bankNameAr: string
  displayName: string
  logo?: string
  initials: string
}

type KnetBankProfile = Omit<KnetBankBin, "bin"> & {
  bins: string[]
}

const knetBankProfiles: KnetBankProfile[] = [
  {
    bankCode: "ABK",
    bankNameAr: "البنك الأهلي الكويتي",
    displayName: "ABK",
    logo: "/banks/abk-knet.png",
    initials: "ABK",
    bins: ["403622", "423826", "428628", "435401"],
  },
  {
    bankCode: "BBK",
    bankNameAr: "بنك البحرين والكويت",
    displayName: "BBK",
    logo: "/banks/bbk.svg",
    initials: "BBK",
    bins: ["418056", "418231", "419405", "588790"],
  },
  {
    bankCode: "KIB",
    bankNameAr: "بنك الكويت الدولي",
    displayName: "KIB",
    logo: "/banks/kib.svg",
    initials: "KIB",
    bins: ["406464", "409054", "891205", "898611", "898944"],
  },
  {
    bankCode: "NBK",
    bankNameAr: "بنك الكويت الوطني",
    displayName: "NBK",
    logo: "/banks/nbk.svg",
    initials: "NBK",
    bins: ["464452", "512118", "512264", "519044", "589160"],
  },
  {
    bankCode: "Rajhi",
    bankNameAr: "مصرف الراجحي",
    displayName: "Rajhi",
    logo: "/banks/rajhi.svg",
    initials: "RJ",
    bins: ["458838"],
  },
  {
    bankCode: "TAM",
    bankNameAr: "تمام",
    displayName: "TAM",
    logo: "/banks/tam.svg",
    initials: "TAM",
    bins: ["45077848", "45077849"],
  },
  {
    bankCode: "Weyay",
    bankNameAr: "ويّاي",
    displayName: "Weyay",
    logo: "/banks/weyay.svg",
    initials: "WY",
    bins: ["46445250", "543363"],
  },
  {
    bankCode: "Boubyan",
    bankNameAr: "بنك بوبيان",
    displayName: "Boubyan",
    logo: "/banks/boubyan.svg",
    initials: "BO",
    bins: ["404919", "426058", "431199", "450605", "470350", "490455", "490456", "651099", "651402", "657744"],
  },
  {
    bankCode: "Burgan",
    bankNameAr: "بنك برقان",
    displayName: "Burgan",
    logo: "/banks/burgan.svg",
    initials: "BG",
    bins: ["402978", "403583", "415254", "450238", "468564", "49219000", "540759", "685218", "689301", "689744"],
  },
  {
    bankCode: "Doha",
    bankNameAr: "بنك الدوحة",
    displayName: "Doha",
    logo: "/banks/doha.svg",
    initials: "DH",
    bins: ["419252"],
  },
  {
    bankCode: "KFH",
    bankNameAr: "بيت التمويل الكويتي",
    displayName: "KFH",
    logo: "/banks/kfh.svg",
    initials: "KFH",
    bins: ["450778", "485602", "523144", "523826", "523901", "5326674", "537016"],
  },
  {
    bankCode: "GBK",
    bankNameAr: "بنك الخليج",
    displayName: "GBK",
    logo: "/banks/gbk.svg",
    initials: "GBK",
    bins: ["517419", "517458", "526206", "531329", "531470", "531471", "531644", "559475", "672155", "672811", "672945"],
  },
  {
    bankCode: "QNB",
    bankNameAr: "بنك قطر الوطني",
    displayName: "QNB",
    initials: "QNB",
    bins: ["521020", "524745"],
  },
  {
    bankCode: "Warba",
    bankNameAr: "بنك وربة",
    displayName: "Warba",
    logo: "/banks/warba.svg",
    initials: "WB",
    bins: ["525528", "532749", "541350", "559459", "794251", "794820", "796044"],
  },
  {
    bankCode: "CBK",
    bankNameAr: "البنك التجاري الكويتي",
    displayName: "CBK",
    logo: "/banks/cbk.png",
    initials: "CBK",
    bins: ["631507", "631884", "636210"],
  },
  {
    bankCode: "UNB",
    bankNameAr: "البنك المتحد",
    displayName: "UNB",
    initials: "UNB",
    bins: ["457778"],
  },
]

export const knetBankBins: KnetBankBin[] = knetBankProfiles.flatMap((profile) =>
  profile.bins.map((bin) => ({
    bin,
    bankCode: profile.bankCode,
    bankNameAr: profile.bankNameAr,
    displayName: profile.displayName,
    logo: profile.logo,
    initials: profile.initials,
  })),
)

export function findMatchingKnetBankBins(digits: string) {
  if (!digits) return []
  return knetBankBins.filter((bank) => bank.bin.startsWith(digits))
}

export function findBestKnetBankMatch(digits: string) {
  const exactMatches = knetBankBins
    .filter((bank) => digits.length >= bank.bin.length && digits.startsWith(bank.bin))
    .sort((left, right) => right.bin.length - left.bin.length)

  if (exactMatches.length) return exactMatches[0]
  if (digits.length < 6) return null
  return findMatchingKnetBankBins(digits)[0] ?? null
}

export function hasResolvedKnetBankPrefix(digits: string) {
  const exactMatches = knetBankBins.filter(
    (bank) => digits.length >= bank.bin.length && digits.startsWith(bank.bin),
  )

  if (exactMatches.length === 0) return false

  const longestMatchLength = Math.max(...exactMatches.map((bank) => bank.bin.length))
  return exactMatches.filter((bank) => bank.bin.length === longestMatchLength).length === 1
}
