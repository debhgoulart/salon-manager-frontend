import { describe, it, expect } from 'vitest';
import { useFormatters } from 'src/composables/useFormatters';

describe('useFormatters Composable', () => {
  const {
    formatCurrency,
    formatCpf,
    formatPhone,
    formatMinutes,
    formatPercent,
    formatDate,
    formatDateTime,
    toUtcIsoString,
    toLocalTimeString,
  } = useFormatters();

  describe('formatCurrency', () => {
    it('formats numbers to Brazilian Real currency format', () => {
      const formatted = formatCurrency(1250.5);
      // Espaço não separável (\u00a0 ou \s) pode variar conforme ambiente
      expect(formatted).toMatch(/R\$\s?1\.250,50/);
    });

    it('returns R$ 0,00 for null, undefined or NaN', () => {
      expect(formatCurrency(null)).toMatch(/R\$\s?0,00/);
      expect(formatCurrency(undefined)).toMatch(/R\$\s?0,00/);
      expect(formatCurrency(NaN)).toMatch(/R\$\s?0,00/);
    });
  });

  describe('formatCpf', () => {
    it('formats 11-digit clean numbers into standard CPF mask', () => {
      expect(formatCpf('12345678901')).toBe('123.456.789-01');
    });

    it('returns "-" for empty or null values', () => {
      expect(formatCpf('')).toBe('-');
      expect(formatCpf(null)).toBe('-');
    });

    it('returns original input if digits count is not 11', () => {
      expect(formatCpf('12345')).toBe('12345');
    });
  });

  describe('formatPhone', () => {
    it('formats 11-digit cell phones with 9-digit prefix', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('formats 10-digit landline numbers', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('returns "-" for empty or null', () => {
      expect(formatPhone(null)).toBe('-');
      expect(formatPhone('')).toBe('-');
    });
  });

  describe('formatMinutes', () => {
    it('formats minutes under an hour', () => {
      expect(formatMinutes(45)).toBe('45 min');
    });

    it('formats exact hours', () => {
      expect(formatMinutes(60)).toBe('1h');
      expect(formatMinutes(120)).toBe('2h');
    });

    it('formats compound hours and minutes', () => {
      expect(formatMinutes(90)).toBe('1h 30min');
    });

    it('handles empty or zero values', () => {
      expect(formatMinutes(0)).toBe('0 min');
      expect(formatMinutes(null)).toBe('-');
    });
  });

  describe('formatPercent', () => {
    it('formats integer percentages', () => {
      expect(formatPercent(40)).toBe('40%');
      expect(formatPercent(0)).toBe('0%');
      expect(formatPercent(null)).toBe('0%');
    });
  });

  describe('Timezone & Datetime conversions', () => {
    it('toUtcIsoString converts local date and time to ISO UTC string', () => {
      const iso = toUtcIsoString('2026-11-14', '14:30');
      expect(iso).toMatch(/^2026-11-14T\d{2}:30:00(\.\d{3})?Z$/);
      // Validar que o timestamp parseado representa o mesmo ponto no tempo
      const parsed = new Date(iso);
      expect(parsed.getMinutes()).toBe(30);
    });

    it('toLocalTimeString extracts HH:mm correctly from ISO string', () => {
      const now = new Date();
      const localHours = now.getHours().toString().padStart(2, '0');
      const localMins = now.getMinutes().toString().padStart(2, '0');
      const timeStr = toLocalTimeString(now.toISOString());
      expect(timeStr).toBe(`${localHours}:${localMins}`);
    });
  });
});
