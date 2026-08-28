"use client";
import React, { useEffect } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Image from "next/image";
import serviceDetailBanner from "@/assets/images/service-detail-banner.png";
import MobileFooterTwo from "./mobile-footer2";
import { hasRequiredServiceFormData, PaymentContext } from "@/app/service-details/layout";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/contexts/AuthContext";

interface Province {
	id: number;
	nameTh: string;
	nameEn: string;
}

interface District {
	id: number;
	nameTh: string;
	nameEn: string;
	provinceId?: number;
}

interface Subdistrict {
	id: number;
	nameTh: string;
	nameEn: string;
	districtId?: number;
	zipCode: number;
}

export default function HeroSectionTwo() {
	
	const payment = React.useContext(PaymentContext);
	//const { user } = useAuth();
	
	if (!payment) {
		throw new Error("HeroSection must be rendered inside PaymentProvider");
	}
	
	const { serviceFormData, setServiceFormData, setIsSecondPageCompleted, setUserId } = payment;

	// Store userId from AuthContext
	/*
	React.useEffect(() => {
		if (user?.id) {
			setUserId(user.id);
			console.log("User ID set in PaymentContext:", user.id);
		}
	}, [user, setUserId]);
	*/
	
	const [provinces, setProvinces] = React.useState<Province[]>([]);
	const [districts, setDistricts] = React.useState<District[]>([]);
	const [subdistricts, setSubdistricts] = React.useState<Subdistrict[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// Fetch provinces on component mount
	useEffect(() => {
		async function fetchProvinces() {
			try {
				setLoading(true);
				setError(null);
				const response = await apiClient.get("/api/provinces");
				console.log("Provinces API response:", response.data);
				
				// Check if response has the expected structure
				if (response.data && response.data.data) {
					if (Array.isArray(response.data.data)) {
						// If data is directly an array
						setProvinces(response.data.data);
					} else if (response.data.data.value && Array.isArray(response.data.data.value)) {
						// If data has a value property with the array
						setProvinces(response.data.data.value);
					} else {
						console.error("Unexpected response structure:", response.data);
						setError("รูปแบบข้อมูลจังหวัดไม่ถูกต้อง");
					}
				} else {
					console.error("Missing data in response:", response.data);
					setError("ไม่พบข้อมูลจังหวัด");
				}
			} catch (err) {
				console.error("Error fetching provinces:", err);
				setError("ไม่สามารถโหลดข้อมูลจังหวัดได้");
			} finally {
				setLoading(false);
			}
		}
		fetchProvinces();
	}, []);

	// Fetch districts when province changes
	useEffect(() => {
		async function fetchDistricts() {
			if (!serviceFormData.province) {
				setDistricts([]);
				setSubdistricts([]);
				return;
			}

			try {
				setLoading(true);
				const selectedProvince = provinces.find(p => p.nameTh === serviceFormData.province);
				if (!selectedProvince) return;

				const response = await apiClient.get(`/api/provinces/${selectedProvince.id}/districts`);
				console.log("Districts API response:", response.data);
				
				// Check if response has the expected structure
				if (response.data && response.data.data) {
					if (Array.isArray(response.data.data)) {
						// If data is directly an array
						setDistricts(response.data.data);
					} else if (response.data.data.districts && Array.isArray(response.data.data.districts)) {
						// If data has a districts property with the array
						setDistricts(response.data.data.districts);
					} else {
						console.error("Unexpected districts response structure:", response.data);
						setError("รูปแบบข้อมูลเขต/อำเภอไม่ถูกต้อง");
					}
				}
			} catch (err) {
				console.error("Error fetching districts:", err);
				setError("ไม่สามารถโหลดข้อมูลเขต/อำเภอได้");
			} finally {
				setLoading(false);
			}
		}
		fetchDistricts();
	}, [serviceFormData.province, provinces]);

	// Fetch subdistricts when district changes
	useEffect(() => {
		async function fetchSubdistricts() {
			if (!serviceFormData.district) {
				setSubdistricts([]);
				return;
			}

			try {
				setLoading(true);
				const selectedDistrict = districts.find(d => d.nameTh === serviceFormData.district);
				if (!selectedDistrict) return;

				const response = await apiClient.get(`/api/districts/${selectedDistrict.id}/subdistricts`);
				console.log("Subdistricts API response:", response.data);
				
				// Check if response has the expected structure
				if (response.data && response.data.data) {
					if (Array.isArray(response.data.data)) {
						// If data is directly an array
						setSubdistricts(response.data.data);
					} else if (response.data.data.subdistricts && Array.isArray(response.data.data.subdistricts)) {
						// If data has a subdistricts property with the array
						setSubdistricts(response.data.data.subdistricts);
					} else {
						console.error("Unexpected subdistricts response structure:", response.data);
						setError("รูปแบบข้อมูลแขวง/ตำบลไม่ถูกต้อง");
					}
				}
			} catch (err) {
				console.error("Error fetching subdistricts:", err);
				setError("ไม่สามารถโหลดข้อมูลแขวง/ตำบลได้");
			} finally {
				setLoading(false);
			}
		}
		fetchSubdistricts();
	}, [serviceFormData.district, districts]);

	function updateField(field: keyof typeof serviceFormData, value: string): void {
		setServiceFormData((currentForm) => {
			const nextForm = { ...currentForm, [field]: value };
			
			// Reset dependent fields when parent field changes
			if (field === "province") {
				nextForm.district = "";
				nextForm.subdistrict = "";
			} else if (field === "district") {
				nextForm.subdistrict = "";
			}

			const isComplete = hasRequiredServiceFormData(nextForm);

			setIsSecondPageCompleted(isComplete);
			return nextForm;
		});
	}


	return (
		<section className="min-h-screen bg-utility-bg pb-24 min-[801px]:pb-10">
			<div className="relative h-34.5 overflow-hidden bg-[#315d9a] min-[801px]:h-35">
				<Image
					src={serviceDetailBanner}
					alt="บริการล้างเครื่องปรับอากาศ"
					fill
					priority
					className="object-cover object-center opacity-75"
				/>
				<div className="absolute inset-0 bg-[#17396f]/20" />
				<div className="absolute left-3 top-9 flex h-10 items-center rounded-[7px] bg-white px-3 text-sm shadow-sm min-[801px]:left-1/2 min-[801px]:top-10 min-[801px]:-translate-x-1/2">
					<span className="text-gray-500">บริการของเรา</span>
					<ChevronRightRoundedIcon className="mx-1 text-[17px] text-gray-500" />
					<span className="font-semibold text-blue-600">ล้างแอร์</span>
				</div>
			</div>

			<div className="relative z-10 -mt-14 mx-3 rounded-lg border border-gray-200 bg-white px-3 py-3 min-[801px]:mx-auto min-[801px]:w-[min(720px,calc(100%-48px))] min-[801px]:px-10 min-[801px]:py-5">
				<div className="absolute left-[16.67%] right-[16.67%] top-6.25 h-px bg-gray-200" />
				<div className="relative grid grid-cols-3">
					<Step icon={<ReceiptLongOutlinedIcon className="text-[16px]" />} label="รายการ" />
					<Step icon={<EditOutlinedIcon className="text-[16px]" />} label="กรอกข้อมูลบริการ" active />
					<Step icon={<CreditCardOutlinedIcon className="text-[16px]" />} label="ชำระเงิน" />
				</div>
			</div>

			<div className="mx-3 mt-3 min-[801px]:mx-auto min-[801px]:grid min-[801px]:w-[min(720px,calc(100%-48px))] min-[801px]:grid-cols-[471px_224px] min-[801px]:gap-5">
				<form className="rounded-lg border border-gray-200 bg-white p-3 min-[801px]:p-3.5" onSubmit={(event) => event.preventDefault()}>
					<h1 className="text-base font-semibold text-gray-500">กรอกข้อมูลบริการ</h1>
					{error && (
						<div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
							{error}
						</div>
					)}
					<div className="mt-3 space-y-3 min-[801px]:grid min-[801px]:grid-cols-2 min-[801px]:gap-x-3 min-[801px]:gap-y-3 min-[801px]:space-y-0">
					<Field label="วันที่สะดวกใช้บริการ" required>
						<input type="date" value={serviceFormData.serviceDate} onChange={(event) => updateField("serviceDate", event.target.value)} className={inputClass} />
					</Field>
					<Field label="เวลาที่สะดวกใช้บริการ" required>
						<input type="time" value={serviceFormData.serviceTime} onChange={(event) => updateField("serviceTime", event.target.value)} className={inputClass} />
					</Field>
					<Field label="ที่อยู่" required>
						<input type="text" value={serviceFormData.address} onChange={(event) => updateField("address", event.target.value)} placeholder="กรุณากรอกที่อยู่" className={inputClass} />
					</Field>
					<Field label="จังหวัด" required>
						<ProvinceSelect 
							value={serviceFormData.province} 
							onChange={(value) => updateField("province", value)} 
							placeholder="เลือกจังหวัด"
							provinces={provinces}
							loading={loading}
						/>
					</Field>
					<Field label="เขต / อำเภอ" required>
						<DistrictSelect 
							value={serviceFormData.district} 
							onChange={(value) => updateField("district", value)} 
							placeholder="เลือกเขต / อำเภอ"
							districts={districts}
							loading={loading}
							disabled={!serviceFormData.province}
						/>
					</Field>
					<Field label="แขวง / ตำบล" required>
						<SubdistrictSelect 
							value={serviceFormData.subdistrict} 
							onChange={(value) => updateField("subdistrict", value)} 
							placeholder="เลือกแขวง / ตำบล"
							subdistricts={subdistricts}
							loading={loading}
							disabled={!serviceFormData.district}
						/>
					</Field>
					<Field label="ระบุข้อมูลเพิ่มเติม" className="min-[801px]:col-span-2">
						<textarea value={serviceFormData.information} onChange={(event) => updateField("information", event.target.value)} placeholder="กรุณาระบุข้อมูลเพิ่มเติม" className={`${inputClass} h-17.25 resize-none py-2`} />
					</Field>
				</div>
				</form>

				<MobileFooterTwo />
			</div>
		</section>
	);
}

const inputClass = "h-8 w-full rounded-[7px] border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-500 focus:border-blue-500";

function Field({ children, className = "", label, required = false }: { children: React.ReactNode; className?: string; label: string; required?: boolean }) {
	return (
		<label className={`block text-sm font-medium text-gray-700 ${className}`}>
			<span className="mb-1 block">{label}{required && <span className="text-red-500">*</span>}</span>
			{children}
		</label>
	);
}

function ProvinceSelect({ onChange, placeholder, value, provinces, loading }: { 
	onChange: (value: string) => void; 
	placeholder: string; 
	value: string;
	provinces: Province[];
	loading: boolean;
}) {
	return (
		<select 
			value={value} 
			onChange={(event) => onChange(event.target.value)} 
			className={`${inputClass} appearance-auto`}
			disabled={loading}
		>
			<option value="" disabled>{loading ? "กำลังโหลด..." : placeholder}</option>
			{provinces?.map((province) => (
				<option key={province.id} value={province.nameTh}>
					{province.nameTh}
				</option>
			))}
		</select>
	);
}

function DistrictSelect({ onChange, placeholder, value, districts, loading, disabled }: { 
	onChange: (value: string) => void; 
	placeholder: string; 
	value: string;
	districts: District[];
	loading: boolean;
	disabled: boolean;
}) {
	return (
		<select 
			value={value} 
			onChange={(event) => onChange(event.target.value)} 
			className={`${inputClass} appearance-auto`}
			disabled={loading || disabled}
		>
			<option value="" disabled>
				{disabled ? "กรุณาเลือกจังหวัดก่อน" : loading ? "กำลังโหลด..." : placeholder}
			</option>
			{districts?.map((district) => (
				<option key={district.id} value={district.nameTh}>
					{district.nameTh}
				</option>
			))}
		</select>
	);
}

function SubdistrictSelect({ onChange, placeholder, value, subdistricts, loading, disabled }: { 
	onChange: (value: string) => void; 
	placeholder: string; 
	value: string;
	subdistricts: Subdistrict[];
	loading: boolean;
	disabled: boolean;
}) {
	return (
		<select 
			value={value} 
			onChange={(event) => onChange(event.target.value)} 
			className={`${inputClass} appearance-auto`}
			disabled={loading || disabled}
		>
			<option value="" disabled>
				{disabled ? "กรุณาเลือกเขต/อำเภอก่อน" : loading ? "กำลังโหลด..." : placeholder}
			</option>
			{subdistricts?.map((subdistrict) => (
				<option key={subdistrict.id} value={subdistrict.nameTh}>
					{subdistrict.nameTh}
				</option>
			))}
		</select>
	);
}

function Select({ onChange, placeholder, value }: { onChange: (value: string) => void; placeholder: string; value: string }) {
	return (
		<select value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} appearance-auto`}>
			<option value="" disabled>{placeholder}</option>
			<option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
			<option value="นนทบุรี">นนทบุรี</option>
			<option value="ปทุมธานี">ปทุมธานี</option>
		</select>
	);
}

function Step({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
	return (
		<div className={`flex flex-col items-center text-center ${active ? "text-blue-600" : "text-gray-500"}`}>
			<span className={`flex size-7 items-center justify-center rounded-full border bg-white ${active ? "border-blue-500" : "border-gray-300"}`}>
				{icon}
			</span>
			<span className="mt-1 whitespace-nowrap text-xs font-medium">{label}</span>
		</div>
	);
}
