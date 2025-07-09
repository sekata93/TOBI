import React, { useMemo, useState } from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';

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

function ExpenseReport({ expenses }) {
  const [reportType, setReportType] = useState('harian');

  // Group pengeluaran
  const daily = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const d = getDateString(e.tanggal);
      if (!map[d]) map[d] = { total: 0, count: 0 };
      map[d].total += e.jumlah;
      map[d].count += 1;
    });
    return map;
  }, [expenses]);
  const monthly = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const m = getMonthString(e.tanggal);
      if (!map[m]) map[m] = { total: 0, count: 0 };
      map[m].total += e.jumlah;
      map[m].count += 1;
    });
    return map;
  }, [expenses]);
  const yearly = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const y = getYearString(e.tanggal);
      if (!map[y]) map[y] = { total: 0, count: 0 };
      map[y].total += e.jumlah;
      map[y].count += 1;
    });
    return map;
  }, [expenses]);

  // Kategori teratas
  const bestCategories = useMemo(() => {
    const count = {};
    expenses.forEach(e => {
      if (!count[e.kategori]) count[e.kategori] = 0;
      count[e.kategori] += e.jumlah;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Laporan Pengeluaran</Typography>
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
            <TableCell align="right">Jumlah Transaksi</TableCell>
            <TableCell align="right">Total Pengeluaran</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(reportType === 'harian' ? Object.entries(daily) : reportType === 'bulanan' ? Object.entries(monthly) : Object.entries(yearly))
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([key, d]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell align="right">{d.count}</TableCell>
                <TableCell align="right">Rp{d.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Typography variant="subtitle1">Kategori Pengeluaran Terbesar</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {bestCategories.length === 0 && <Typography color="text.secondary">Belum ada data pengeluaran.</Typography>}
        {bestCategories.slice(0, 5).map(([cat, total]) => (
          <Chip key={cat} label={`${cat} (Rp${total.toLocaleString()})`} color="secondary" />
        ))}
      </Box>
    </Paper>
  );
}

export default ExpenseReport;
