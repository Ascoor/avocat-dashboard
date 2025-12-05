import type { Client, ClientFormMode } from '@/types/clients';
import type { Unclient } from '@/types/unclients';

export type UnclientFormMode = 'create' | 'edit' | 'view';

export type ClientRecord = Client;
export type UnclientRecord = Unclient;

export type { ClientFormMode };
