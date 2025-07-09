import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

function CustomerOrderDialog({ open, order, onEdit, onSave, onCancel }) {
  if (!order) return null;
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Konfirmasi Pesanan</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Silakan konfirmasi kepada admin jika pesanan sudah sesuai.
        </Typography>
        {order.nama && (
          <Typography variant="subtitle2">Nama: {order.nama}</Typography>
        )}
        {order.wa && (
          <Typography variant="subtitle2" sx={{ mb: 1 }}>No. WA: {order.wa}</Typography>
        )}
        <Box sx={{ mb: 2 }}>
          {order.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <span>{item.name} x {item.qty}</span>
              <span>Rp{(item.price * item.qty).toLocaleString()}</span>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onEdit} variant="outlined">Edit</Button>
        <Button onClick={onSave} variant="contained" color="primary">Simpan</Button>
        <Button onClick={onCancel} variant="text" color="error">Batal</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerOrderDialog;
