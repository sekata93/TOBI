import React, { useState } from 'react';
import { Paper, Typography, Box, Button, TextField, MenuItem } from '@mui/material';

const kategoriList = [
  { value: 'prohe', label: 'Prohe' },
  { value: 'bahan', label: 'Bahan' },
  { value: 'packing', label: 'Packing' },
  { value: 'transport', label: 'Transport' },
  { value: 'karyawan', label: 'Karyawan' },
  { value: 'lainnya', label: 'Lainnya' }
];

function ExpenseForm({ onAddExpense }) {
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [keterangan, setKeterangan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [kategori, setKategori] = useState('bahan');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tanggal || !keterangan || !jumlah || !kategori) {
      setError('Semua kolom wajib diisi!');
      return;
    }
    if (isNaN(jumlah) || jumlah <= 0) {
      setError('Jumlah pengeluaran harus angka positif!');
      return;
    }
    setError('');
    onAddExpense({
      id: Date.now(),
      tanggal,
      keterangan,
      jumlah: parseFloat(jumlah),
      kategori
    });
    setKeterangan('');
    setJumlah('');
    setKategori('bahan');
    setTanggal(new Date().toISOString().slice(0, 10));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Catat Pengeluaran</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Tanggal"
          type="date"
          value={tanggal}
          onChange={e => setTanggal(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Keterangan"
          value={keterangan}
          onChange={e => setKeterangan(e.target.value)}
        />
        <TextField
          label="Jumlah"
          value={jumlah}
          onChange={e => setJumlah(e.target.value)}
          type="number"
        />
        <TextField
          select
          label="Kategori"
          value={kategori}
          onChange={e => setKategori(e.target.value)}
        >
          {kategoriList.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" type="submit">
          Simpan Pengeluaran
        </Button>
      </Box>
    </Paper>
  );
}

export default ExpenseForm;
