import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
import travelers from './travelers'

const center = { lat: 40.7309, lng: -73.9973 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [selectedTraveler, setSelectedTraveler] = useState('');
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  const handleTravelerChange = (name) => {
    setSelectedTraveler(name);
  };

  if (!isLoaded) {
    return <SkeletonText />
  }

  const calculateTravelTime = (distance) => {
    if (selectedTraveler) {
      const traveler = travelers.find((t) => t.name === selectedTraveler);
      if (traveler) {
        const topSpeed = traveler.topSpeed;
        const travelTime = (distance / topSpeed).toFixed(2);
        return travelTime
      }
    }
  };

  function formatTravelTime(seconds) {
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    const hoursDisplay = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    const minutesDisplay = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
    const secondsDisplay = seconds > 0 ? `${seconds} second${seconds !== 1 ? 's' : ''}` : '';
  
    const timeParts = [hoursDisplay, minutesDisplay].filter(part => part !== '');
    return timeParts.length > 0 ? timeParts.join(', ') : secondsDisplay;
  }
  

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(
      formatTravelTime(
        calculateTravelTime(results.routes[0].legs[0].distance.value)
        )
    )
  }

  /*
  TODO:
    How is distance as im passing it into my calculate travel time function represented? (Should be miles)
    Add a text box that gives info on each animal ("The Cheetah can run at speeds of up to x mph")
  */

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <Menu>
            <MenuButton as={Button} >
              {selectedTraveler ? `Selected: ${selectedTraveler}` : 'Select a Traveler'}
            </MenuButton>
            <MenuList>
              {travelers.map((traveler) => (
                <MenuItem key={traveler.name} onClick={() => handleTravelerChange(traveler.name)}
                >{traveler.name}</MenuItem>
              ))}
            </MenuList>
          </Menu>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>{ duration ? `Duration: ${duration}`: 'Select a Traveler to see travel time' } </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
