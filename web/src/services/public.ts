import { get } from '@/utils/fetch';
import type { ApiJson } from '../../../src/utils/ApiJson';

export const getApiJson = () => get<ApiJson>('/getApiJson');
