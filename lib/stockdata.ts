const stockData = [
  {
    id: 'htm-905',
    title: 'HTM 905 Truck',
    description:
      'The new truck mixer generation 05 was developed with regard for higher cost-effectiveness, improved ergonomics, and ease of cleaning. Thanks to the new platform solution, a wide variety of accessories can now be custom added on.',
    imageUrl: '/images/bg/allBg.jpg',
    badge: {
      text: 'SALE',
      color: 'yellow',
      position: 'left',
    },
    specifications: [
      { label: 'Assembly Weight', value: '3,780 kg' },
      { label: 'Gross power', value: '185 kW' },
      { label: 'Max speed', value: '50 km/h' },
      { label: 'Engine', value: 'BN655' },
    ],
    price: {
      label: 'TOTAL PRICE',
      value: 'R35,199',
    },
    status: 'available',
  },
  {
    id: 'road-roller',
    title: 'Road Roller',
    description:
      'The Ingersoll Rand Super Duty Air Hammer provides a professional touch trigger for total control. This air hammer makes fast work of body panel crimping and cutting, bushing driving, shearing and general front end work.',
    imageUrl: '/images/bg/allBg.jpg',
    badge: {
      text: 'FOR RENT',
      color: 'blue',
    },
    specifications: [
      { label: 'Max speed', value: '30 km/h' },
      { label: 'Engine', value: 'Deo D13E' },
    ],
    price: {
      label: 'RENTAL PRICE',
      value: 'R150 / Day',
    },
    status: 'rental',
  },
  {
    id: 'excavator-ec300d',
    title: 'Excavator EC300D',
    description:
      'Featuring increased engine power and improved hydraulics, these machines perform with greater digging force and shorter cycle times. Sustain optimum power and productivity day in and day out with Hitachi.',
    imageUrl: '/images/bg/allBg.jpg',
    badge: {
      text: 'SOLD',
      color: 'gray',
    },
    specifications: [
      { label: 'Bucket capacity', value: '3.8 - 5.9 m³' },
      { label: 'Max. digging depth', value: '7,350 mm' },
      { label: 'Gross power', value: '170 kW' },
      { label: 'Max speed', value: '35 km/h' },
    ],
    price: {
      label: 'STATUS',
      value: 'Sold',
    },
    status: 'sold',
  },
  {
    id: 'classics-mighty-truck',
    title: 'Classics Mighty Truck',
    description:
      'Designed for severe off-road operations, the machine offers continuous productivity, proven Volvo technology and impressive comfort, contributing to sustainable operations.',
    imageUrl: '/images/bg/allBg.jpg',
    badge: {
      text: 'NEWEST',
      color: 'green',
    },
    specifications: [
      { label: 'Body Volume', value: '15.8 m³' },
      { label: 'Max speed', value: '80 km/h' },
      { label: 'Engine', value: 'Daku VB1100' },
      { label: 'Payload capacity', value: '34,000 - 46,000 kg' },
    ],
    price: {
      label: 'PRICE',
      value: 'Contact',
    },
    status: 'available',
  },
]

export default stockData
