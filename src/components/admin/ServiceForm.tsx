"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  ServiceItem,
  CreateServiceInput,
  UpdateServiceInput,
  DEFAULT_CATEGORIES,
} from "../../types/service";

interface ServiceFormProps {
  initialData?: ServiceItem;
  mode: "create" | "edit";
  onSubmit: (data: CreateServiceInput | UpdateServiceInput) => Promise<void>;
  onDeleteService?: (id: string) => Promise<void>;
}

interface ServiceOptionRow {
  id?: string;
  name: string;
  price: number | string;
  unit: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onDeleteService,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>(initialData?.name || "");
  const [category, setCategory] = useState<string>(
    initialData?.category || DEFAULT_CATEGORIES[0].name
  );
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [serviceOptions, setServiceOptions] = useState<ServiceOptionRow[]>(
    initialData?.serviceOptions?.length
      ? initialData.serviceOptions.map((sub) => ({
          id: String(sub.id || sub.option_id || ""),
          name: sub.name || sub.option_name || "",
          price: sub.price,
          unit: sub.unit,
        }))
      : [
          { name: "", price: "", unit: "เครื่อง" },
          { name: "", price: "", unit: "เครื่อง" },
        ]
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleImageFileChange = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "ขนาดไฟล์ต้องไม่เกิน 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        setErrors((prev) => ({ ...prev, imageUrl: "" }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddOption = () => {
    setServiceOptions((prev) => [...prev, { name: "", price: "", unit: "เครื่อง" }]);
  };

