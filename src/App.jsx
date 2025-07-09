import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import { useProducts, addProduct, updateProduct, deleteProduct } from './hooks';
import TransactionForm from './components/TransactionForm';
import Navigation from './Navigation';
import SalesReport from './components/SalesReport';
import ExpenseForm from './components/ExpenseForm';
import ExpenseReport from './components/ExpenseReport';
import ReceivableQueue from './components/ReceivableQueue';
import BestSellerList from './components/BestSellerList';
import LoginForm from './components/LoginForm';
import CustomerOrderForm from './components/CustomerOrderForm';
import CustomerOrderDialog from './components/CustomerOrderDialog';
import OrderQueue from './components/OrderQueue';

function App() {
  const products = useProducts();
  const [editProduct, setEditProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [queue, setQueue] = useState([]); // antrian/piutang
  const [page, setPage] = useState('transaksi'); // transaksi = home
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [orderQueue, setOrderQueue] = useState(() => {
    const saved = localStorage.getItem('orderQueue');
    return saved ? JSON.parse(saved) : [];
  });

  // Load transaksi, pengeluaran, dan antrian dari LocalStorage saat aplikasi pertama kali dijalankan
  useEffect(() => {
    const savedTrx = localStorage.getItem('transactions');
    if (savedTrx) {
      setTransactions(JSON.parse(savedTrx));
    }
    const savedExp = localStorage.getItem('expenses');
    if (savedExp) {
      setExpenses(JSON.parse(savedExp));
    }
    const savedQueue = localStorage.getItem('queue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
    const savedOrderQueue = localStorage.getItem('orderQueue');
    if (savedOrderQueue) {
      setOrderQueue(JSON.parse(savedOrderQueue));
    }
  }, []);


  // Simpan transaksi ke LocalStorage setiap ada perubahan transaksi
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Simpan pengeluaran ke LocalStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Simpan queue ke LocalStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('queue', JSON.stringify(queue));
  }, [queue]);

  // Simpan orderQueue ke LocalStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('orderQueue', JSON.stringify(orderQueue));
  }, [orderQueue]);

  const handleAddProduct = async (product) => {
    await addProduct(product);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = async (product) => {
    await updateProduct(product);
    setEditProduct(null);
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      await deleteProduct(id);
      if (editProduct && editProduct.id === id) setEditProduct(null);
    }
  };

  const handleAddTransaction = (trx) => {
    // Jika belum bayar lunas, masuk ke antrian/piutang
    if (!trx.paid || trx.paid < trx.total) {
      setQueue([ { ...trx, id: trx.id || Date.now() }, ...queue ]);
    } else {
      setTransactions([trx, ...transactions]);
      alert('Transaksi berhasil disimpan!');
    }
  };

  // Proses pelunasan piutang
  const handleSettleReceivable = (trx) => {
    setQueue(queue.filter(q => q !== trx));
    setTransactions([trx, ...transactions]);
  };

  // Edit piutang/antrian
  const handleEditReceivable = (updated, idx) => {
    setQueue(queue => queue.map((q, i) => i === idx ? { ...updated, total: Array.isArray(updated.items) ? updated.items.reduce((sum, i) => sum + i.price * i.qty, 0) : 0 } : q));
  };


  // Konfirmasi pesanan pelanggan (oleh owner)
  const handleConfirmOrder = (order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    setOrderQueue(orderQueue.filter(q => q.id !== order.id));
    setQueue([
      {
        ...order,
        items,
        nama: order.nama || '-',
        wa: order.wa || '-',
        paid: 0,
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
        kembalian: 0,
        paymentType: 'Tunai',
        date: order.date
      },
      ...queue
    ]);
    setPage('transaksi'); // Pindah ke menu transaksi setelah konfirmasi
  };

  const handleAddExpense = (exp) => {
    setExpenses([exp, ...expenses]);
    alert('Pengeluaran berhasil disimpan!');
  };

  // Fungsi Logout
  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  }

  // MODE PELANGGAN
  const [showLogin, setShowLogin] = useState(false);

  if (!isLoggedIn) {
    console.log('Rendering customer view (not logged in)');
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <img src="/tobi-loo.png" alt="TOBI Logo" style={{ width: 120, marginBottom: 16 }} />
        </Box>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'primary.main', fontFamily: 'serif' }}>
          Selamat Datang
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
          Silahkan Pilih Menu TOBI disini Untuk Memesan
        </Typography>
        <CustomerOrderForm
          products={products}
          onSaveOrder={orderData => {
            const order = {
              id: Date.now(),
              ...orderData,
              date: new Date().toISOString(),
            };
            setOrderQueue([order, ...orderQueue]);
          }}
        />

        <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
          <button style={{padding:'8px 16px', fontWeight:'bold', borderRadius:8, border:'1px solid #1976d2', background:'#fff', color:'#1976d2', cursor:'pointer'}} onClick={()=>setShowLogin(true)}>Login</button>
        </Box>
        {showLogin && <LoginForm onLogin={() => {
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          setShowLogin(false);
        }} onClose={() => setShowLogin(false)} />}
      </Box>
    );
  }

  return (
    <Box>
      <Navigation
        page={page}
        onChange={setPage}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {page === 'transaksi' && (
          <>
            <TransactionForm
              products={products}
              onAddTransaction={handleAddTransaction}
            />
            {isLoggedIn && (
              <ReceivableQueue
                queue={queue}
                onSettle={handleSettleReceivable}
                onEdit={handleEditReceivable}
                products={products}
              />
            )}
          </>
        )}
        {page === 'produk' && (
          <>
            <ProductForm
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              editProduct={editProduct}
              onCancelEdit={handleCancelEdit}
            />
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </>
        )}
        {page === 'laporan' && (
          <SalesReport transactions={transactions} />
        )}
        {page === 'pengeluaran' && (
          <>
            <ExpenseForm onAddExpense={handleAddExpense} />
            <ExpenseReport expenses={expenses} />
          </>
        )}
         {page === 'terlaris' && (
          <BestSellerList transactions={transactions} />
        )}
        {page === 'antrian' && isLoggedIn && (
          <OrderQueue queue={orderQueue} isOwner={true} onConfirm={handleConfirmOrder} />
        )}
      </Container>
    </Box>
  );
}

export default App;
