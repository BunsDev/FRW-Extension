import { useEffect, useCallback, useState } from 'react';

import type { StorageInfo } from '@/background/service/networkModel';

import { useWallet } from './WalletContext';

interface StorageCheckResult {
  storageInfo: StorageInfo | null;
  checkStorageStatus: () => Promise<{ sufficient: boolean; storageInfo: StorageInfo }>;
  checkTransactionStorage: (amount?: number) => Promise<{ canProceed: boolean; reason?: string }>;
}

export const useStorageCheck = (): StorageCheckResult => {
  const wallet = useWallet();

  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  // Check general storage status
  const checkStorageStatus = useCallback(async (): Promise<{
    sufficient: boolean;
    storageInfo: StorageInfo;
  }> => {
    try {
      const { isStorageSufficient: sufficient, storageInfo } = await wallet.checkStorageStatus();

      return { sufficient, storageInfo };
    } catch (error) {
      console.error('Error checking storage status:', error);
      return { sufficient: false, storageInfo: { available: 0, used: 0, capacity: 0 } }; // Default to true to not block transactions on error
    }
  }, [wallet]);

  // Check storage for a specific transaction
  const checkTransactionStorage = useCallback(
    async (amount?: number): Promise<{ canProceed: boolean; reason?: string }> => {
      try {
        return await wallet.checkTransactionStorageStatus(amount);
      } catch (error) {
        console.error('Transaction storage check failed:', error);
        return { canProceed: false, reason: 'unknown_error' };
      }
    },
    [wallet]
  );

  // Initial storage check
  useEffect(() => {
    let mounted = true;
    if (wallet) {
      checkStorageStatus().then(({ storageInfo }) => {
        if (mounted) {
          setStorageInfo(storageInfo);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [checkStorageStatus, wallet]);

  return {
    storageInfo,
    checkStorageStatus,
    checkTransactionStorage,
  };
};