import { BigNumber } from 'bignumber.js';

import {
  fromEth,
  fromFinney,
  fromGwei,
  fromKwei,
  fromMwei,
  fromSzabo,
  shiftNumber,
  toFinney,
  toGwei,
  toKwei,
  toMwei,
  toSzabo,
  toWei
} from '../utils';
import { assertNumberEqual } from './helpers';

describe('#shiftNumber', () => {
  it('should return the number if decimals is 0', () => {
    const num = 10;
    assertNumberEqual(shiftNumber(num, 0), num);
  });

  it('should multiple the number by 1000 if decimals is 3', () => {
    const num = 10;
    const expectedMul = 1000;
    assertNumberEqual(shiftNumber(num, 3), num * expectedMul);
  });

  it('should divide the number by 100 if decimals is -2', () => {
    const num = 10000;
    const expectedDiv = 100;
    assertNumberEqual(shiftNumber(num, -2), num / expectedDiv);
  });
});

const toConversionSpec = [
  { unit: 'Finney', func: toFinney, base: '1000' },
  { unit: 'Szabo', func: toSzabo, base: '1000000' },
  { unit: 'Gwei', func: toGwei, base: '1000000000' },
  { unit: 'Mwei', func: toMwei, base: '1000000000000' },
  { unit: 'Kwei', func: toKwei, base: '1000000000000000' },
  { unit: 'Wei', func: toWei, base: '1000000000000000000' }
];

for (const { unit, func, base } of toConversionSpec) {
  describe(`#to${unit}`, () => {
    it(`should return ${base} ${unit} for 1 ETH`, () => {
      assertNumberEqual(func(1), base);
    });

    const expectedMul = new BigNumber(base).mul(5);
    it(`should return ${expectedMul} ${unit} for 5 ETH`, () => {
      assertNumberEqual(func(5), expectedMul);
    });

    const expectedDiv = new BigNumber(base).div(100);
    it(`should return ${expectedDiv} ${unit} for 0.01 ETH`, () => {
      assertNumberEqual(func(0.01), expectedDiv);
    });
  });
}

const fromConversionSpec = [
  { unit: 'ETH', func: fromEth, base: '1000000000000000000' },
  { unit: 'Finney', func: fromFinney, base: '1000000000000000' },
  { unit: 'Szabo', func: fromSzabo, base: '1000000000000' },
  { unit: 'Gwei', func: fromGwei, base: '1000000000' },
  { unit: 'Mwei', func: fromMwei, base: '1000000' },
  { unit: 'Kwei', func: fromKwei, base: '1000' }
];

for (const { unit, func, base } of fromConversionSpec) {
  describe(`#from${unit}`, () => {
    it(`should return ${base} Wei for 1 ${unit}`, () => {
      assertNumberEqual(func(1), base);
    });

    const expectedMul = new BigNumber(base).mul(5);
    it(`should return ${expectedMul} Wei for 5 ${unit}`, () => {
      assertNumberEqual(func(5), expectedMul);
    });

    const expectedDiv = new BigNumber(base).div(100);
    it(`should return ${expectedDiv} Wei for 0.01 ${unit}`, () => {
      assertNumberEqual(func(0.01), expectedDiv);
    });
  });
}
