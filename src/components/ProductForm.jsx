import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem } from '@mui/material';

const kategoriList = [
  { value: 'bubur', label: 'Bubur' },
  { value: 'nasitim', label: 'Nasi Tim' },
  { value: 'prohe', label: 'Prohe' },
  { value: 'snack', label: 'Snack' },
  { value: 'lauk', label: 'Lauk' }
];

function ProductForm({ onAddProduct, onUpdateProduct, editProduct, onCancelEdit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [kategori, setKategori] = useState('makanan');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setPrice(editProduct.price);
      setStock(editProduct.stock);
      setKategori(editProduct.kategori || 'makanan');
    } else {
      setName('');
      setPrice('');
      setStock('');
      setKategori('makanan');
    }
  }, [editProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !stock || !kategori) {
      setError('Semua kolom wajib diisi!');
      return;
    }
    if (isNaN(price) || isNaN(stock)) {
      setError('Harga dan stok harus berupa angka!');
      return;
    }
    setError('');
    const productData = {
      id: editProduct ? editProduct.id : Date.now(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      kategori
    };
    if (editProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    setName('');
    setPrice('');
    setStock('');
    setKategori('makanan');
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>{editProduct ? 'Edit Produk' : 'Tambah Produk'}</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nama Produk"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Harga"
          value={price}
          onChange={e => setPrice(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stok"
          value={stock}
          onChange={e => setStock(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Kategori"
          value={kategori}
          onChange={e => setKategori(e.target.value)}
          fullWidth
          margin="normal"
        >
          {kategoriList.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            {editProduct ? 'Update Produk' : 'Simpan Produk'}
          </Button>
          {editProduct && (
            <Button variant="outlined" color="secondary" onClick={onCancelEdit}>
              Batal
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default ProductForm;
