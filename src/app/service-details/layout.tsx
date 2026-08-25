"use client";

import React, { createContext, useEffect, useState } from "react";

type PaymentContextValue = {
    serviceTitle: string;
    setServiceTitle: React.Dispatch<React.SetStateAction<string>>;
    serviceDetail: ServiceDetail[];
    setServiceDetail: React.Dispatch<React.SetStateAction<ServiceDetail[]>>;
    serviceFormData: ServiceFormData;
    setServiceFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>;
    paymentFormData: PaymentFormData;
    setPaymentFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
    promotionCode: string;
    setPromotionCode: React.Dispatch<React.SetStateAction<string>>;
    isFirstPageCompleted: boolean;
    setIsFirstPageCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    isSecondPageCompleted: boolean;
    setIsSecondPageCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    isThirdPageCompleted: boolean;
    setIsThirdPageCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    totAmount: number;
    setTotAmount: React.Dispatch<React.SetStateAction<number>>;
};

type ServiceDetail = {
  serviceDetail: string;
  pricePerUnit: number;
  quantity: number;
    unit: string;
};

const serviceOptions: ServiceDetail[] = [
        { serviceDetail: "9,000 - 18,000 BTU, แบบติดผนัง", quantity: 0, pricePerUnit: 800, unit: "เครื่อง" },
        { serviceDetail: "9,000 - 18,000 BTU, แบบติดผนัง", quantity: 0, pricePerUnit: 800, unit: "เครื่อง" },
        { serviceDetail: "9,000 - 18,000 BTU, แบบติดผนัง", quantity: 0, pricePerUnit: 800, unit: "เครื่อง" },
        { serviceDetail: "9,000 - 18,000 BTU, แบบติดผนัง", quantity: 0, pricePerUnit: 800, unit: "เครื่อง" },
];

const paymentStorageKey = "home-service-payment";

type SavedPayment = {
    serviceDetail?: ServiceDetail[];
    serviceFormData?: ServiceFormData;
    paymentFormData?: PaymentFormData;
    totAmount?: number;
};

function getSavedPayment(): SavedPayment | null {
    if (typeof window === "undefined") {
        return null;
    }

    const savedPayment = window.sessionStorage.getItem(paymentStorageKey);

    if (!savedPayment) {
        return null;
    }

    try {
        return JSON.parse(savedPayment) as SavedPayment;
    } catch {
        window.sessionStorage.removeItem(paymentStorageKey);
        return null;
    }
}

function hasRequiredServiceFormData(formData: ServiceFormData): boolean {
    return Object.entries(formData)
        .filter(([field]) => field !== "information")
        .every(([, value]) => value.trim().length > 0);
}


interface ServiceFormData {
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  serviceDate: string;
  serviceTime: string;
  information: string;
}


interface PaymentFormData {
  creditCardNumber: string;
  creditCardName: string;
  creditCardExpiry: string;
  creditCardCVC: string;
    promotionCode: string;
}


export const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [serviceTitle, setServiceTitle] = useState("");
    // ข้อมูล sevice datail มันจะต้องเป็น array ของ object ที่มี serviceDetail, pricePerUnit, quantity
    const [serviceDetail, setServiceDetail] = useState<ServiceDetail[]>(serviceOptions);

    const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
        address: "",
        subdistrict: "",
        district: "",
        province: "",
        serviceDate: "",
        serviceTime: "",
        information: "",
    });

    const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
        creditCardNumber: "",
        creditCardName: "",
        creditCardExpiry: "",
        creditCardCVC: "",
        promotionCode: "",
    });

    const [promotionCode, setPromotionCode] = useState("");

    const [isFirstPageCompleted, setIsFirstPageCompleted] = useState(false);
    const [isSecondPageCompleted, setIsSecondPageCompleted] = useState(false);
    const [isThirdPageCompleted, setIsThirdPageCompleted] = useState(false);

    const [totAmount, setTotAmount] = useState(0);

    useEffect(() => {
        const savedPayment = getSavedPayment();

        if (savedPayment?.serviceDetail) {
            setServiceDetail(savedPayment.serviceDetail);
        }

        if (savedPayment?.serviceFormData) {
            setServiceFormData(savedPayment.serviceFormData);
            setIsSecondPageCompleted(hasRequiredServiceFormData(savedPayment.serviceFormData));
        }

        if (savedPayment?.paymentFormData) {
            setPaymentFormData(savedPayment.paymentFormData);
        }

        if (savedPayment?.totAmount !== undefined) {
            setTotAmount(savedPayment.totAmount);
        }

        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated || typeof window === "undefined") {
            return;
        }

        window.sessionStorage.setItem(
            paymentStorageKey,
            JSON.stringify({ serviceDetail, serviceFormData, paymentFormData, totAmount }),
        );
    }, [isHydrated, serviceDetail, serviceFormData, paymentFormData, totAmount]);

    const value: PaymentContextValue = {
        serviceTitle,
        setServiceTitle,
        serviceDetail,
        setServiceDetail,
        serviceFormData,
        setServiceFormData,
        paymentFormData,
        setPaymentFormData,
        promotionCode,
        setPromotionCode,
        
        isFirstPageCompleted,
        setIsFirstPageCompleted,
        isSecondPageCompleted,
        setIsSecondPageCompleted,
        isThirdPageCompleted,
        setIsThirdPageCompleted,

        totAmount,
        setTotAmount
    };


    return(
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
}

export default PaymentProvider;

