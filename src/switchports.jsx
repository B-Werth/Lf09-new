import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { HexColorPicker } from 'react-colorful';
import { GiCancel } from 'react-icons/gi';

import {
  Checkbox,
  Select,
  Tag,
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
import axios from 'axios';

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

  const [newVid, setNewVid] = useState(0);

  var PortClick = 0;

  var VlanClick = 0;
  useEffect(() => {
    Axios.get('/VlanData')
      .then(function (response) {
        VlanTabelle = response.data;

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
        PortFarbenSetter();
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  let PortArray = new Array(PortAnzahl);

  let SelectArray = new Array(VlanListensize);

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

  const updateVlan = PortEinstellungen => {
    axios
      .put('/update', { Vid: newVid, id: PortEinstellungen })
      .then(response => {});
  };

  let PortFarbenSetter = () => {
    const obj = {};
    Vlan_IDs.forEach((element, index) => {
      obj[element] = Vlan_Farben[index];
    });
    setPortColor(obj);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: PortisOpen,
    onOpen: PortonOpen,
    onClose: PortonClose,
  } = useDisclosure();

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  const [VlanName_input, setVlanName_input] = useState('');

  const isError = VlanName_input === '';

  const [color, setColor] = useState('#aabbcc');

  const [PortColor, setPortColor] = useState({});

  const [PortEinstellungen, SetPortEinstellungen] = useState(0);
  const [VlanEinstellungen, SetVlanEinstellungen] = useState(0);

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
          <div
            className="PortsRender"
            key={i}
            color="black"
            onClick={() => {
              PortonOpen();
              PortClick = i + 1;
              SetPortEinstellungen(PortClick);
              VlanClick = PortVlanID[i];
              SetVlanEinstellungen(VlanClick);
            }}
          >
            <Text fontSize={16}> </Text>

            <div>
              <Tag>PortNr {i + 1}</Tag>
            </div>
            <Tag>Vlan {PortVlanID[i]}</Tag>

            <Ports
              boxShadow={'dark-lg'}
              id={i}
              whileHover={{ scale: 1.1 }}
              padding="2"
              bg={PortColor[PortVlanID[i]]}
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
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={PortisOpen}
          onClose={PortonClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Port Einstellungen: <Tag> Port {PortEinstellungen} </Tag>
              <Tag ml={2}> Vlan {VlanEinstellungen} </Tag>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Vlan</FormLabel>
                <Select
                  onChange={event => {
                    setNewVid(event.target.value);
                  }}
                  placeholder={VlanEinstellungen}
                >
                  {SelectArray.fill().map((x, y) => (
                    <option>{Vlan_IDs[y]}</option>
                  ))}
                  <option value={0}>Kein Vlan</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Tagged</FormLabel>
                <Checkbox>Tagged</Checkbox>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  updateVlan(PortEinstellungen);
                  window.location.reload();
                }}
              >
                Speichern
              </Button>
              <Button onClick={PortonClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Grid>
    </div>
  );
}

export default Portgrid;
