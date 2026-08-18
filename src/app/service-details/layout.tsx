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

export const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [serviceTitle, setServiceTitle] = useState("");
    const [serviceDetail, setServiceDetail] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const [address, setAddress] = useState("");
    const [subdistrict, setSubdistrict] = useState("");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState("");
    const [serviceDate, setServiceDate] = useState("");
    const [serviceTime, setServiceTime] = useState("");
    const [information, setInformation] = useState("");

    const [creditCardNumber, setCreditCardNumber] = useState("");
    const [creditCardName, setCreditCardName] = useState("");
    const [creditCardExpiry, setCreditCardExpiry] = useState("");
    const [creditCardCVC, setCreditCardCVC] = useState("");

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

