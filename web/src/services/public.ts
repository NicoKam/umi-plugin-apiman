import type { ApiJson } from '@/utils/ApiJson';
import { get } from '@/utils/fetch';

export const getApiJson = () => get<ApiJson>('/getApiJson');