  const handleRemoveOption = (index: number) => {
    if (serviceOptions.length <= 1) return;
    setServiceOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index: number, field: keyof ServiceOptionRow, value: string | number) => {
    setServiceOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "กรุณากรอกชื่อบริการ";
    if (!category.trim()) newErrors.category = "กรุณาเลือกหมวดหมู่";
    if (!imageUrl) newErrors.imageUrl = "กรุณาอัปโหลดรูปภาพบริการ";
    let optionError = false;
    serviceOptions.forEach((sub) => {
      if (!sub.name.trim() || sub.price === "" || !sub.unit.trim()) optionError = true;
    });
    if (optionError) newErrors.serviceOptions = "กรุณากรอกข้อมูลรายการบริการย่อยให้ครบถ้วน";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formattedOptions = serviceOptions.map((s) => ({
        id: s.id,
        option_id: s.id,
        name: s.name.trim(),
        price: Number(s.price) || 0,
        unit: s.unit.trim(),
      }));
      await onSubmit({
        name: name.trim(),
        category,
        imageUrl,
        serviceOptions: formattedOptions,
      });
    } catch (err) {
      console.error("Form submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F3F4F6", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 960, mx: "auto" }}>
        {/* Top Header */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 3,
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              component={Link}
              href={mode === "edit" && initialData ? `/admin/services/${initialData.id}` : "/admin/services"}
              sx={{ color: "grey.600" }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                บริการ
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: "#1F2937" }}>
                {mode === "create" ? "เพิ่มบริการ" : initialData?.name || "แก้ไขบริการ"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{
                borderRadius: "8px",
                px: 3,
                borderColor: "#D1D5DB",
                color: "#374151",
                "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
              }}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                px: 4,
                bgcolor: "#3366FF",
                "&:hover": { bgcolor: "#2557E0" },
              }}
            >
              {isSubmitting ? "กำลังบันทึก..." : mode === "create" ? "สร้าง" : "ยืนยัน"}
            </Button>
          </Box>
        </Paper>

        {/* Form Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            p: { xs: 3, md: 4 },
            bgcolor: "#FFFFFF",
          }}
        >
          {/* ชื่อบริการ */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3, gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, width: 140, pt: 1, flexShrink: 0, color: "#374151" }}>
              ชื่อบริการ<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="เช่น ล้างแอร์, ทำความสะอาดทั่วไป"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ maxWidth: 440 }}
              slotProps={{ input: { sx: { borderRadius: "8px" } } }}
            />
          </Box>

          {/* หมวดหมู่ */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3, gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, width: 140, pt: 1, flexShrink: 0, color: "#374151" }}>
              หมวดหมู่<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <TextField
              size="small"
              select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ maxWidth: 440 }}
              slotProps={{ input: { sx: { borderRadius: "8px" } } }}
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.category_id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* รูปภาพ */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3, gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, width: 140, pt: 1, flexShrink: 0, color: "#374151" }}>
              รูปภาพ<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box sx={{ maxWidth: 440, width: "100%" }}>
              {imageUrl ? (
                <Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: 180,
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #E5E7EB",
                      mb: 1,
                    }}
                  >
                    <img src={imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      ขนาดภาพที่แนะนำ: 1440 x 225 PX
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => setImageUrl("")}
                      sx={{ color: "#3366FF", textDecoration: "underline", p: 0, minWidth: "auto" }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(false);
                      if (e.dataTransfer.files?.[0]) handleImageFileChange(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: `2px dashed ${isDraggingImage ? "#3366FF" : errors.imageUrl ? "#EF4444" : "#D1D5DB"}`,
                      borderRadius: "8px",
                      p: 4,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: isDraggingImage ? "#EFF6FF" : "#FAFAFA",
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "#F3F4F6" },
                    }}
                  >
                    <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Typography component="span" sx={{ color: "#3366FF", fontWeight: 600 }}>
                        อัปโหลดรูปภาพ
                      </Typography>{" "}
                      หรือ ลากและวางที่นี่
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG ขนาดไม่เกิน 5MB
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    ขนาดภาพที่แนะนำ: 1440 x 225 PX
                  </Typography>
                  {errors.imageUrl && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.imageUrl}
                    </Typography>
                  )}
                </Box>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                hidden
                onChange={(e) => { if (e.target.files?.[0]) handleImageFileChange(e.target.files[0]); }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: "#E5E7EB" }} />

          {/* รายการบริการย่อย */}
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, color: "#374151" }}>
            รายการบริการย่อย
          </Typography>

          {errors.serviceOptions && (
            <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
              {errors.serviceOptions}
            </Typography>
          )}

          {/* Column Headers */}
          <Box sx={{ display: "flex", gap: 2, mb: 1, pl: 5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, flex: 1 }}>
              ชื่อรายการ<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, width: 160 }}>
              หน่วยบริการ<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, width: 180 }}>
              ค่าบริการ / 1 หน่วย<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box sx={{ width: 80 }} />
          </Box>

          {serviceOptions.map((sub, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <DragIndicatorIcon fontSize="small" sx={{ color: "grey.400", cursor: "grab" }} />
              <TextField
                size="small"
                fullWidth
                placeholder="เช่น 9,000 - 18,000 BTU, แบบติดผนัง"
                value={sub.name}
                onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                slotProps={{ input: { sx: { borderRadius: "8px" } } }}
              />
              <TextField
                size="small"
                placeholder="เครื่อง"
                value={sub.unit}
                onChange={(e) => handleOptionChange(index, "unit", e.target.value)}
                sx={{ width: 160, flexShrink: 0 }}
                slotProps={{ input: { sx: { borderRadius: "8px" } } }}
              />
              <TextField
                size="small"
                type="number"
                placeholder="800.00"
                value={sub.price}
                onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                slotProps={{
                  input: {
                    sx: { borderRadius: "8px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography color="text.secondary" sx={{ fontWeight: 700 }}>฿</Typography>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: 180, flexShrink: 0 }}
              />
              <Button
                size="small"
                onClick={() => handleRemoveOption(index)}
                sx={{
                  color: "#3366FF",
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                  textDecoration: "underline",
                  p: 0.5,
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                ลบรายการ
              </Button>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            sx={{
              mt: 1,
              borderRadius: "8px",
              borderColor: "#3366FF",
              color: "#3366FF",
              fontWeight: 600,
              px: 3,
              "&:hover": { borderColor: "#2557E0", bgcolor: "#F0F5FF" },
            }}
          >
            เพิ่มรายการ +
          </Button>

          {/* Timestamps in Edit Mode */}
          {mode === "edit" && initialData && (
            <>
              <Divider sx={{ my: 4, borderColor: "#E5E7EB" }} />
              <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, width: 120 }}>
                    สร้างเมื่อ
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#374151" }}>{initialData.createdAt}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, width: 120 }}>
                    แก้ไขล่าสุด
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#374151" }}>{initialData.updatedAt}</Typography>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Delete Service Link in Edit Mode */}
        {mode === "edit" && initialData && onDeleteService && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              color="inherit"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setShowDeleteDialog(true)}
              sx={{ color: "grey.600", textDecoration: "underline", "&:hover": { color: "error.main" } }}
            >
              ลบบริการ
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Service Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "8px" } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>ยืนยันการลบบริการ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบบริการ &quot;<strong>{initialData?.name}</strong>&quot; ใช่หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowDeleteDialog(false)} sx={{ borderRadius: "8px" }}>ยกเลิก</Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (initialData && onDeleteService) {
                await onDeleteService(String(initialData.id));
                setShowDeleteDialog(false);
              }
            }}
            sx={{ borderRadius: "8px" }}
          >
            ลบบริการ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
