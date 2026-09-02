"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useEffect, useState } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

const stripePromise = loadStripe(
  "pk_test_51U8I9tEcKQ4tElnOs6okgrxrdwBjLm1FIbeOt6xks4BzJ58YUH1OIOUlAsgJyUqUtNEzOHAYQSayXLV41hKrEoYO00YdOhLRrj"
);

type PaymentContextValue = {
    userId: string | number | null;
    setUserId: React.Dispatch<React.SetStateAction<string | number | null>>;
    serviceId: number;
    setServiceId: React.Dispatch<React.SetStateAction<number>>;
    serviceTitle: string;
    setServiceTitle: React.Dispatch<React.SetStateAction<string>>;
    serviceDetail: ServiceDetail[];
    setServiceDetail: React.Dispatch<React.SetStateAction<ServiceDetail[]>>;
    serviceFormData: ServiceFormData;
    setServiceFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>;
    paymentFormData: PaymentFormData;
    setPaymentFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
    
    isFirstPageCompleted: boolean;
    setIsFirstPageCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    isSecondPageCompleted: boolean;
    setIsSecondPageCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    isThirdPageCompleted: boolean;
    setIsThirdPageCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    totAmount: number;
    setTotAmount: React.Dispatch<React.SetStateAction<number>>;
    paymentMethod: PaymentMethod;
    setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
    discount: number; 
    setDiscount: React.Dispatch<React.SetStateAction<number>>;
    discountType: string;
    setDiscountType: React.Dispatch<React.SetStateAction<string>>;
    newQuota: number;
    setNewQuota: React.Dispatch<React.SetStateAction<number>>;


    provincesList: string;
    setProvincesList: React.Dispatch<React.SetStateAction<string>>;
    districtList: string;
    setDistrictList: React.Dispatch<React.SetStateAction<string>>;
    subdistrictList: string;
    setSubdistrictList: React.Dispatch<React.SetStateAction<string>>;

    resetPayment: () => void;
};

export type PaymentMethod = "promptpay" | "card";

type ServiceDetail = {
  service_id: string;
  service_name: string;
  option_id: string;
  option_name: string;
  price: number;
  quantity: number;
  unit: string;
};

const serviceOptions: ServiceDetail[] = [];

const paymentStorageKey = "home-service-payment";

const initialServiceFormData: ServiceFormData = {
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    serviceDate: "",
    serviceTime: "",
    information: "",
    latitude: null,
    longitude: null,
};

const initialPaymentFormData: PaymentFormData = {
    creditCardNumberComplete: false,
    creditCardName: "",
    creditCardExpiryComplete: false,
    creditCardCVCComplete: false,
    promotionCode: "",
};

type SavedPayment = {
    serviceId?: number;
    serviceTitle?: string;
    serviceDetail?: ServiceDetail[];
    serviceFormData?: ServiceFormData;
    paymentFormData?: PaymentFormData;
    totAmount?: number;
};

export function getServiceBreadcrumbName(
    serviceTitle: string,
    services: Array<{ service_name: string; quantity: number }>,
): string {
    if (serviceTitle.trim()) return serviceTitle.trim();
    const selected = services.find((service) => service.quantity > 0);
    return selected?.service_name || services[0]?.service_name || "บริการ";
}


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

function isFilledText(value: unknown): boolean {
    return typeof value === "string" && value.trim().length > 0;
}

function toCoordinate(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
        return Number(value);
    }
    return null;
}

export interface ServiceFormData {
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  serviceDate: string;
  serviceTime: string;
  information: string;
  latitude: number | null;
  longitude: number | null;
}

export function hasRequiredServiceFormData(formData: ServiceFormData): boolean {
    return (
        isFilledText(formData.address) &&
        isFilledText(formData.subdistrict) &&
        isFilledText(formData.district) &&
        isFilledText(formData.province) &&
        isFilledText(formData.serviceDate) &&
        isFilledText(formData.serviceTime) &&
        formData.latitude != null &&
        formData.longitude != null
    );
}

function restoreServiceFormData(saved: Partial<ServiceFormData> | undefined): ServiceFormData {
    return {
        address: typeof saved?.address === "string" ? saved.address : "",
        subdistrict: typeof saved?.subdistrict === "string" ? saved.subdistrict : "",
        district: typeof saved?.district === "string" ? saved.district : "",
        province: typeof saved?.province === "string" ? saved.province : "",
        serviceDate: typeof saved?.serviceDate === "string" ? saved.serviceDate : "",
        serviceTime: typeof saved?.serviceTime === "string" ? saved.serviceTime.trim().slice(0, 5) : "",
        information: typeof saved?.information === "string" ? saved.information : "",
        latitude: toCoordinate(saved?.latitude),
        longitude: toCoordinate(saved?.longitude),
    };
}


