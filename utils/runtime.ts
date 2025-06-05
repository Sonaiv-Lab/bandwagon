export const isNodeRuntime = (): boolean => {
  // assertion of checking is node env
  return (
    typeof process !== 'undefined' &&
    !!process.versions?.node &&
    typeof process.stdout !== 'undefined'
    // check some edge runtime
  );
};

export const assertNodeRuntime = () => {
  if (!isNodeRuntime()) {
    throw new Error('Not Note runtime');
  }
};
