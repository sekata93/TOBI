import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navigation({ page, onChange, onLogout, isLoggedIn }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuItems = [
    { label: 'Transaksi Penjualan', value: 'transaksi' },
    { label: 'Input Menu', value: 'produk' },
    { label: 'Laporan Penjualan', value: 'laporan' },
    { label: 'Laporan Pengeluaran', value: 'pengeluaran' },
    { label: 'Produk Terlaris', value: 'terlaris' },
    ...(isLoggedIn ? [{ label: 'Antrian Pesanan', value: 'antrian' }] : [])
  ];

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-start' }, position: 'relative', px: { xs: 1, sm: 2 } }}>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Kasir TOBI
          </Typography>
          {/* Tombol menu untuk HP */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
          {isLoggedIn && (
            <Button color="inherit" onClick={onLogout} sx={{ ml: 2, display: { xs: 'none', sm: 'inline-flex' } }}>
              Logout
            </Button>
          )}
        </Box>
        {/* Tabs untuk desktop/tablet */}
        <Box sx={{ width: '100%', display: { xs: 'none', sm: 'block' } }}>
          <Tabs value={page} onChange={(e, v) => onChange(v)} textColor="inherit" indicatorColor="secondary">
            {menuItems.map(item => (
              <Tab key={item.value} label={item.label} value={item.value} />
            ))}
          </Tabs>
        </Box>
        {/* Drawer untuk HP */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Box sx={{ width: 220, mt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
              {menuItems.map(item => (
                <ListItem key={item.value} disablePadding>
                  <ListItemButton selected={page === item.value} onClick={() => onChange(item.value)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              {isLoggedIn && (
                <ListItem disablePadding>
                  <ListItemButton onClick={onLogout}>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
