import React, { useState } from 'react';
import { Paper, Typography, Box, Button, TextField, MenuItem, Dialog } from '@mui/material';
import CustomerOrderDialog from './CustomerOrderDialog';

function CustomerOrderForm({ products, onSaveOrder }) {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState('');
  const [qty, setQty] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [order, setOrder] = useState(null);
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!selected || qty < 1) return;
    const prod = products.find(p => p.id === selected);
    if (!prod) return;
    setCart(prev => {
      const exist = prev.find(item => item.id === selected);
      if (exist) {
        return prev.map(item => item.id === selected ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...prod, qty }];
    });
    setSelected('');
    setQty(1);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!nama.trim() || !wa.trim()) {
      setError('Nama dan nomor WA harus diisi!');
      return;
    }
    if (cart.length === 0) {
      setError('Pesanan belum diisi!');
      return;
    }
    setError('');
    setOrder({ items: cart, nama, wa });
    setShowDialog(true);
  };

  const handleEdit = () => {
    setShowDialog(false);
  };

  const handleSave = () => {
    if (onSaveOrder) onSaveOrder(order);
    setCart([]);
    setShowDialog(false);
    setNama('');
    setWa('');
  };

  const handleCancel = () => {
    setCart([]);
    setShowDialog(false);
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, mb: 2, maxWidth: 500, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>Pilih Menu Pesanan</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nama Pemesan"
            value={nama}
            onChange={e => setNama(e.target.value)}
            required
          />
          <TextField
            label="Nomor WA"
            value={wa}
            onChange={e => setWa(e.target.value)}
            required
          />
          <Box
  sx={{
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' }
  }}
>
  <TextField
    select
    label="Menu"
    value={selected}
    onChange={e => setSelected(e.target.value)}
    sx={{ flex: 2 }}
    fullWidth
  >
    {products.map(prod => (
      <MenuItem key={prod.id} value={prod.id}>{prod.name} - Rp{prod.price.toLocaleString()}</MenuItem>
    ))}
  </TextField>
  <TextField
    label="Qty"
    type="number"
    value={qty}
    onChange={e => setQty(Math.max(1, Number(e.target.value)))}
    sx={{ width: { xs: '100%', sm: 80 } }}
    fullWidth
  />
  <Button onClick={handleAdd} variant="contained" fullWidth sx={{ minWidth: { sm: 100 } }}>
    Tambah
  </Button>
</Box>
          <Box>
            <Typography variant="subtitle1">Keranjang:</Typography>
            {cart.length === 0 && <Typography color="text.secondary">Belum ada pesanan.</Typography>}
            {cart.map(item => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <span>{item.name} x {item.qty}</span>
                <span>Rp{(item.price * item.qty).toLocaleString()}</span>
              </Box>
            ))}
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary">Simpan Pesanan</Button>
        </Box>
      </Paper>
      <CustomerOrderDialog
        open={showDialog}
        order={order}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
}

export default CustomerOrderForm;
