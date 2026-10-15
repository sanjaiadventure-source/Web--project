import { describe, it, expect } from 'vitest';
import { calculatePricing } from '../store/slices/bookingSlice';

describe('EXPERIMENT 1d: Booking Cost Calculation Engine', () => {
  it('correctly calculates stay duration (nights) from check-in and check-out dates', () => {
    const result = calculatePricing({
      ratePerNight: 500,
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-05',
      roomsCount: 1,
      discountAmount: 0
    });

    expect(result.nights).toBe(4);
  });

  it('calculates room cost as ratePerNight * nights * roomsCount', () => {
    const result = calculatePricing({
      ratePerNight: 600,
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-04', // 3 nights
      roomsCount: 2,
      discountAmount: 0
    });

    // 600 * 3 * 2 = 3600
    expect(result.roomCost).toBe(3600);
  });

  it('calculates 12% hospitality tax and applies $45 service fee', () => {
    const result = calculatePricing({
      ratePerNight: 1000,
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-02', // 1 night
      roomsCount: 1,
      discountAmount: 0
    });

    expect(result.roomCost).toBe(1000);
    expect(result.serviceFee).toBe(45);
    expect(result.taxes).toBe(120); // 12% of 1000
    expect(result.totalAmount).toBe(1165); // 1000 + 120 + 45
  });

  it('deducts discount coupons correctly from the total cost', () => {
    const result = calculatePricing({
      ratePerNight: 500,
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-03', // 2 nights => roomCost 1000, taxes 120, fee 45 => 1165
      roomsCount: 1,
      discountAmount: 100 // $100 VIP coupon
    });

    expect(result.discount).toBe(100);
    expect(result.totalAmount).toBe(1065);
  });

  it('handles edge case where check-in and check-out dates are same or reversed (defaults to minimum 1 night)', () => {
    const sameDay = calculatePricing({
      ratePerNight: 400,
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-01',
      roomsCount: 1
    });

    expect(sameDay.nights).toBe(1);
    expect(sameDay.roomCost).toBe(400);

    const reversed = calculatePricing({
      ratePerNight: 400,
      checkInDate: '2026-11-05',
      checkOutDate: '2026-11-01',
      roomsCount: 1
    });

    expect(reversed.nights).toBe(1);
  });
});
