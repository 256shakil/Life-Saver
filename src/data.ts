import { Donor, Campaign, Hospital } from './types';
// @ts-ignore
import hospitalOne from './assets/images/dhaka_medical_college_1781168150055.png';
// @ts-ignore
import hospitalTwo from './assets/images/evercare_dhaka_1781168167587.png';
// @ts-ignore
import hospitalThree from './assets/images/chattogram_medical_1781168182319.png';
// @ts-ignore
import hospitalFour from './assets/images/square_dhaka_1781168201391.png';
// @ts-ignore
import hospitalFive from './assets/images/united_dhaka_1781168214895.png';
// @ts-ignore
import hospitalSix from './assets/images/labaid_dhaka_1781168230390.png';

export const INITIAL_DONORS: Donor[] = [
  {
    id: 'donor-1',
    name: 'Ariful Islam Chowdhury',
    fatherName: 'Late Shafiul Islam Chowdhury',
    gender: 'male',
    dob: '1982-10-12',
    bloodGroup: 'B+',
    mobile: '+8801712345678',
    whatsapp: '+8801712345678',
    email: 'ariful.islam@gmail.com',
    country: 'Bangladesh',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Banani',
    address: 'House 45, Road 12, Banani, Dhaka',
    lastDonationDate: '2026-02-15',
    availability: 'available',
    weight: 78,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4qxJ2J9UggllSz7HiATn-QW2jMKqGNxXK8sxAdiOkPdnWgDVk0Ro1aqLCrkz9BrIFGXew407wQs6y5aOqZMXT5DseV6efHGMV9J2JUSVSWeRloGR6nXGx8IYx00hKUcpR3uLAUyuzMTwkfMhNQLr7BVfPPd6ByB5uImr8gOupOGokgdjY_IVbso3j0aFYq3xwe34HvLINgwFMSWslRmmpX8l4L6CH0sjktpE1prPVcRNQJ2ANSuZ3Af06LGJDWSdSpgewEaAm6dd1',
    status: 'Approved',
    createdAt: '2025-06-01T12:00:00Z',
  },
  {
    id: 'donor-2',
    name: 'Nusrat Jahan',
    fatherName: 'Mofizur Rahman',
    gender: 'female',
    dob: '1995-04-20',
    bloodGroup: 'O-',
    mobile: '+8801819876543',
    whatsapp: '+8801819876543',
    email: 'nusrat.jahan@gmail.com',
    country: 'Bangladesh',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Uttara',
    address: 'Sector 4, Road 5, House 12, Uttara, Dhaka',
    lastDonationDate: '2026-04-10',
    availability: 'emergency',
    weight: 56,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy1niqMJ4sAtUUDYd2-j-6RJ2JoaOViJ91352pWL_cghBBAAQDyX4isT07IZeap7lKDYwfoab2wLxv3Vi6oUpVbzwmGaOBnXd_hT9dxCI7FFeNLzXDQIXfK6xogD3_PDaE3jbURh3asCd81x2g4AhIFkLPrQE6GGaiKRrvSyy5_TCCD7HcHos39H5xC_N6Q1QyCjw5cFrnoVxcdBqKwfPXUwHWLpn415jHuInpdF2WZ4MSFV5nwvKjgSmCaHmRtjTwfJvvM-NxRu05',
    status: 'Approved',
    createdAt: '2025-08-15T14:30:00Z',
  },
  {
    id: 'donor-3',
    name: 'Kamrul Hasan',
    fatherName: 'Zahid Hasan',
    gender: 'male',
    dob: '1990-09-05',
    bloodGroup: 'A+',
    mobile: '+8801911223344',
    whatsapp: '+8801911223344',
    email: 'kamrul.hasan@gmail.com',
    country: 'Bangladesh',
    division: 'Chattogram',
    district: 'Chattogram',
    upazila: 'Agrabad',
    address: 'Block B, Agrabad High Range, Chattogram',
    lastDonationDate: '2026-05-26',
    availability: 'unavailable',
    weight: 72,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZyIP6R_rwNJE0drrpPzxRyQLI8-CcwNDQDmWnslNvnIFiTjBWaYGjGlk3AeqHSXi_QNRVpmSI5-xZDv08d_XrMkG17PQ04OhgeXd1--ft4HWHCIqMj-n25TRpyF92So1zznZfF3hqgY9rwpEXDsLUUC3N32tH40PwKIze-9gjosmmbbin5mETKN60T63fj6GW4LV4qlDpd24-Z_GZ7UPA8WQ4UW4NVtH8Q4S0aQpt2j1YtnYcDPj7A-A9lK6FTS6zIKNbkO4kuPrf',
    status: 'Approved',
    createdAt: '2025-11-20T09:15:00Z',
  },
  {
    id: 'donor-4',
    name: 'Marcus Holloway',
    fatherName: 'Robert Holloway',
    gender: 'male',
    dob: '1992-06-18',
    bloodGroup: 'O+',
    mobile: '+12065550198',
    whatsapp: '',
    email: 'marcus.h@gmail.com',
    country: 'United States',
    division: 'Washington',
    district: 'King County',
    upazila: 'Seattle',
    address: '1202 Pine St, Seattle, WA',
    lastDonationDate: '',
    availability: 'available',
    weight: 85,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEj-hUuVp4_dPMZDp3gQMRQ-XPL3NgQdoOF7kBwxHxiKeJFswPxUS-V4SGakk6rOCSthb_qchJPbEDCuovC0GWvERnU09YMF2HLcQfhiX_KvUupJbIorEffBspnNpcFJg9H8BFY1oLo__Oia4PenN8pD9CeeLsuz07UrFJyVT5PpSA5B45OZJ-I927b5ivnq0joX3Z77aiaEWdeCNu8Fn7y0bJP_FvFVwu8f4-CnWRHJhUY5U4ro6hFkMQ4igv1jKxJq2G1lja023s',
    status: 'Pending',
    createdAt: '2026-06-08T10:00:00Z',
  },
  {
    id: 'donor-5',
    name: 'Elena Rodriguez',
    fatherName: 'Carlos Rodriguez',
    gender: 'female',
    dob: '1998-11-25',
    bloodGroup: 'A-',
    mobile: '+15125550143',
    whatsapp: '+15125550143',
    email: 'elena.r@gmail.com',
    country: 'United States',
    division: 'Texas',
    district: 'Travis County',
    upazila: 'Austin',
    address: '704 Congress Ave, Austin, TX',
    lastDonationDate: '2026-03-30',
    availability: 'available',
    weight: 59,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTHDsiGZ0HOZ4983yb_sS6NyBFBtVG94I2UU2xQVeJZhDK5VKE-Zr34UgqSvxKe491y4iL8ePc5fisQcOHdUCsEqMROgzhXfUf_0xnu0wSAS-eefqiCQ6EmtxZT2Fc7-ycbdb56shnLD4Ag8XwaX1NRFSfEJKa3PASwJShQ3hQIRwiqohGsaMh9QWZiVz-f402-o6YaijdbNd5wozhgQwPaNzzlIUVCy-Q0hSGVaqpXIuwBj8lx2n0aZIuYHuzlQtPF-xtiUoMv7VN',
    status: 'Approved',
    createdAt: '2026-06-05T08:20:00Z',
  },
  {
    id: 'donor-6',
    name: 'David Chen',
    fatherName: 'Howard Chen',
    gender: 'male',
    dob: '1979-02-14',
    bloodGroup: 'B+',
    mobile: '+16175550125',
    whatsapp: '',
    email: 'david.chen@gmail.com',
    country: 'United States',
    division: 'Massachusetts',
    district: 'Suffolk County',
    upazila: 'Boston',
    address: '15 Beacon St, Boston, MA',
    lastDonationDate: '2026-05-01',
    availability: 'emergency',
    weight: 74,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP5rWFjcjlORa_aCG2BSQSrpx0-rQk8qmyHs5WzYWMvshJPrzGWVmAWkumKxBu5_cK2BciohaiU_8lyNCDqNLeb_f4M-_FyRQrSadcTwT0kuj8H39nXXOaTbhm73_diIqA7_t9f2r-63sM0KpBHrhXENcVZk2AkapNPg0MyrNix9NgUlnEcJQzF2__2HGKLAl0Ud0y_aaTmpSLTwVRkGXUDPJxPj7xxdg3aST-2dNEr0KXwBTJsb1a0KPc5KI-NgmMLAJCVEXjLRs4',
    status: 'Pending',
    createdAt: '2026-06-09T18:45:00Z',
  },
  {
    id: 'donor-7',
    name: 'Sarah Miller',
    fatherName: 'James Miller',
    gender: 'female',
    dob: '2001-07-30',
    bloodGroup: 'AB-',
    mobile: '+13035550117',
    whatsapp: '+13035550117',
    email: 'sarah.miller@gmail.com',
    country: 'United States',
    division: 'Colorado',
    district: 'Denver County',
    upazila: 'Denver',
    address: '1100 14th St, Denver, CO',
    lastDonationDate: '2026-04-18',
    availability: 'available',
    weight: 54,
    healthStatus: 'Healthy & Fit',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTQJ_XYheg8hDe1EuXl-90fY6UH1NPaXhvBMASJLgGHcMNmvCrHQxit0i4UQ3mAL28dLv1bfjtjZ_InTDRA5HO_aLKzMgImo-06sJxquhPG1vPge2RPJE_v2fQedXCq-KP0GkF7bi2Xj8FkKABZg6PLuFC1DS5haGG8HQOCMTkop7mzCdkvuTqFk9SMmRNaYWBBfQ0A3N26j95Bb3YTTkszrYB_xMnvAGPfILg8cxPsularNlwxbJ67sXSCk6dwnb9yQPR-FYpu7vr',
    status: 'Approved',
    createdAt: '2026-06-07T11:10:00Z',
  },
];

