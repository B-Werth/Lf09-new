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
  const Port = req.body.Port;
  db.query(
    'INSERT INTO ports (PortNummer) VALUES (?)',
    [Port],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Values Inserted');
      }
    }
  );
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

app.listen(3001, () => {
  console.log('Server running on 3001 kid');
});
