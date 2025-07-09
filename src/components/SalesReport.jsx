import React, { useMemo, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function getDateString(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

function getMonthString(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

function getYearString(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}`;
}

function SalesReport({ transactions }) {
  const [reportType, setReportType] = useState('harian');
  // Group transaksi per hari
  const daily = useMemo(() => {
    const map = {};
    transactions.forEach(trx => {
      const d = getDateString(trx.date);
      if (!map[d]) map[d] = { omzet: 0, count: 0 };
      map[d].omzet += trx.total;
      map[d].count += 1;
    });
    return map;
  }, [transactions]);

  // Group transaksi per bulan
  const monthly = useMemo(() => {
    const map = {};
    transactions.forEach(trx => {
      const m = getMonthString(trx.date);
      if (!map[m]) map[m] = { omzet: 0, count: 0 };
      map[m].omzet += trx.total;
      map[m].count += 1;
    });
    return map;
  }, [transactions]);

  // Group transaksi per tahun
  const yearly = useMemo(() => {
    const map = {};
    transactions.forEach(trx => {
      const y = getYearString(trx.date);
      if (!map[y]) map[y] = { omzet: 0, count: 0 };
      map[y].omzet += trx.total;
      map[y].count += 1;
    });
    return map;
  }, [transactions]);

  // Produk terlaris
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

  // Total omzet & transaksi minggu ini
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const weekly = useMemo(() => {
    let omzet = 0, count = 0;
    transactions.forEach(trx => {
      const d = new Date(trx.date);
      if (d >= weekAgo && d <= now) {
        omzet += trx.total;
        count += 1;
      }
    });
    return { omzet, count };
  }, [transactions]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Laporan Penjualan</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography>Omzet Minggu Ini: <b>Rp{weekly.omzet.toLocaleString()}</b></Typography>
        <Typography>Jumlah Transaksi Minggu Ini: <b>{weekly.count}</b></Typography>
      </Box>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Laporan</InputLabel>
        <Select value={reportType} label="Laporan" onChange={e => setReportType(e.target.value)}>
          <MenuItem value="harian">Laporan Harian</MenuItem>
          <MenuItem value="bulanan">Laporan Bulanan</MenuItem>
          <MenuItem value="tahunan">Laporan Tahunan</MenuItem>
        </Select>
      </FormControl>
      <Table size="small" sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>{reportType === 'harian' ? 'Tanggal' : reportType === 'bulanan' ? 'Bulan' : 'Tahun'}</TableCell>
            <TableCell align="right">Transaksi</TableCell>
            <TableCell align="right">Omzet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(reportType === 'harian' ? Object.entries(daily) : reportType === 'bulanan' ? Object.entries(monthly) : Object.entries(yearly))
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([key, d]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell align="right">{d.count}</TableCell>
                <TableCell align="right">Rp{d.omzet.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Typography variant="subtitle1" sx={{ mt: 3 }}>Detail Transaksi</Typography>
      <Table size="small" sx={{ mb: 2, mt: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tanggal</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>No. WA</TableCell>
            <TableCell>Item</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Pembayaran</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" style={{ color: '#888' }}>
                Belum ada transaksi
              </TableCell>
            </TableRow>
          )}
          {transactions.map((trx, idx) => (
            <TableRow key={trx.id || idx}>
              <TableCell>{formatDate(trx.date)}</TableCell>
              <TableCell>{trx.nama || '-'}</TableCell>
              <TableCell>{trx.wa || '-'}</TableCell>
              <TableCell>
                {Array.isArray(trx.items)
                  ? trx.items.map(item => `${item.name} (${item.qty})`).join(', ')
                  : '-'}
              </TableCell>
              <TableCell align="right">Rp{trx.total.toLocaleString()}</TableCell>
              <TableCell>{trx.paymentType || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="subtitle1">Produk Terlaris</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {bestSellers.length === 0 && <Typography color="text.secondary">Belum ada transaksi.</Typography>}
        {bestSellers.slice(0, 5).map(([name, qty]) => (
          <Chip key={name} label={`${name} (${qty})`} color="primary" />
        ))}
      </Box>
    </Paper>
  );
}

export default SalesReport;
