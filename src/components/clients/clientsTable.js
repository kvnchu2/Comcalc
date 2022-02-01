import * as React from 'react';
import { Modal } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ClientsTable(props) {
  
  const allClients = props.clients.map((client) => {
    return (
      <TableRow
          key={client.name}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">{client.name}</TableCell>
          <TableCell align="right">{client.address}</TableCell>
          <TableCell align="right">{client.provider}</TableCell>
          <TableCell align="right"><button >Edit</button></TableCell>
          <TableCell align="right"><button onClick={() => props.onDeleteHandler(client)}>Delete</button></TableCell>
      </TableRow>
    )
  })


        

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Client</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Provider</TableCell>
            <TableCell align="right">Edit</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allClients}

        </TableBody>
      </Table>
    </TableContainer>
  );
}