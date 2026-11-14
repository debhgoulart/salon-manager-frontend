/**
 * Contrato de conversão de data/hora local para ISO 8601 UTC
 */
export interface AppointmentTimeConverter {
  /**
   * Converte uma data (YYYY-MM-DD) e horário (HH:mm) informados no fuso local do salão
   * para uma string ISO 8601 UTC com o offset correto.
   *
   * @param date Data no formato YYYY-MM-DD
   * @param time Horário no formato HH:mm
   * @returns String ISO 8601 UTC (ex: "2026-11-14T17:30:00.000Z")
   */
  toUtcIsoString(date: string, time: string): string;

  /**
   * Extrai o horário formatado (HH:mm) para exibição a partir de um timestamp ISO UTC
   * respeitando o fuso local do navegador.
   *
   * @param isoUtcString Timestamp ISO 8601
   * @returns Horário no formato HH:mm
   */
  toLocalTimeString(isoUtcString: string): string;
}
