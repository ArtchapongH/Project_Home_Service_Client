"use client";

import React, { createContext, useState } from "react";

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
}


export const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    
    
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
    });

    const [promotionCode, setPromotionCode] = useState("");

    const [isFirstPageCompleted, setIsFirstPageCompleted] = useState(false);
    const [isSecondPageCompleted, setIsSecondPageCompleted] = useState(false);    
    const [isThirdPageCompleted, setIsThirdPageCompleted] = useState(false);

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
        setIsThirdPageCompleted
    };


    return(
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
}

export default PaymentProvider;

