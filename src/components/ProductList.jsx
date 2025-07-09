import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography color="text.secondary" align="center">Belum ada produk yang ditambahkan.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Daftar Produk</Typography>
      <List>
        {products.map((product) => (
          <ListItem key={product.id} divider
            secondaryAction={
              <Box>
                <IconButton edge="end" color="primary" onClick={() => onEdit(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" color="error" onClick={() => onDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {product.name}
                <Chip size="small" label={product.kategori.charAt(0).toUpperCase() + product.kategori.slice(1)} color="info" />
              </Box>}
              secondary={`Harga: Rp${product.price.toLocaleString()} | Stok: ${product.stock}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ProductList;
