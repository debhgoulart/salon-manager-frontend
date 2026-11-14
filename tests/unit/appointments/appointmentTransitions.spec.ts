import { describe, it, expect } from 'vitest';
import type { AppointmentStatus } from 'src/types/appointment';

export function getAllowedNextStatuses(status: AppointmentStatus): AppointmentStatus[] {
  switch (status) {
    case 'AGENDADO':
      return ['CONFIRMADO', 'CANCELADO', 'NAO_COMPARECEU'];
    case 'CONFIRMADO':
      return ['EM_ATENDIMENTO', 'CANCELADO', 'NAO_COMPARECEU'];
    case 'EM_ATENDIMENTO':
      return ['CONCLUIDO', 'CANCELADO'];
    case 'CONCLUIDO':
    case 'CANCELADO':
    case 'NAO_COMPARECEU':
    default:
      return [];
  }
}

describe('Appointment Status Lifecycle Transitions', () => {
  it('permite confirmar, cancelar ou no-show a partir de AGENDADO', () => {
    const allowed = getAllowedNextStatuses('AGENDADO');
    expect(allowed).toContain('CONFIRMADO');
    expect(allowed).toContain('CANCELADO');
    expect(allowed).toContain('NAO_COMPARECEU');
    expect(allowed).not.toContain('CONCLUIDO');
    expect(allowed).not.toContain('EM_ATENDIMENTO');
  });

  it('permite iniciar atendimento, cancelar ou no-show a partir de CONFIRMADO', () => {
    const allowed = getAllowedNextStatuses('CONFIRMADO');
    expect(allowed).toContain('EM_ATENDIMENTO');
    expect(allowed).toContain('CANCELADO');
    expect(allowed).toContain('NAO_COMPARECEU');
    expect(allowed).not.toContain('CONCLUIDO');
  });

  it('permite concluir ou cancelar a partir de EM_ATENDIMENTO', () => {
    const allowed = getAllowedNextStatuses('EM_ATENDIMENTO');
    expect(allowed).toContain('CONCLUIDO');
    expect(allowed).toContain('CANCELADO');
    expect(allowed).not.toContain('CONFIRMADO');
    expect(allowed).not.toContain('NAO_COMPARECEU');
  });

  it('estados terminais CONCLUIDO, CANCELADO e NAO_COMPARECEU não possuem próximas transições', () => {
    expect(getAllowedNextStatuses('CONCLUIDO')).toEqual([]);
    expect(getAllowedNextStatuses('CANCELADO')).toEqual([]);
    expect(getAllowedNextStatuses('NAO_COMPARECEU')).toEqual([]);
  });
});
