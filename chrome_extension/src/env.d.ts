// env.d.ts
/// <reference types="astro/client" />

declare namespace chrome {
    export namespace tabs {
      export interface Tab {
        url?: string;
        active: boolean;
      }
  
      export interface TabChangeInfo {
        status?: string;
      }
  
      export function query(queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: Tab[]) => void): void;
  
      export const onUpdated: {
        addListener(callback: (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => void): void;
      };
    }
  }