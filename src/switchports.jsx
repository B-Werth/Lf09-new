import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import {
  chakra,
  Grid,
  Text,
  Input,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  background,
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';

const Ports = chakra(motion.div, {
  shouldForwardProp: isValidMotionProp,
});

var VlanLengths = 0;

var PortAnzahl = 24;

var Vlan_IDs = [];
var Vlan_names = [];
var Vlan_Farben = [];

var PortVlanIDs = [];

var PortFarben = [];

function Portgrid() {
  const [Vlan_FarbeListe, setVlan_FarbeListe] = useState([]);

  const [Port, setPort] = useState(1);

  const [PortVlanID, setPortVlanID] = useState(0);

  const [VlanListensize, setVlanlistensize] = useState(0);

  const [Vlan_ID, setVlan_ID] = useState(2);
  const [Vlan_name, setVlan_name] = useState('name');

  const [Port_Farbe, setPort_Farbe] = useState([]);

  useEffect(() => {
    Axios.get('/VlanData')
      .then(function (response) {
        VlanLengths = response.data.length;
        setVlanlistensize(response.data.length);
        for (let i = 0; i < response.data.length; i++) {
          Vlan_IDs.push(response.data[i].VlanID);
          Vlan_names.push(response.data[i].VlanName);
          Vlan_Farben.push(response.data[i].VlanFarbe);
        }
        setVlan_ID(Vlan_IDs);
        setVlan_name(Vlan_names);
        setVlan_FarbeListe(Vlan_Farben);
      })

      .catch(function (error) {
        console.log(error);
      });

    Axios.get('/PortData')
      .then(function (response) {
        for (let i = 0; i < response.data.length; i++) {
          PortVlanIDs.push(response.data[i].VlanID);
          PortFarben.push(response.data[i].VlanID);
        }

        setPortVlanID(PortVlanIDs);
        console.log('yes');
        Farben();
      })
      .catch(function (error) {
        console.log('esd');
      });
  }, []);

  let PortArray = new Array(PortAnzahl);

  let VlanArray = new Array(VlanListensize);

  const addPort = () => {
    console.log(Port);
    Axios.post('/create', {
      Port: Port,
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log('eror');
      });
  };

  let Farben = () => {
    for (let j = 0; j < VlanLengths; j++) {
      for (let k = 0; k < 24; k++) {
        if (PortFarben[k] === j + 1) {
          PortFarben.splice(k, 1, Vlan_Farben[j]);
        }
      }
    }
    console.log(PortFarben);
    setPort_Farbe(PortFarben);
  };

  return (
    <div>
      <div>
        <h2>Switch</h2>

        <TableContainer>
          <Table size="md">
            <Thead>
              <Tr>
                <Th>Vlan_ID</Th>
                <Th>Name</Th>
                <Th>Farbe</Th>
              </Tr>
            </Thead>
            <Tbody>
              {VlanArray.fill().map((v, i) => (
                <Tr key={i}>
                  <Td>{Vlan_ID[i]}</Td>
                  <Td>{Vlan_name[i]}</Td>
                  <Td bg={Vlan_FarbeListe[i]}></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
      <div className="information"></div>
      <Grid templateColumns="repeat(12, 2fr)" gap={10}>
        {PortArray.fill().map((v, i) => (
          <div className="PortsRender" key={i} onLoad={Farben}>
            <Text fontSize={16}> PortNr {i}</Text>
            <Text fontSize={16}> Vlan {PortVlanID[i]}</Text>
            <Ports
              id={i}
              whileHover={{ scale: 1.1 }}
              padding="2"
              bg={Port_Farbe[i]}
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100px"
              height="100px"
              whileTap={{
                scale: 0.8,
                rotate: -90,
              }}
            ></Ports>
          </div>
        ))}
      </Grid>
    </div>
  );
}

export default Portgrid;
