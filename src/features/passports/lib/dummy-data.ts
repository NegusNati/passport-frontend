import { Passport } from '../schemas/passport'

// Generate dummy passports data matching the Figma design
export const DUMMY_PASSPORTS: Passport[] = [
  {
    id: '1',
    name: 'Zulfa Nazret Shifa',
    date: 'Sept 2, 2025',
    requestNumber: 'AAL7326089',
    status: 'ready',
    city: 'Addis Ababa',
  },
  {
    id: '2',
    name: 'Zuleyka Loba Heiii',
    date: 'Sept 2, 2025',
    requestNumber: 'AAL7326089',
    status: 'processing',
    city: 'Addis Ababa',
  },
  {
    id: '3',
    name: 'Zuleyka Loba Heiii',
    date: 'Sept 2, 2025',
    requestNumber: 'AAL7326089',
    status: 'ready',
    city: 'Addis Ababa',
  },
  {
    id: '4',
    name: 'Ahmed Yusuf Mohammed',
    date: 'Sept 2, 2025',
    requestNumber: 'AAL7326089',
    status: 'pending',
    city: 'Dire Dawa',
  },
  {
    id: '5',
    name: 'Fatima Hassan Ali',
    date: 'Sept 2, 2025',
    requestNumber: 'AAL7326089',
    status: 'completed',
    city: 'Hawassa',
  },
  {
    id: '6',
    name: 'Belayneh Tadesse Gebru',
    date: 'Sept 1, 2025',
    requestNumber: 'AAL7326078',
    status: 'ready',
    city: 'Mekelle',
  },
  {
    id: '7',
    name: 'Hanan Abdullahi Omar',
    date: 'Sept 1, 2025',
    requestNumber: 'AAL7326078',
    status: 'processing',
    city: 'Bahir Dar',
  },
  {
    id: '8',
    name: 'Dawit Alemayehu Tesfaye',
    date: 'Sept 1, 2025',
    requestNumber: 'AAL7326078',
    status: 'ready',
    city: 'Jimma',
  },
  {
    id: '9',
    name: 'Saron Bekele Wolde',
    date: 'Aug 31, 2025',
    requestNumber: 'AAL7326054',
    status: 'completed',
    city: 'Adama',
  },
  {
    id: '10',
    name: 'Robel Getachew Haile',
    date: 'Aug 31, 2025',
    requestNumber: 'AAL7326054',
    status: 'pending',
    city: 'Gondar',
  },
]

// Sample request numbers for the search examples
export const SAMPLE_REQUEST_NUMBERS = [
  'AAL7326089',
  'AAL7326678', 
  'AAL7326054'
]

// Filter options
export const DATE_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: '2025-09-02', label: 'Sept 2, 2025' },
  { value: '2025-09-01', label: 'Sept 1, 2025' },
  { value: '2025-08-31', label: 'Aug 31, 2025' },
]

export const CITY_OPTIONS = [
  { value: 'all', label: 'All Cities' },
  { value: 'Addis Ababa', label: 'Addis Ababa' },
  { value: 'Dire Dawa', label: 'Dire Dawa' },
  { value: 'Hawassa', label: 'Hawassa' },
  { value: 'Mekelle', label: 'Mekelle' },
  { value: 'Bahir Dar', label: 'Bahir Dar' },
  { value: 'Jimma', label: 'Jimma' },
  { value: 'Adama', label: 'Adama' },
  { value: 'Gondar', label: 'Gondar' },
]
