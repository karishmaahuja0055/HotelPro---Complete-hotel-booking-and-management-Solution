import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNights, calculateHotelBookingPrice } from './pricing';
import { formatINR, isValidIndianPhone, formatIndianPhone, isValidGSTIN } from './indianFormats';

test('calculateNights calculates standard multi-day duration accurately', () => {
  const checkIn = '2026-11-10';
  const checkOut = '2026-11-14';
  const nights = calculateNights(checkIn, checkOut);
  assert.equal(nights, 4);
});

test('calculateNights returns minimum 1 night for same-day selection', () => {
  const checkIn = '2026-11-10';
  const checkOut = '2026-11-10';
  const nights = calculateNights(checkIn, checkOut);
  assert.equal(nights, 1);
});

test('calculateHotelBookingPrice applies 12% GST when nightly rate is <= ₹7,500', () => {
  const checkIn = '2026-11-10';
  const checkOut = '2026-11-12'; // 2 nights
  const basePricePerNight = 5000;
  const roomsCount = 1;

  const result = calculateHotelBookingPrice(basePricePerNight, checkIn, checkOut, roomsCount, 0);

  assert.equal(result.nights, 2);
  assert.equal(result.grossRoomTariff, 10000);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.netTaxableAmount, 10000);
  assert.equal(result.gstRate, 0.12);
  assert.equal(result.totalGst, 1200);
  assert.equal(result.cgstAmount, 600);
  assert.equal(result.sgstAmount, 600);
  assert.equal(result.grandTotal, 11200);
  assert.equal(result.sacCode, '9963');
});

test('calculateHotelBookingPrice applies 18% GST when nightly rate is > ₹7,500', () => {
  const checkIn = '2026-11-10';
  const checkOut = '2026-11-13'; // 3 nights
  const basePricePerNight = 12000;
  const roomsCount = 2; // 2 rooms

  const result = calculateHotelBookingPrice(basePricePerNight, checkIn, checkOut, roomsCount, 10); // 10% discount

  // Gross: 12000 * 3 * 2 = 72000
  // Discount: 10% of 72000 = 7200
  // Net Taxable: 64800
  // Rate after discount: 12000 * 0.9 = 10800 (>7500 => 18%)
  // GST: 64800 * 0.18 = 11664
  // Total: 64800 + 11664 = 76464
  assert.equal(result.nights, 3);
  assert.equal(result.grossRoomTariff, 72000);
  assert.equal(result.discountAmount, 7200);
  assert.equal(result.netTaxableAmount, 64800);
  assert.equal(result.gstRate, 0.18);
  assert.equal(result.totalGst, 11664);
  assert.equal(result.grandTotal, 76464);
});

test('formatINR formats numbers with Indian Rupee currency and commas', () => {
  const formatted = formatINR(125000);
  assert.ok(formatted.includes('1,25,000'));
});

test('isValidIndianPhone validates authentic Indian 10-digit mobile numbers', () => {
  assert.equal(isValidIndianPhone('9820112345'), true);
  assert.equal(isValidIndianPhone('+919820112345'), true);
  assert.equal(isValidIndianPhone('+91 98201 12345'), true);
  assert.equal(isValidIndianPhone('1234567890'), false); // Starts with 1
  assert.equal(isValidIndianPhone('98201'), false); // Too short
});

test('formatIndianPhone adds +91 prefix and clean spacing', () => {
  assert.equal(formatIndianPhone('9820112345'), '+91 98201 12345');
});

test('isValidGSTIN checks Indian GST identification number format', () => {
  assert.equal(isValidGSTIN('08AABCT1332L1Z4'), true); // 08 = Rajasthan
  assert.equal(isValidGSTIN('INVALID123'), false);
});
