// Firebase hooks for Kasir TOBI
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue, push, set, remove, update } from 'firebase/database';

// Hook untuk listen & update produk realtime
export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Ubah objek ke array
        setProducts(Object.entries(val).map(([id, data]) => ({ ...data, id })));
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);
  return products;
}

// Tambah produk baru ke Firebase
export function addProduct(product) {
  const productsRef = ref(db, 'products');
  const newRef = push(productsRef);
  return set(newRef, product);
}

// Update produk di Firebase
export function updateProduct(product) {
  if (!product.id) return;
  const prodRef = ref(db, `products/${product.id}`);
  return update(prodRef, product);
}

// Hapus produk di Firebase
export function deleteProduct(id) {
  const prodRef = ref(db, `products/${id}`);
  return remove(prodRef);
}
