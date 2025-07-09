import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Select, InputLabel, FormControl
} from '@mui/material';
import ReceiptDialog from './ReceiptDialog';

function TransactionForm({ products, onAddTransaction }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState(1);
  const [paymentType, setPaymentType] = useState('tunai');
  const [paid, setPaid] = useState('');
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [error, setError] = useState('');

  const handleAddToCart = () => {
    if (!selectedId || qty < 1) return;
    const product = products.find(p => p.id === Number(selectedId));
    if (!product) return;
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item));
    } else {
      setCart([...cart, { ...product, qty }]);
    }
    setSelectedId('');
    setQty(1);
  };

  const handleRemoveCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const kembalian = paid ? paid - total : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama pelanggan harus diisi!');
      return;
    }
    if (cart.length === 0) {
      setError('Keranjang kosong!');
      return;
    }
    if (paid === '' || paid === null || isNaN(paid)) {
      setError('Nominal pembayaran harus diisi (boleh 0)!');
      return;
    }
    setError('');
    const trx = {
      items: cart,
      total,
      paid,
      kembalian,
      paymentType,
      nama,
      wa,
      date: new Date().toISOString()
    };
    onAddTransaction(trx);
    setLastTransaction(trx);
    setShowReceipt(true);
    setCart([]);
    setPaid('');
    setNama('');
    setWa('');
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Transaksi Penjualan</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Nama Pelanggan"
            value={nama}
            onChange={e => setNama(e.target.value)}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            label="Nomor WA (opsional)"
            value={wa}
            onChange={e => setWa(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Pilih Menu</InputLabel>
          <Select
            value={selectedId}
            label="Pilih Menu"
            onChange={e => setSelectedId(e.target.value)}
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name} - Rp{p.price.toLocaleString()}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Jumlah"
          type="number"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          sx={{ width: 90 }}
        />
        <Button variant="contained" onClick={handleAddToCart} disabled={!selectedId}>
          Tambah
        </Button>
      </Box>
      <Table size="small" sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Menu</TableCell>
            <TableCell align="right">Harga</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">Rp{item.price.toLocaleString()}</TableCell>
              <TableCell align="right">{item.qty}</TableCell>
              <TableCell align="right">Rp{(item.price * item.qty).toLocaleString()}</TableCell>
              <TableCell align="right">
                <Button color="error" size="small" onClick={() => handleRemoveCart(item.id)}>Hapus</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Total:</Typography>
        <Typography variant="h6">Rp{total.toLocaleString()}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Jenis Pembayaran</InputLabel>
          <Select
            value={paymentType}
            label="Jenis Pembayaran"
            onChange={e => setPaymentType(e.target.value)}
          >
            <MenuItem value="tunai">Tunai</MenuItem>
            <MenuItem value="non-tunai">Non-Tunai</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Bayar"
          type="number"
          value={paid}
          onChange={e => setPaid(Number(e.target.value))}
        />
        <TextField
          label="Kembalian"
          type="number"
          value={kembalian > 0 ? kembalian : 0}
          InputProps={{ readOnly: true }}
        />
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Simpan Transaksi
      </Button>
    </Paper>
    <ReceiptDialog open={showReceipt} onClose={() => setShowReceipt(false)} transaction={lastTransaction} />
    </>
  );
}

export default TransactionForm;
