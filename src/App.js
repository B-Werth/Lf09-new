import React from 'react';
import Axios from 'axios';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import Portgrid from './switchports';

Axios.defaults.baseURL = 'http://localhost:3001';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Portgrid />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
