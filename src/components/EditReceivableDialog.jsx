import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

export default function EditReceivableDialog({ open, onClose, trx, onSave, products }) {
  const [nama, setNama] = useState(trx?.nama || '');
  const [wa, setWa] = useState(trx?.wa || '');
  const [items, setItems] = useState(Array.isArray(trx?.items) ? trx.items.map(i => ({ ...i })) : []);

  // Update qty item
  const handleQtyChange = (idx, val) => {
    setItems(items.map((item, i) => i === idx ? { ...item, qty: Number(val) } : item));
  };

  // Update produk item
  const handleProductChange = (idx, prodId) => {
    const prod = products.find(p => p.id === prodId);
    setItems(items.map((item, i) => i === idx ? { ...item, name: prod.name, price: prod.price, id: prod.id } : item));
  };

  // Tambah item
  const handleAddItem = () => {
    if (products.length === 0) return;
    const prod = products[0];
    setItems([...items, { id: prod.id, name: prod.name, price: prod.price, qty: 1 }]);
  };

  // Hapus item
  const handleRemoveItem = idx => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    onSave({ ...trx, nama, wa, items });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Pesanan</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Nama" value={nama} onChange={e => setNama(e.target.value)} fullWidth required />
          <TextField label="No. WA" value={wa} onChange={e => setWa(e.target.value)} fullWidth />
        </Box>
        {items.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <TextField
              select
              label="Menu"
              value={item.id}
              onChange={e => handleProductChange(idx, e.target.value)}
              sx={{ minWidth: 120 }}
              SelectProps={{ native: false }}
            >
              {products.map(prod => (
                <option key={prod.id} value={prod.id}>{prod.name} - Rp{prod.price.toLocaleString()}</option>
              ))}
            </TextField>
            <TextField
              label="Qty"
              type="number"
              value={item.qty}
              onChange={e => handleQtyChange(idx, e.target.value)}
              sx={{ width: 60 }}
              inputProps={{ min: 1 }}
            />
            <Button color="error" onClick={() => handleRemoveItem(idx)}>Hapus</Button>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddItem} sx={{ mt: 1 }}>Tambah Menu</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
