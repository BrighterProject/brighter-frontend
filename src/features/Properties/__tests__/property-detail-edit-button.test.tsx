import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { PropertyDetail } from '../components/property-detail';
import type { PropertyResponse } from '../api/types';

// Heavy component — mock the sub-components that have external deps
vi.mock('@Auth/api/hooks', () => ({
  useMe: vi.fn(),
}));
vi.mock('@/features/Bookings/api/hooks', () => ({
  useOccupiedSlots: () => ({ data: [] }),
}));
vi.mock('../api/hooks', () => ({
  usePropertyUnavailabilities: () => ({ data: [] }),
}));
vi.mock('react-intlayer', () => ({
  useIntlayer: () => ({
    back: 'Back',
    noImages: 'No images',
    sections: { about: 'About', amenities: 'Amenities', workingHours: 'Hours', unavailableToday: 'Unavailable' },
    status: {},
    amenityLabels: {},
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    checkInOut: 'Check-in/out',
    upTo: 'Up to',
    people: 'people',
    bookingCard: {
      perNight: '/ night',
      bookNow: 'Book now',
      unavailable: 'Unavailable',
      selectDates: 'Select dates',
      statusNote: 'Status:',
      total: 'Total',
      capacity: 'Capacity',
      people: 'people',
      nights: () => ({ value: 'nights' }),
      calendar: {
        myBooking: { value: '' },
        booked: { value: '' },
        unavailable: { value: '' },
        turnoverCheckoutOnly: { value: '' },
        minNightsPrefix: { value: '' },
        maxNightsPrefix: { value: '' },
        rangeUnavailable: { value: '' },
      },
    },
  }),
  useLocale: () => ({ locale: 'bg' }),
}));
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

const makeProperty = (ownerId: string): PropertyResponse => ({
  id: 'prop-1',
  owner_id: ownerId,
  property_type: 'villa',
  status: 'active',
  city: 'Sofia',
  latitude: null,
  longitude: null,
  price_per_night: '150.00',
  currency: 'EUR',
  bedrooms: 2,
  bathrooms: 1,
  beds: 3,
  max_guests: 4,
  amenities: [],
  has_parking: false,
  check_in_time: '14:00',
  check_out_time: '11:00',
  min_nights: 1,
  max_nights: 30,
  cancellation_policy: 'free',
  rating: '4.5',
  total_reviews: 10,
  updated_at: '2026-01-01T00:00:00Z',
  images: [],
  unavailabilities: [],
  translations: [
    { id: 't1', property_id: 'prop-1', locale: 'bg', name: 'Test Villa', description: 'Desc', address: 'Sofia' },
  ],
});

const { useMe } = await import('@Auth/api/hooks');

describe('PropertyDetail edit button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows Edit Property button when viewer is the owner', () => {
    vi.mocked(useMe).mockReturnValue({ data: { id: 1, scopes: ['properties:me'] } } as any);
    render(<PropertyDetail property={makeProperty('1')} />);
    expect(screen.getByRole('link', { name: /edit property|редактирай/i })).toBeTruthy();
  });

  it('shows Edit Property button when viewer is an admin (not the owner)', () => {
    vi.mocked(useMe).mockReturnValue({ data: { id: 2, scopes: ['admin:properties'] } } as any);
    render(<PropertyDetail property={makeProperty('1')} />);
    expect(screen.getByRole('link', { name: /edit property|редактирай/i })).toBeTruthy();
  });

  it('does not show Edit Property button when viewer is not the owner', () => {
    vi.mocked(useMe).mockReturnValue({ data: { id: 2, scopes: [] } } as any);
    render(<PropertyDetail property={makeProperty('1')} />);
    expect(screen.queryByRole('link', { name: /edit property|редактирай/i })).toBeNull();
  });

  it('does not show Edit Property button when not authenticated', () => {
    vi.mocked(useMe).mockReturnValue({ data: undefined } as any);
    render(<PropertyDetail property={makeProperty('1')} />);
    expect(screen.queryByRole('link', { name: /edit property|редактирай/i })).toBeNull();
  });
});
