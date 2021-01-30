import type { ApiJson } from '@/def';
import { get } from '@/utils/fetch';

export const getApiJson = () => get<ApiJson>('/getApiJson');
