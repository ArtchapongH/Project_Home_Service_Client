"use client";

import React, { createContext, useState, type ReactNode } from "react";

type PaymentContextValue = {
    serviceTitle: string;
    setServiceTitle: React.Dispatch<React.SetStateAction<string>>;
    serviceDetail: string;
    setServiceDetail: React.Dispatch<React.SetStateAction<string>>;
    pricePerUnit: number;
    setPricePerUnit: React.Dispatch<React.SetStateAction<number>>;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    subdistrict: string;
    setSubdistrict: React.Dispatch<React.SetStateAction<string>>;
    district: string;
    setDistrict: React.Dispatch<React.SetStateAction<string>>;
    province: string;
    setProvince: React.Dispatch<React.SetStateAction<string>>;
    serviceDate: string;
    setServiceDate: React.Dispatch<React.SetStateAction<string>>;
    serviceTime: string;
    setServiceTime: React.Dispatch<React.SetStateAction<string>>;
    information: string;
    setInformation: React.Dispatch<React.SetStateAction<string>>;
    creditCardNumber: string;
    setCreditCardNumber: React.Dispatch<React.SetStateAction<string>>;
    creditCardName: string;
    setCreditCardName: React.Dispatch<React.SetStateAction<string>>;
    creditCardExpiry: string;
    setCreditCardExpiry: React.Dispatch<React.SetStateAction<string>>;
    creditCardCVC: string;
    setCreditCardCVC: React.Dispatch<React.SetStateAction<string>>;
    promotionCode: string;
    setPromotionCode: React.Dispatch<React.SetStateAction<string>>;
};

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
    const [serviceDetail, setServiceDetail] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [quantity, setQuantity] = useState(0);

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

    const value: PaymentContextValue = {
        serviceTitle,
        setServiceTitle,
        serviceDetail,
        setServiceDetail,
        pricePerUnit,
        setPricePerUnit,
        quantity,
        setQuantity,
        address,
        setAddress,
        subdistrict,
        setSubdistrict,
        district,
        setDistrict,
        province,
        setProvince,
        serviceDate,
        setServiceDate,
        serviceTime,
        setServiceTime,
        information,
        setInformation,
        creditCardNumber,
        setCreditCardNumber,
        creditCardName,
        setCreditCardName,
        creditCardExpiry,
        setCreditCardExpiry,
        creditCardCVC,
        setCreditCardCVC,
        promotionCode,
        setPromotionCode
    };

    return(
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
}

export default PaymentProvider;

