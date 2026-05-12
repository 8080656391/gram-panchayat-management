import React from 'react';

const DownloadCertificateButton = ({ certificateId, token }) => {
  const handleDownload = async () => {
    const response = await fetch(`/api/certificates/${certificateId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${certificateId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload}>
      Download Certificate (HTML)
    </button>
  );
};

export default DownloadCertificateButton;
