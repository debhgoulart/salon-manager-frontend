export function useFormatters() {
  function formatCurrency(val?: number | null): string {
    if (val === undefined || val === null || isNaN(val)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(val);
  }

  function formatCpf(cpf?: string | null): string {
    if (!cpf) return '-';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return cpf;
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function formatPhone(phone?: string | null): string {
    if (!phone) return '-';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 11) {
      return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (clean.length === 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }

  function formatMinutes(minutes?: number | null): string {
    if (!minutes && minutes !== 0) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins} min`;
  }

  function formatPercent(val?: number | null): string {
    if (val === undefined || val === null || isNaN(val)) return '0%';
    return `${val.toFixed(0)}%`;
  }

  function formatDate(iso?: string | null): string {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d);
    } catch {
      return iso;
    }
  }

  function formatDateTime(iso?: string | null): string {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return iso;
    }
  }

  return {
    formatCurrency,
    formatCpf,
    formatPhone,
    formatMinutes,
    formatPercent,
    formatDate,
    formatDateTime,
  };
}
