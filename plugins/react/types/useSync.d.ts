import { Folder as FolderMC } from '@magic-circle/client';
declare type Child = Parameters<FolderMC['add']>[0];
export default function useSync(instance: Child): void;
export {};
