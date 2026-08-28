"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Rating,
  TextField,
  Chip,
  Fade,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { reviewApi } from "@/services/reviewApi";
import type { CustomerServiceOrder } from "@/types/customer-service";

interface ReviewServiceModalProps {
  order: CustomerServiceOrder | null;
  open: boolean;
  onClose: () => void;
  onSubmitReview?: (orderId: string, rating: number, comment: string) => void;
  onDeleteReview?: (orderId: string) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "ควรปรับปรุง 😞",
  2: "พอใช้ 😐",
  3: "ปานกลาง 🙂",
  4: "ดีมาก 😊",
  5: "ยอดเยี่ยมมาก ประทับใจสุดๆ! 🌟",
};

const QUICK_TAGS = [
  "ช่างมาตรงเวลา",
  "ทำงานสะอาดเรียบร้อย",
  "บริการสุภาพ",
  "ราคาคุ้มค่า",
  "ฝีมือยอดเยี่ยม",
  "ให้คำแนะนำดีมาก",
];

export function ReviewServiceModal({
  order,
  open,
  onClose,
  onSubmitReview,
  onDeleteReview,
}: ReviewServiceModalProps) {
  const isEditMode = Boolean(order?.isReviewed);
  const [rating, setRating] = useState<number>(order?.reviewRating || 5);
  const [hoverRating, setHoverRating] = useState<number>(-1);
  const [comment, setComment] = useState<string>(order?.reviewComment || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("ขอบคุณสำหรับคำรีวิว!");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when order changes
  useEffect(() => {
    if (order) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(order.reviewRating || 5);
      setComment(order.reviewComment || "");
      setErrorMessage(null);
      setIsSuccess(false);
      setShowDeleteConfirm(false);
    }
  }, [order, open]);

  if (!order) return null;

  const currentDisplayRating = hoverRating !== -1 ? hoverRating : rating;
  const ratingText = RATING_LABELS[currentDisplayRating] || "กดเพื่อให้คะแนน";
  const serviceName = order.items[0]?.name || "บริการซ่อมบำรุง";

  const handleTagClick = (tag: string) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  const handleSubmit = async () => {
    if (!order) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isEditMode) {
        await reviewApi.updateReview(order.orderCode || order.id, {
          rating,
          comment,
        });
        setSuccessMessage("บันทึกการแก้ไขรีวิวสำเร็จ!");
      } else {
        await reviewApi.createReview({
          orderCode: order.orderCode || order.id,
          orderId: order.id,
          rating,
          comment,
          serviceId: order.serviceId,
          serviceName: order.serviceName || serviceName,
          technicianId: order.technicianId,
          technicianName: order.technicianName,
        });
        setSuccessMessage("ขอบคุณสำหรับคำรีวิว!");
      }

      setIsSuccess(true);
      if (onSubmitReview) {
        onSubmitReview(order.id, rating, comment);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err?.response?.status === 409) {
        if (onSubmitReview) {
          onSubmitReview(order.id, rating, comment);
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1500);
      } else {
        setErrorMessage(
          err?.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกรีวิว กรุณาลองใหม่อีกครั้ง"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!order) return;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await reviewApi.deleteReview(order.orderCode || order.id);
      setSuccessMessage("ยกเลิกรีวิวเรียบร้อยแล้ว");
      setIsSuccess(true);

      if (onDeleteReview) {
        onDeleteReview(order.id);
      }

      setTimeout(() => {
        setIsSuccess(false);
        setComment("");
        setRating(5);
        setShowDeleteConfirm(false);
        onClose();
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err?.response?.data?.message || "เกิดข้อผิดพลาดในการยกเลิกรีวิว กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting && !isDeleting) {
      setErrorMessage(null);
      setIsSuccess(false);
      setShowDeleteConfirm(false);
      onClose();
    }
  };


  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.14)",
            m: { xs: 2, sm: 3 },
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: { xs: 2.5, sm: 3 },
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700, color: "#0F172A", fontSize: { xs: "1.125rem", sm: "1.25rem" } }}
          >
            {isEditMode ? "แก้ไขหรือยกเลิกรีวิวบริการ" : "ให้คะแนนและรีวิวบริการ"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.8125rem" }}>
            รหัสคำสั่งซ่อม: <span className="font-semibold text-[#334155]">{order.orderCode}</span>
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleModalClose}
          sx={{
            color: "#94A3B8",
            "&:hover": { color: "#334155", bgcolor: "#F1F5F9" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        {isSuccess ? (
          <Fade in timeout={300}>
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CheckCircleRoundedIcon sx={{ fontSize: 64, color: "#16A34A", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}>
                {successMessage}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                ความคิดเห็นของคุณช่วยให้เราพัฒนาการให้บริการดียิ่งขึ้น
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Box className="space-y-6">
            {errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            {/* Service & Technician Info Card */}
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                  บริการที่ได้รับ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                  {serviceName}
                </Typography>
              </Box>

              {order.technicianName && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      p: 0.75,
                      borderRadius: "50%",
                      bgcolor: "rgba(51, 102, 255, 0.1)",
                      color: "#3366FF",
                      display: "flex",
                    }}
                  >
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                      ช่างผู้ให้บริการ
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                      {order.technicianName}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Rating Selector */}
            <Box sx={{ textAlign: "center", py: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#334155", fontWeight: 600, mb: 1.5 }}
              >
                คุณพอใจกับการบริการครั้งนี้มากน้อยเพียงใด?
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                <Rating
                  name="service-rating"
                  value={rating}
                  onChange={(_, newValue) => {
                    if (newValue !== null) setRating(newValue);
                  }}
                  onChangeActive={(_, newHover) => {
                    setHoverRating(newHover);
                  }}
                  icon={<StarRoundedIcon sx={{ fontSize: { xs: 44, sm: 52 }, color: "#F59E0B" }} />}
                  emptyIcon={<StarOutlineRoundedIcon sx={{ fontSize: { xs: 44, sm: 52 }, color: "#CBD5E1" }} />}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: currentDisplayRating >= 4 ? "#D97706" : "#64748B",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  minHeight: "24px",
                  transition: "all 0.2s ease",
                }}
              >
                {ratingText}
              </Typography>
            </Box>

            {/* Quick Click Tags */}
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, mb: 1, display: "block" }}>
                แตะเพื่อเลือกความคิดเห็นอย่างรวดเร็ว:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {QUICK_TAGS.map((tag) => {
                  const isSelected = comment.includes(tag);
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleTagClick(tag)}
                      sx={{
                        borderRadius: "8px",
                        bgcolor: isSelected ? "#EBF0FF" : "#F1F5F9",
                        color: isSelected ? "#3366FF" : "#475569",
                        fontWeight: isSelected ? 600 : 400,
                        border: isSelected ? "1px solid #BFDBFE" : "1px solid transparent",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: isSelected ? "#DBEAFE" : "#E2E8F0",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Review Comment TextField */}
            <Box>
              <Typography variant="caption" sx={{ color: "#334155", fontWeight: 600, mb: 0.75, display: "block" }}>
                เขียนรีวิวความประทับใจ หรือข้อเสนอแนะเพิ่มเติม:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="บอกเล่าประสบการณ์การใช้บริการของคุณกับเรา เช่น ช่างทำงานสุภาพ เรียบร้อย..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#FFFFFF",
                    fontSize: "0.875rem",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&:hover fieldset": { borderColor: "#CBD5E1" },
                    "&.Mui-focused fieldset": { borderColor: "#3366FF" },
                  },
                }}
              />
            </Box>

            {/* Actions */}
            <Box sx={{ pt: 1 }}>
              {showDeleteConfirm ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    bgcolor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#991B1B", mb: 1.5 }}>
                    คุณต้องการยกเลิกและลบรีวิวนี้ใช่หรือไม่?
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      sx={{
                        py: 1,
                        borderRadius: "8px",
                        borderColor: "#CBD5E1",
                        color: "#475569",
                        fontWeight: 600,
                        bgcolor: "#FFFFFF",
                        "&:hover": { bgcolor: "#F8FAFC" },
                      }}
                    >
                      ย้อนกลับ
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={executeDelete}
                      disabled={isDeleting}
                      sx={{
                        py: 1,
                        borderRadius: "8px",
                        bgcolor: "#DC2626",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
                        "&:hover": { bgcolor: "#B91C1C" },
                      }}
                    >
                      {isDeleting ? "กำลังลบ..." : "ยืนยันลบรีวิว"}
                    </Button>
                  </Box>
                </Box>
              ) : isEditMode ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting || isDeleting}
                    sx={{
                      py: 1.25,
                      borderRadius: "8px",
                      borderColor: "#FCA5A5",
                      color: "#DC2626",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#EF4444",
                        bgcolor: "#FEF2F2",
                      },
                    }}
                  >
                    ยกเลิกรีวิว
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting || isDeleting}
                    sx={{
                      py: 1.25,
                      borderRadius: "8px",
                      bgcolor: "#3366FF",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(51, 102, 255, 0.2)",
                      "&:hover": {
                        bgcolor: "#2554DB",
                      },
                    }}
                  >
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleModalClose}
                    disabled={isSubmitting}
                    sx={{
                      py: 1.25,
                      borderRadius: "8px",
                      borderColor: "#CBD5E1",
                      color: "#475569",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#94A3B8",
                        bgcolor: "#F8FAFC",
                      },
                    }}
                  >
                    ไว้คราวหลัง
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                      py: 1.25,
                      borderRadius: "8px",
                      bgcolor: "#3366FF",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(51, 102, 255, 0.2)",
                      "&:hover": {
                        bgcolor: "#2554DB",
                      },
                    }}
                  >
                    {isSubmitting ? "กำลังส่งรีวิว..." : "ส่งรีวิว"}
                  </Button>
                </Box>
              )}
            </Box>

          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReviewServiceModal;
