import React from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

function OrderQueue({ queue, onConfirm, isOwner }) {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Antrian Pesanan</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tanggal</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>No. WA</TableCell>
            <TableCell>Menu</TableCell>
            <TableCell align="right">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queue.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center" style={{ color: '#888' }}>
                Tidak ada antrian pesanan
              </TableCell>
            </TableRow>
          )}
          {queue.map((order, idx) => (
            <TableRow key={order.id || idx}>
              <TableCell>{new Date(order.date).toLocaleString('id-ID')}</TableCell>
              <TableCell>{order.nama || '-'}</TableCell>
              <TableCell>{order.wa || '-'}</TableCell>
              <TableCell>
                {Array.isArray(order.items)
                  ? order.items.map(item => `${item.name} (${item.qty})`).join(', ')
                  : '-'}
              </TableCell>
              <TableCell align="right">
                {isOwner ? (
                  <Button variant="contained" color="success" size="small" onClick={() => onConfirm(order)}>
                    Konfirmasi
                  </Button>
                ) : (
                  <Typography variant="caption" color="text.secondary">Menunggu konfirmasi admin</Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default OrderQueue;
