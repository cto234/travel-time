import React from 'react';
import { Box, Button, Text, Center } from '@chakra-ui/react';

function WelcomeScreen({ onClose }) {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      background="rgba(0, 0, 0, 0.5)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="999"
    >
      <Box
        background="white"
        padding="16px"
        borderRadius="8px"
        boxShadow="lg"
        textAlign="center"
        maxWidth="50%"
      >
        <Text fontSize="4xl" fontWeight="bold">
          Travel Time
        </Text>
        <Text mt="2">Ever wondered how fast a cheetah could run across Manhattan at full speed? Or how long it would take a snail to crawl from Paris to Berlin? Well, maybe you haven't, but now you can find the answers to these questions along with many more. Travel time is a fun tool to explore how long it would take different animals, vehicles, and objects to travel between any two locations.</Text>
        <Text mt="2" fontSize="10px">(Note: these travel times are calculated using the average top speed of a given traveler and are not meant to give an accurate estimate of their travel time in real life, but simply to visualize these speeds on a map.)</Text>
        <Center mt="4">
          <Button colorScheme="blue" onClick={onClose}>
            Get Started
          </Button>
        </Center>
      </Box>
    </Box>
  );
}

export default WelcomeScreen;
