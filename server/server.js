const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'switchvlansystem_vlan',
});

app.post('/create', (req, res) => {
  const VlanName = req.body.VlanName;
  const VlanFarbe = req.body.VlanFarbe;

  db.query(
    'INSERT INTO vlan (VlanName, VlanFarbe) VALUES (?, ?)',
    [VlanName, VlanFarbe],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Values Inserted');
      }
    }
  );
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM vlan WHERE VlanID = ?', id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/VlanData', (req, res) => {
  db.query('SELECT * FROM vlan ', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/PortData', (req, res) => {
  db.query('SELECT * FROM port ', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put('/update', (req, res) => {
  const id = req.body.id;
  const Vid = req.body.Vid;

  db.query(
    'UPDATE port SET VlanID  = ? WHERE PortID = ?',
    [Vid, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(3001, () => {
  console.log('Server running on 3001 kid');
});
