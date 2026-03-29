import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

let storageClientCache: StorageClient | null = null;

async function getStorageClient(): Promise<StorageClient> {
  if (storageClientCache) return storageClientCache;
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  storageClientCache = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return storageClientCache;
}

export function useStorage() {
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const client = await getStorageClient();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await client.putFile(bytes);
    return hash;
  }, []);

  const getBlobUrl = useCallback(async (blobId: string): Promise<string> => {
    if (!blobId) return "";
    const client = await getStorageClient();
    return client.getDirectURL(blobId);
  }, []);

  return { uploadFile, getBlobUrl };
}
