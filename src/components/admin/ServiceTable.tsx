"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ClearIcon from "@mui/icons-material/Clear";
import { useServiceContext } from "../../contexts/ServiceContext";
import { ServiceItem } from "../../types/service";

function getCategoryChipColor(category: string): {
  bg: string;
  color: string;
} {
  switch (category) {
    case "บริการห้องครัว":
      return { bg: "#F4E6FF", color: "#6B11B5" };
    case "บริการห้องน้ำ":
      return { bg: "#E5F9F6", color: "#009282" };
    case "บริการห้องนอน":
      return { bg: "#FFF0E6", color: "#B54708" };
    case "บริการทั่วไป":
    default:
      return { bg: "#E7F0FF", color: "#0E49B5" };
  }
}

export const ServiceTable: React.FC = () => {
  const router = useRouter();
  const {
    services,
    isLoading,
    searchQuery,
    setSearchQuery,
    removeService,
    reorderServicesList,
  } = useServiceContext();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...services];
    const itemToMove = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, itemToMove);
    setDraggedIndex(index);
    reorderServicesList(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await removeService(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err) {
      console.error("Failed to delete service:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#F3F4F6", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header Bar */}
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
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
            บริการ
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="ค้นหาบริการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 300 }}
              slotProps={{
                input: {
                  sx: { borderRadius: "8px" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "grey.400" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              href="/admin/services/create"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                py: 1,
                bgcolor: "#3366FF",
                "&:hover": { bgcolor: "#2557E0" },
              }}
            >
              เพิ่มบริการ +
            </Button>
          </Box>
        </Paper>

        {/* Table Container */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
          }}
        >
          {isLoading ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography color="text.secondary" variant="body2">
                กำลังโหลดข้อมูลบริการ...
              </Typography>
            </Box>
          ) : services.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                {searchQuery
                  ? `ไม่พบคำที่ค้นหา "${searchQuery}"`
                  : "ยังไม่มีบริการในระบบ"}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  component={Link}
                  href="/admin/services/create"
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: "8px", bgcolor: "#3366FF" }}
                >
                  เพิ่มบริการใหม่
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#EFEFEF" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B", width: 80 }} align="center">
                      ลำดับ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>ชื่อบริการ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>หมวดหมู่</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>สร้างเมื่อ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>แก้ไขล่าสุด</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B", width: 120 }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((item: ServiceItem, index: number) => {
                    const chipColor = getCategoryChipColor(item.category);
                    return (
                      <TableRow
                        key={item.id}
                        hover
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        sx={{
                          cursor: "pointer",
                          opacity: draggedIndex === index ? 0.4 : 1,
                          "&:last-child td": { borderBottom: 0 },
                          transition: "background-color 0.15s ease",
                        }}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (!target.closest("button") && !target.closest("a")) {
                            router.push(`/admin/services/${item.id}`);
                          }
                        }}
                      >
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                            <DragIndicatorIcon fontSize="small" sx={{ color: "grey.400", cursor: "grab" }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                              {index + 1}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#1F2937" }}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              bgcolor: chipColor.bg,
                              color: chipColor.color,
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                              px: 0.5,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.createdAt}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.updatedAt}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTargetId(String(item.id));
                                setDeleteTargetName(item.name);
                              }}
                              sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              component={Link}
                              href={`/admin/services/${item.id}/edit`}
                              onClick={(e: React.MouseEvent) => e.stopPropagation()}
                              sx={{ color: "#3366FF", "&:hover": { color: "#2557E0" } }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTargetId}
        onClose={() => {
          setDeleteTargetId(null);
          setDeleteTargetName("");
        }}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: "8px" } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>ยืนยันการลบรายการ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบบริการ &quot;<strong>{deleteTargetName}</strong>&quot; ใช่หรือไม่?
            การกระทำนี้ไม่สามารถยกเลิกได้
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setDeleteTargetId(null);
              setDeleteTargetName("");
            }}
            disabled={isDeleting}
            sx={{ borderRadius: "8px" }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={isDeleting}
            sx={{ borderRadius: "8px" }}
          >
            {isDeleting ? "กำลังลบ..." : "ลบรายการ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
