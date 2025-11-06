import React from 'react';
import { useCheckUrlExists } from '../utils/hooks/fileExist';

export const DownloadButton = ({ zipUrl }: { zipUrl: string }) => {
  const { exists, isLoading } = useCheckUrlExists(zipUrl);

  if (isLoading) {
    return null;
  }

  if (exists === true) {
    return <a style={{ fontSize: '20px', color: 'green'}} href={zipUrl} download>Скачать все лог файлы</a>;
  }

  if (exists === false) {
    return null;
  }

  // This would handle the initial state (exists === null)
  return null;
};