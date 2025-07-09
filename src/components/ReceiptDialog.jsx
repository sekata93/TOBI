import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Box
} from '@mui/material';

function ReceiptDialog({ open, onClose, transaction }) {
  if (!transaction) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Nota Transaksi</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Tanggal: {new Date(transaction.date).toLocaleString('id-ID')}</Typography>
      {transaction.nama && (
        <Typography variant="body2">Nama: {transaction.nama}</Typography>
      )}
      {transaction.wa && transaction.wa.trim() !== '' && (
        <Typography variant="body2">No. WA: {transaction.wa}</Typography>
      )}
        <Table size="small" sx={{ my: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Menu</TableCell>
              <TableCell align="right">Harga</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">Rp{item.price.toLocaleString()}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell align="right">Rp{(item.price * item.qty).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Total</Typography>
          <Typography variant="h6">Rp{transaction.total.toLocaleString()}</Typography>
        </Box>
        <Typography>Bayar: Rp{transaction.paid.toLocaleString()}</Typography>
        <Typography>Kembalian: Rp{transaction.kembalian.toLocaleString()}</Typography>
        <Typography>Jenis Pembayaran: {transaction.paymentType}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReceiptDialog;
