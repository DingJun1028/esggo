self.onmessage = async (event) => {
  const { type, content } = event.data;

  if (type === 'hash_request') {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const computedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      self.postMessage({ hash: `0x${computedHash}` });
    } catch (error) {
      self.postMessage({ hash: 'error' });
    }
  }
};
