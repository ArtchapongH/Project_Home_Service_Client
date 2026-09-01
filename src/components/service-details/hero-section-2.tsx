"use client";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Image from "next/image";
import serviceDetailBanner from "@/assets/images/service-detail-banner.png";
import MobileFooterTwo from "./mobile-footer2";
import { getServiceBreadcrumbName, hasRequiredServiceFormData, PaymentContext, type ServiceFormData } from "@/app/service-details/layout";
import apiClient from "@/services/apiClient";
import {
	matchPlaceName,
	normalizeAdminPlaces,
	reverseGeocodeServiceLocation,
	type AdminPlace,
} from "@/utils/serviceLocation";
import { normalizeClockTime } from "@/utils/serviceSchedule";


import createIcon1 from "@/assets/icons/create_black_24dp 1.png";
import createIcon2 from "@/assets/icons/create_black_24dp 2.png";
import createIcon3 from "@/assets/icons/create_black_24dp 3.png";


const ServiceLocationMap = dynamic(
	() => import("./ServiceLocationMap").then((module) => module.ServiceLocationMap),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-64 items-center justify-center rounded-[7px] border border-gray-300 bg-gray-100 text-sm text-gray-500">
				กำลังโหลดแผนที่...
			</div>
		),
	},
);

type Province = AdminPlace;
type District = AdminPlace;
type Subdistrict = AdminPlace;