export const GEOGRAPHY: Record<string, { districts: string[]; upazilas: Record<string, string[]> }> = {
  'Bangladesh': {
    districts: ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi'],
    upazilas: {
      'Dhaka': ['Banani', 'Uttara', 'Mirpur', 'Gulshan', 'Dhanmondi'],
      'Chattogram': ['Agrabad', 'Halishahar', 'Chowkbazar', 'Panchlaish'],
      'Sylhet': ['Zindabazar', 'Ambarkhana', 'Subidbazar'],
      'Rajshahi': ['Boalia', 'Motihar', 'Rajpara'],
    },
  },
  'United Kingdom': {
    districts: ['Greater London', 'West Midlands', 'Greater Manchester'],
    upazilas: {
      'Greater London': ['Camden', 'Westminster', 'Greenwich', 'Kensington'],
      'West Midlands': ['Birmingham', 'Coventry', 'Solihull'],
      'Greater Manchester': ['Manchester', 'Salford', 'Bolton'],
    }
  },
  'United States': {
    districts: ['King County', 'Travis County', 'Suffolk County', 'Denver County', 'Los Angeles County'],
    upazilas: {
      'King County': ['Seattle', 'Bellevue', 'Redmond'],
      'Travis County': ['Austin', 'West Lake Hills'],
      'Suffolk County': ['Boston', 'Chelsea', 'Revere'],
      'Denver County': ['Denver', 'Cherry Creek'],
      'Los Angeles County': ['Westwood', 'Santa Monica', 'Pasadena'],
    },
  },
  'Canada': {
    districts: ['Metro Vancouver', 'Toronto Area', 'Montreal Region'],
    upazilas: {
      'Metro Vancouver': ['Vancouver', 'Burnaby', 'Richmond'],
      'Toronto Area': ['Toronto Central', 'Scarborough', 'North York'],
      'Montreal Region': ['Downtown Montreal', 'Westmount', 'Laval'],
    }
  },
  'Australia': {
    districts: ['Greater Sydney', 'Melbourne Metro', 'Brisbane Region'],
    upazilas: {
      'Greater Sydney': ['Sydney CBD', 'Parramatta', 'Manly'],
      'Melbourne Metro': ['Melbourne CBD', 'Fitzroy', 'St Kilda'],
      'Brisbane Region': ['Brisbane CBD', 'Fortitude Valley'],
    }
  }
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'City-wide Youth Blood Drive',
    description: 'Join the younger generation in giving back to the community and help ensure blood bank readiness.',
    date: 'July 15, 2026',
    location: 'Dhaka National Museum Plaza',
    badge: 'Youth Hero 26',
  },
  {
    id: 'camp-2',
    title: 'Corporate Lifesavers Challenge',
    description: 'Rally your company teams to register and donate. Leading company will stand a chance to win the Platinum Lifesaver trophy.',
    date: 'August 02, 2026',
    location: 'Banani Club Ground',
    badge: 'Apex Giver',
  },
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Dhaka Medical College Hospital',
    location: 'Bakshibazar, Dhaka',
    contact: '+8802223363355',
    bloodNeeded: ['O-', 'B+', 'A+'],
    imageUrl: hospitalOne,
  },
  {
    id: 'hosp-2',
    name: 'Evercare Hospital Dhaka',
    location: 'Bashundhara R/A, Dhaka',
    contact: '+8809612341066',
    bloodNeeded: ['O-', 'AB-', 'B-'],
    imageUrl: hospitalTwo,
  },
  {
    id: 'hosp-3',
    name: 'Chattogram Medical College Hospital',
    location: 'K.B. Fazlul Kader Road, Chattogram',
    contact: '+88031616891',
    bloodNeeded: ['A-', 'O+'],
    imageUrl: hospitalThree,
  },
  {
    id: 'hosp-4',
    name: "Square Hospital",
    location: "18/F Bir Uttam Qazi Nuruzzaman Sarak, Panthapath, Dhaka, Bangladesh",
    contact: "+8801713377777",
    bloodNeeded: ['O+', 'B-', 'A-'],
    imageUrl: hospitalFour,
  },
  {
    id: 'hosp-5',
    name: "United Hospital Limited",
    location: "Plot 15, Road 71, Gulshan 2, Dhaka, Bangladesh",
    contact: "+8858815111",
    bloodNeeded: ['B+', 'O-', 'AB-'],
    imageUrl: hospitalFive,
  },
  {
    id: 'hosp-6',
    name: 'Labaid Specialized Hospital',
    location: 'House 6, Road 4, Dhanmondi, Dhaka, Bangladesh',
    contact: '+8801713333337',
    bloodNeeded: ['A+', 'O+', 'B+'],
    imageUrl: hospitalSix,
  },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
export const HEALTH_STATUSES = [
  'Healthy & Fit',
  'Under Medication',
  'Recovering from Illness',
  'Chronic Condition'
];