interface PaymentFormData {
  creditCardNumberComplete: boolean;
  creditCardName: string;
  creditCardExpiryComplete: boolean;
  creditCardCVCComplete: boolean;
    promotionCode: string;
}


export const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [userId, setUserId] = useState<string | number | null>("");
    const [serviceId, setServiceId] = useState(0);
    const [serviceTitle, setServiceTitle] = useState("");
    // ข้อมูล sevice datail มันจะต้องเป็น array ของ object ที่มี serviceDetail, pricePerUnit, quantity
    const [serviceDetail, setServiceDetail] = useState<ServiceDetail[]>(serviceOptions);

    const [serviceFormData, setServiceFormData] = useState<ServiceFormData>(initialServiceFormData);

    const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>(initialPaymentFormData);

    const [promotionCode, setPromotionCode] = useState("");

    const [isFirstPageCompleted, setIsFirstPageCompleted] = useState(false);
    const [isSecondPageCompleted, setIsSecondPageCompleted] = useState(false);
    const [isThirdPageCompleted, setIsThirdPageCompleted] = useState(false);

    const [totAmount, setTotAmount] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState("");
    const [newQuota, setNewQuota] = useState(0);

    const [provincesList, setProvincesList] = useState("");
    const [districtList, setDistrictList] = useState("");
    const [subdistrictList, setSubdistrictList] = useState("");
    
    

    useEffect(() => {
        const savedPayment = getSavedPayment();

        if (savedPayment?.serviceTitle) {
            setServiceTitle(savedPayment.serviceTitle);
        }

        if (savedPayment?.serviceDetail) {
            setServiceDetail(savedPayment.serviceDetail);
        }

        if (savedPayment?.serviceId && Number.isSafeInteger(savedPayment.serviceId)) {
            setServiceId(savedPayment.serviceId);
        }

        if (savedPayment?.serviceFormData) {
            const restoredForm = restoreServiceFormData(savedPayment.serviceFormData);
            setServiceFormData(restoredForm);
            setIsSecondPageCompleted(hasRequiredServiceFormData(restoredForm));
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
            JSON.stringify({ serviceId, serviceTitle, serviceDetail, serviceFormData, paymentFormData, totAmount }),
        );
    }, [isHydrated, serviceId, serviceTitle, serviceDetail, serviceFormData, paymentFormData, totAmount]);

    // clears everything filled across [id], userinfo and payment pages back to defaults
    const resetPayment = () => {
        setUserId("");
        setServiceId(0);
        setServiceTitle("");
        setServiceDetail(serviceOptions);
        setServiceFormData(initialServiceFormData);
        setPaymentFormData(initialPaymentFormData);
        setPromotionCode("");
        setIsFirstPageCompleted(false);
        setIsSecondPageCompleted(false);
        setIsThirdPageCompleted(false);
        setTotAmount(0);
        setPaymentMethod("card");
        setDiscount(0);
        setDiscountType("");
        setNewQuota(0);
        setProvincesList("");
        setDistrictList("");
        setSubdistrictList("");

        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(paymentStorageKey);
        }
    };

    const value: PaymentContextValue = {
        userId,
        setUserId,
        serviceId,
        setServiceId,
        serviceTitle,
        setServiceTitle,
        serviceDetail,
        setServiceDetail,
        serviceFormData,
        setServiceFormData,
        paymentFormData,
        setPaymentFormData,
        
        discount, 
        setDiscount, 
        discountType,
        setDiscountType,
        newQuota,
        setNewQuota,

        isFirstPageCompleted,
        setIsFirstPageCompleted,
        isSecondPageCompleted,
        setIsSecondPageCompleted,
        isThirdPageCompleted,
        setIsThirdPageCompleted,

        totAmount,
        setTotAmount,

        paymentMethod,
        setPaymentMethod,

        provincesList,
        setProvincesList,
        districtList,
        setDistrictList,
        subdistrictList,
        setSubdistrictList,

        resetPayment,
    };


    return(
        <Elements stripe={stripePromise}>
            <PaymentContext.Provider value={value}>
                {children}
            </PaymentContext.Provider>
        </Elements>
    );
}

export default function ServiceDetailsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <PaymentProvider>{children}</PaymentProvider>
        </ProtectedRoute>
    );
}

