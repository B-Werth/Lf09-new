import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { HexColorPicker } from 'react-colorful';
import { GiCancel } from 'react-icons/gi';

import {
  IconButton,
  Box,
  chakra,
  Grid,
  Text,
  Divider,
  Table,
  Thead,
  Input,
  Tbody,
  Button,
  FormControl,
  Flex,
  FormLabel,
  Tr,
  Th,
  Td,
  FormHelperText,
  FormErrorMessage,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';

const Ports = chakra(motion.div, {
  shouldForwardProp: isValidMotionProp,
});

var VlanTabelle = {};

var VlanLengths = 0;

var PortAnzahl = 24;

var Vlan_IDs = [];
var Vlan_names = [];
var Vlan_Farben = [];

var PortVlanIDs = [];

var PortFarben = [];

function Portgrid() {
  const [Vlan_FarbeListe, setVlan_FarbeListe] = useState([]);

  const [PortVlanID, setPortVlanID] = useState(0);

  const [VlanListensize, setVlanlistensize] = useState(0);

  const [Vlan_ID, setVlan_ID] = useState(2);
  const [Vlan_name, setVlan_name] = useState('name');

  const [Port_Farbe, setPort_Farbe] = useState([]);

  useEffect(() => {
    Axios.get('/VlanData')
      .then(function (response) {
        VlanTabelle = response.data;
        console.log(VlanTabelle);
        VlanLengths = response.data.length;
        setVlanlistensize(response.data.length);
        for (let i = 0; i < response.data.length; i++) {
          Vlan_IDs.push('VlanID' + response.data[i].VlanID);
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

        //Farben();
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  let PortArray = new Array(PortAnzahl);

  let VlanArray = new Array(VlanListensize);

  const addVlan = () => {
    Axios.post('/create', { VlanName: VlanName_input, VlanFarbe: color })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {});

    onClose();
    window.location.reload();
  };

  const deleteVlan = id => {
    Axios.delete(`/delete/${id}`);
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  const [VlanName_input, setVlanName_input] = useState('');

  const isError = VlanName_input === '';

  const [color, setColor] = useState('#aabbcc');

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
                  <Td w={20} bg={Vlan_FarbeListe[i]}></Td>

                  <IconButton
                    onClick={() => {
                      deleteVlan(Vlan_ID[i]);
                      window.location.reload();
                    }}
                    variant="outline"
                    colorScheme="teal"
                    icon={<GiCancel />}
                  />
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>{' '}
      </div>
      <div>
        <Button
          ref={finalRef}
          onClick={onOpen}
          colorScheme="teal"
          size="lg"
          mt="10"
        >
          Vlan Hinzufügen
        </Button>

        <div>
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Neues Vlan</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl isInvalid={isError}>
                  <FormLabel>Vlan Name</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Vlan Name"
                    value={VlanName_input}
                    onChange={event => {
                      setVlanName_input(event.target.value);
                    }}
                  />

                  {!isError ? (
                    <FormHelperText>Geben sie einen Namen ein </FormHelperText>
                  ) : (
                    <FormErrorMessage>
                      Vlan Name wird benötigt.
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <Flex mt={4}>
                    <FormLabel mt={2}>Port Farbe :</FormLabel>
                    <Box ml={5} bg={color} h={'40px'} w={'40px'}></Box>
                  </Flex>
                  <br />
                  <div mb={40}>
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={addVlan}
                  isDisabled={!VlanName_input}
                >
                  Speichern
                </Button>

                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>

      <br />
      <br />
      <Divider orientation="horizontal" />
      <br />
      <br />
      <Grid templateColumns="repeat(12, 2fr)" gap={10}>
        {PortArray.fill().map((v, i) => (
          <div className="PortsRender" key={i} color="black">
            <Text fontSize={16}> PortNr {i + 1}</Text>
            <Text fontSize={16}> Vlan {PortVlanID[i]}</Text>

            <Ports
              boxShadow={'dark-lg'}
              id={i}
              whileHover={{ scale: 1.1 }}
              padding="2"
              bg={VlanTabelle}
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100px"
              height="100px"
              whileTap={{
                scale: 0.8,
              }}
            ></Ports>
          </div>
        ))}
      </Grid>
    </div>
  );
}

export default Portgrid;
