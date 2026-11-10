import { useQuasar } from 'quasar';
import type { AxiosError } from 'axios';
import type { ProblemDetails } from 'src/types/api';

export function useFeedback() {
  const $q = useQuasar();

  function notifySuccess(message: string) {
    $q.notify({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 3000,
    });
  }

  function notifyError(message: string) {
    $q.notify({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 4500,
    });
  }

  function handleApiError(err: unknown, defaultMessage = 'Ocorreu um erro na operação.') {
    const axiosError = err as AxiosError<ProblemDetails>;
    const detail = axiosError.response?.data?.detail;
    const title = axiosError.response?.data?.title;

    if (detail) {
      notifyError(detail);
      return;
    }
    if (title) {
      notifyError(title);
      return;
    }
    notifyError(defaultMessage);
  }

  return {
    notifySuccess,
    notifyError,
    handleApiError,
  };
}
