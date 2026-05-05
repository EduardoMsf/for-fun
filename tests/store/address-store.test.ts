import { beforeEach, describe, expect, it } from 'vitest';
import { useAddressStore } from '@/src/store/address/address-store';

const emptyAddress = {
  firstName: '',
  lastName: '',
  address: '',
  address2: '',
  postalCode: '',
  city: '',
  country: '',
  phone: '',
};

beforeEach(() => {
  useAddressStore.setState({ address: emptyAddress });
});

describe('useAddressStore', () => {
  it('initializes with empty address fields', () => {
    expect(useAddressStore.getState().address).toEqual(emptyAddress);
  });

  it('setAddress replaces the entire address', () => {
    const newAddress = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      address2: 'Apt 4',
      postalCode: '10001',
      city: 'New York',
      country: 'US',
      phone: '5550001111',
    };

    useAddressStore.getState().setAddress(newAddress);

    expect(useAddressStore.getState().address).toEqual(newAddress);
  });

  it('setAddress overwrites previous values', () => {
    useAddressStore.getState().setAddress({ ...emptyAddress, firstName: 'Alice' });
    useAddressStore.getState().setAddress({ ...emptyAddress, firstName: 'Bob' });

    expect(useAddressStore.getState().address.firstName).toBe('Bob');
  });

  it('optional address2 can be set to undefined', () => {
    const addr = { ...emptyAddress, address2: undefined };
    useAddressStore.getState().setAddress(addr);

    expect(useAddressStore.getState().address.address2).toBeUndefined();
  });
});
