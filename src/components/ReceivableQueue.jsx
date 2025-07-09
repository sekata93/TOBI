import React, { useState } from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditReceivableDialog from './EditReceivableDialog';

function ReceivableQueue({ queue, onSettle, onEdit, products }) {
  const [editIdx, setEditIdx] = useState(null);
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Antrian/Piutang Belum Lunas</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tanggal</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Menu</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queue.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" style={{ color: '#888' }}>
                Tidak ada antrian/piutang
              </TableCell>
            </TableRow>
          )}
          {queue.map((trx, idx) => (
            <React.Fragment key={trx.id || idx}>
              <TableRow>
                <TableCell>{new Date(trx.date).toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  {trx.nama || '-'}
                  {trx.wa && trx.wa !== '-' && trx.wa.trim() !== '' && (
                    <a
                      href={`https://wa.me/${trx.wa.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 8, textDecoration: 'none', color: '#25D366', verticalAlign: 'middle' }}
                      title="Hubungi via WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.151-.174.2-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.892-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.897 6.991c-.003 5.455-4.437 9.889-9.892 9.889m8.413-18.304A11.815 11.815 0 0 0 12.05.001C5.495 0 .002 5.492 0 12.247c0 2.158.566 4.263 1.641 6.116L.057 23.925a1 1 0 0 0 1.225 1.225l5.559-1.584a11.93 11.93 0 0 0 5.207 1.242h.005c6.553 0 11.847-5.491 11.85-12.244a11.821 11.821 0 0 0-3.477-8.617"/>
                      </svg>
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {Array.isArray(trx.items)
                    ? trx.items.map(item => `${item.name} (${item.qty})`).join(', ')
                    : '-'}
                </TableCell>
                <TableCell align="right">Rp{trx.total.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary" size="small" onClick={() => setEditIdx(idx)} style={{marginRight:4}}>
                    Edit
                  </Button>
                  <Button variant="contained" color="success" size="small" onClick={() => onSettle(trx)}>
                    Lunas
                  </Button>
                </TableCell>
              </TableRow>
              {editIdx === idx && (
                <EditReceivableDialog
                  open={true}
                  onClose={() => setEditIdx(null)}
                  trx={trx}
                  onSave={updated => {
                    setEditIdx(null);
                    onEdit && onEdit(updated, idx);
                  }}
                  products={products}
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default ReceivableQueue;