export default function HeroSectionTwo() {
	
	const payment = React.useContext(PaymentContext);
	//const { user } = useAuth();
	
	if (!payment) {
		throw new Error("HeroSection must be rendered inside PaymentProvider");
	}
	
	const { serviceFormData, setServiceFormData, setIsSecondPageCompleted, serviceTitle, serviceDetail } = payment;

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
	const [mapNotice, setMapNotice] = React.useState<string | null>(null);
	const [isLocating, setIsLocating] = React.useState(false);
	const geocodeTimeoutRef = useRef<number | null>(null);
	const fillGenerationRef = useRef(0);
	const mapFillLockRef = useRef(false);
	const provincesRef = useRef<Province[]>([]);

	provincesRef.current = provinces;

	function writeForm(updater: (current: ServiceFormData) => ServiceFormData): void {
		setServiceFormData((currentForm) => {
			const nextForm = updater(currentForm);
			setIsSecondPageCompleted(hasRequiredServiceFormData(nextForm));
			return nextForm;
		});
	}

	async function loadDistricts(provinceName: string, provinceOptions: Province[] = provincesRef.current): Promise<District[]> {
		const selectedProvince = provinceOptions.find((province) => province.nameTh === provinceName);
		if (!selectedProvince) return [];
		const response = await apiClient.get(`/api/provinces/${selectedProvince.id}/districts`);
		return normalizeAdminPlaces(response.data);
	}

	async function loadSubdistricts(districtName: string, districtOptions: District[]): Promise<Subdistrict[]> {
		const selectedDistrict = districtOptions.find((district) => district.nameTh === districtName);
		if (!selectedDistrict) return [];
		const response = await apiClient.get(`/api/districts/${selectedDistrict.id}/subdistricts`);
		return normalizeAdminPlaces(response.data);
	}

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
					const nextProvinces = normalizeAdminPlaces(response.data);
					if (nextProvinces.length === 0) {
						setError("รูปแบบข้อมูลจังหวัดไม่ถูกต้อง");
					} else {
						setProvinces(nextProvinces);
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

	useEffect(() => {
		async function fetchDistricts() {
			if (mapFillLockRef.current) return;
			if (!serviceFormData.province) {
				setDistricts([]);
				setSubdistricts([]);
				return;
			}

			try {
				setError(null);
				const nextDistricts = await loadDistricts(serviceFormData.province);
				if (mapFillLockRef.current) return;
				setDistricts(nextDistricts);
				if (!nextDistricts.some((district) => district.nameTh === serviceFormData.district)) {
					setSubdistricts([]);
				}
			} catch (err) {
				console.error("Error fetching districts:", err);
				setError("ไม่สามารถโหลดข้อมูลเขต/อำเภอได้");
			}
		}
		void fetchDistricts();
	}, [serviceFormData.province, provinces]);

	useEffect(() => {
		async function fetchSubdistricts() {
			if (mapFillLockRef.current) return;
			if (!serviceFormData.district) {
				setSubdistricts([]);
				return;
			}

			try {
				setError(null);
				const nextSubdistricts = await loadSubdistricts(serviceFormData.district, districts);
				if (mapFillLockRef.current) return;
				setSubdistricts(nextSubdistricts);
			} catch (err) {
				console.error("Error fetching subdistricts:", err);
				setError("ไม่สามารถโหลดข้อมูลแขวง/ตำบลได้");
			}
		}
		void fetchSubdistricts();
	}, [serviceFormData.district, districts]);

	function updateField(field: keyof ServiceFormData, value: string): void {
		writeForm((currentForm) => {
			const nextForm = {
				...currentForm,
				[field]: field === "serviceTime" ? normalizeClockTime(value) : value,
			};

			if (field === "province") {
				nextForm.district = "";
				nextForm.subdistrict = "";
			} else if (field === "district") {
				nextForm.subdistrict = "";
			}

			return nextForm;
		});
	}

	async function fillAddressFromPin(latitude: number, longitude: number): Promise<void> {
		const generation = ++fillGenerationRef.current;
		setMapNotice("กำลังค้นหาที่อยู่จากแผนที่...");
		try {
			const resolved = await reverseGeocodeServiceLocation(latitude, longitude);
			if (generation !== fillGenerationRef.current) return;

			const currentProvinces = provincesRef.current;
			const provinceName = matchPlaceName(currentProvinces, resolved.provinceHints) ?? "";
			let districtName = "";
			let subdistrictName = "";
			let nextDistricts: District[] = [];
			let nextSubdistricts: Subdistrict[] = [];

			if (provinceName) {
				nextDistricts = await loadDistricts(provinceName, currentProvinces);
				if (generation !== fillGenerationRef.current) return;
				districtName = matchPlaceName(nextDistricts, resolved.districtHints) ?? "";
				if (districtName) {
					nextSubdistricts = await loadSubdistricts(districtName, nextDistricts);
					if (generation !== fillGenerationRef.current) return;
					subdistrictName = matchPlaceName(nextSubdistricts, resolved.subdistrictHints) ?? "";
				}
			}

			mapFillLockRef.current = true;
			setDistricts(nextDistricts);
			setSubdistricts(nextSubdistricts);
			writeForm((currentForm) => ({
				...currentForm,
				latitude,
				longitude,
				address: resolved.streetAddress || currentForm.address,
				province: provinceName,
				district: districtName,
				subdistrict: subdistrictName,
			}));
			window.setTimeout(() => {
				mapFillLockRef.current = false;
			}, 0);

			if (!provinceName) {
				setMapNotice("ปักหมุดแล้ว แต่ไม่พบจังหวัดในระบบ กรุณาเลือกหรือพิมพ์ที่อยู่เองได้");
			} else if (!districtName) {
				setMapNotice("ปักหมุดแล้ว กรุณาเลือกเขต/อำเภอ หรือแก้ที่อยู่ในช่องได้");
			} else if (!subdistrictName) {
				setMapNotice("ปักหมุดแล้ว กรุณาเลือกแขวง/ตำบล หรือแก้ที่อยู่ในช่องได้");
			} else {
				setMapNotice("ปักหมุดแล้ว ระบบกรอกที่อยู่ให้แล้ว สามารถแก้ไขในช่องได้");
			}
		} catch {
			if (generation !== fillGenerationRef.current) return;
			writeForm((currentForm) => ({ ...currentForm, latitude, longitude }));
			setMapNotice("ปักหมุดแล้ว แต่ค้นหาที่อยู่ไม่สำเร็จ กรุณากรอกที่อยู่เอง");
		}
	}

	function handlePinSelect(latitude: number, longitude: number): void {
		writeForm((currentForm) => ({ ...currentForm, latitude, longitude }));
		if (geocodeTimeoutRef.current) window.clearTimeout(geocodeTimeoutRef.current);
		geocodeTimeoutRef.current = window.setTimeout(() => {
			void fillAddressFromPin(latitude, longitude);
		}, 400);
	}

	function locateCurrentPosition(): void {
		if (!("geolocation" in navigator)) {
			setMapNotice("Browser นี้ไม่รองรับการใช้งาน Location");
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setIsLocating(false);
				handlePinSelect(position.coords.latitude, position.coords.longitude);
			},
			() => {
				setIsLocating(false);
				setMapNotice("ไม่สามารถอ่านตำแหน่งปัจจุบันได้ กรุณาปักหมุดบนแผนที่");
			},
			{ enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
		);
	}

	useEffect(() => {
		return () => {
			if (geocodeTimeoutRef.current) window.clearTimeout(geocodeTimeoutRef.current);
		};
	}, []);


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
					<span className="font-semibold text-blue-600">{getServiceBreadcrumbName(serviceTitle, serviceDetail)}</span>
				</div>
			</div>

			<div className="relative z-10 -mt-14 mx-3 rounded-lg border border-gray-200 bg-white px-3 py-3 min-[801px]:mx-auto min-[801px]:w-[min(720px,calc(100%-48px))] min-[801px]:px-10 min-[801px]:py-5">
				<div className="absolute left-[calc(16.67%+14px)] right-[calc(16.67%+14px)] top-[26px] z-0 h-0.5 bg-gray-200 min-[801px]:top-[34px]" />
				<div className="absolute left-[calc(16.67%+14px)] top-[26px] z-0 h-0.5 w-[calc(33.33%-28px)] bg-blue-500 min-[801px]:top-[34px]" />
				<div className="relative z-10 grid grid-cols-3">
					<Step icon={<Image className="brightness-0 invert" src={createIcon3} alt="" width={16} height={16} aria-hidden />} label="รายการ" completed />
					<Step icon={<Image className="brightness-0 saturate-100 invert-[48%] sepia-[99%] saturate-[2547%] hue-rotate-[205deg] brightness-[99%] contrast-[91%]" src={createIcon1} alt="" width={16} height={16} aria-hidden />} label="กรอกข้อมูลบริการ" active />
					<Step icon={<Image src={createIcon2} alt="" width={16} height={16} aria-hidden />} label="ชำระเงิน" />
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
					<section className="mt-3">
						<h2 className="text-sm font-medium text-gray-700">จุดหมายที่ช่างต้องไป<span className="text-red-500">*</span></h2>
						<p className="mt-1 text-xs text-gray-500">ปักหมุดเพื่อให้ระบบกรอกที่อยู่ให้ หรือกรอกและเลือกในช่องด้านล่างเองก็ได้</p>
						<div className="mt-2">
							<ServiceLocationMap
								latitude={serviceFormData.latitude}
								longitude={serviceFormData.longitude}
								onPinSelect={handlePinSelect}
							/>
						</div>
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={locateCurrentPosition}
								disabled={isLocating}
								className="h-8 rounded-[7px] border border-blue-500 px-3 text-xs font-medium text-blue-600 disabled:opacity-50"
							>
								{isLocating ? "กำลังค้นหาตำแหน่ง..." : "ใช้ตำแหน่งปัจจุบัน"}
							</button>
							{serviceFormData.latitude != null && serviceFormData.longitude != null ? (
								<p className="text-xs text-gray-500">
									พิกัด {serviceFormData.latitude.toFixed(5)}, {serviceFormData.longitude.toFixed(5)}
								</p>
							) : (
								<p className="text-xs text-red-500">กรุณาปักหมุดบนแผนที่ก่อนดำเนินการต่อ</p>
							)}
						</div>
						{mapNotice && (
							<p role="status" className="mt-2 text-xs text-gray-600">
								{mapNotice}
							</p>
						)}
					</section>
					<div className="mt-3 space-y-3 min-[801px]:grid min-[801px]:grid-cols-2 min-[801px]:gap-x-3 min-[801px]:gap-y-3 min-[801px]:space-y-0">
					<Field label="วันที่สะดวกใช้บริการ" required>
						<input type="date" value={serviceFormData.serviceDate} onChange={(event) => updateField("serviceDate", event.target.value)} className={inputClass} />
					</Field>
					<Field label="เวลาที่สะดวกใช้บริการ" required>
						<input type="time" step={60} value={serviceFormData.serviceTime} onChange={(event) => updateField("serviceTime", event.target.value)} className={inputClass} />
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
							loading={loading && provinces.length === 0}
						/>
					</Field>
					<Field label="เขต / อำเภอ" required>
						<DistrictSelect 
							value={serviceFormData.district} 
							onChange={(value) => updateField("district", value)} 
							placeholder="เลือกเขต / อำเภอ"
							districts={districts}
							disabled={!serviceFormData.province}
						/>
					</Field>
					<Field label="แขวง / ตำบล" required>
						<SubdistrictSelect 
							value={serviceFormData.subdistrict} 
							onChange={(value) => updateField("subdistrict", value)} 
							placeholder="เลือกแขวง / ตำบล"
							subdistricts={subdistricts}
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

function DistrictSelect({ onChange, placeholder, value, districts, disabled }: { 
	onChange: (value: string) => void; 
	placeholder: string; 
	value: string;
	districts: District[];
	disabled: boolean;
}) {
	return (
		<select 
			value={value} 
			onChange={(event) => onChange(event.target.value)} 
			className={`${inputClass} appearance-auto`}
			disabled={disabled}
		>
			<option value="" disabled>
				{disabled ? "กรุณาเลือกจังหวัดก่อน" : placeholder}
			</option>
			{districts?.map((district) => (
				<option key={district.id} value={district.nameTh}>
					{district.nameTh}
				</option>
			))}
		</select>
	);
}

function SubdistrictSelect({ onChange, placeholder, value, subdistricts, disabled }: { 
	onChange: (value: string) => void; 
	placeholder: string; 
	value: string;
	subdistricts: Subdistrict[];
	disabled: boolean;
}) {
	return (
		<select 
			value={value} 
			onChange={(event) => onChange(event.target.value)} 
			className={`${inputClass} appearance-auto`}
			disabled={disabled}
		>
			<option value="" disabled>
				{disabled ? "กรุณาเลือกเขต/อำเภอก่อน" : placeholder}
			</option>
			{subdistricts?.map((subdistrict) => (
				<option key={subdistrict.id} value={subdistrict.nameTh}>
					{subdistrict.nameTh}
				</option>
			))}
		</select>
	);
}

function Step({ icon, label, active = false, completed = false }: { icon: React.ReactNode; label: string; active?: boolean; completed?: boolean }) {
	return (
		<div className={`flex flex-col items-center text-center ${active || completed ? "text-blue-600" : "text-gray-500"}`}>
			<span className={`flex size-7 items-center justify-center rounded-full border-2 ${completed ? "border-blue-500 bg-blue-500" : active ? "border-blue-500 bg-white" : "border-gray-300 bg-white"}`}>
				{icon}
			</span>
			<span className="mt-1 whitespace-nowrap text-xs font-medium">{label}</span>
		</div>
	);
}
