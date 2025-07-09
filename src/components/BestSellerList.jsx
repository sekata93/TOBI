import React, { useMemo } from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function BestSellerList({ transactions }) {
  // Hitung total terjual per produk
  const bestSellers = useMemo(() => {
    const count = {};
    transactions.forEach(trx => {
      trx.items.forEach(item => {
        if (!count[item.name]) count[item.name] = 0;
        count[item.name] += item.qty;
      });
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const bestCategories = useMemo(() => {
    const catCount = {};
    transactions.forEach(trx => {
      trx.items.forEach(item => {
        if (!item.kategori) return;
        if (!catCount[item.kategori]) catCount[item.kategori] = 0;
        catCount[item.kategori] += item.qty;
      });
    });
    return Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Produk Terlaris</Typography>
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nama Produk</TableCell>
            <TableCell align="right">Jumlah Terjual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bestSellers.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center" style={{ color: '#888' }}>
                Belum ada transaksi penjualan
              </TableCell>
            </TableRow>
          )}
          {bestSellers.map(([name, qty], idx) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell align="right">{qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" gutterBottom>Kategori Terlaris</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Kategori</TableCell>
            <TableCell align="right">Jumlah Terjual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bestCategories.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center" style={{ color: '#888' }}>
                Belum ada transaksi penjualan
              </TableCell>
            </TableRow>
          )}
          {bestCategories.map(([cat, qty], idx) => (
            <TableRow key={cat}>
              <TableCell>{cat.charAt(0).toUpperCase() + cat.slice(1)}</TableCell>
              <TableCell align="right">{qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default BestSellerList;
