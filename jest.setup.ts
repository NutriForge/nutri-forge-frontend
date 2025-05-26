import { TextEncoder, TextDecoder } from 'util';
import './test/__mocks__/fetchMock';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}