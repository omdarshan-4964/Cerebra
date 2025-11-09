type ToastLevel = 'info' | 'success' | 'error';

export function useToast() {
  const toast = (message: string, level: ToastLevel = 'info') => {
    try {
      window.dispatchEvent(new CustomEvent('cerebra-toast', { detail: { message, level } }));
    } catch (e) {
      // fallback
      // eslint-disable-next-line no-console
      console.log(level.toUpperCase(), message);
    }
  };

  return {
    toast,
    info: (m: string) => toast(m, 'info'),
    success: (m: string) => toast(m, 'success'),
    error: (m: string) => toast(m, 'error'),
  } as const;
}

export default useToast;
