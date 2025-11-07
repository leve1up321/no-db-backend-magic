"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // قراءة المنتج من query string
  const productId = searchParams.get("product") || "1";
  const productName = searchParams.get("name") || "الربح من المنتجات الرقمية";
  const price = searchParams.get("price") || "39";
  const currency = searchParams.get("currency") || "AED";

  // تحويل رموز العملات إلى أكواد Ziina
  const currencyCodeMap: Record<string, string> = {
    SAR: "SAR",
    AED: "AED",
    KWD: "KWD",
    QAR: "QAR",
    BHD: "BHD",
    OMR: "OMR",
    JOD: "JOD",
    EGP: "EGP",
    LBP: "LBP",
    SYP: "SYP",
    IQD: "IQD",
    TND: "TND",
    MAD: "MAD",
    DZD: "DZD",
    USD: "USD",
    EUR: "EUR",
  };

  const getCurrencySymbol = (curr: string) => {
    const map: Record<string, string> = {
      SAR: "ر.س",
      AED: "د.إ",
      KWD: "د.ك",
      QAR: "ر.ق",
      BHD: "د.ب",
      OMR: "ر.ع",
      JOD: "د.أ",
      EGP: "ج.م",
      LBP: "ل.ل",
      SYP: "ل.س",
      IQD: "ع.د",
      TND: "د.ت",
      MAD: "د.م",
      DZD: "د.ج",
      USD: "$",
      EUR: "€",
    };
    return map[curr] || "";
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("leve1up_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handlePay = async () => {
    if (!email || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    setLoading(true
