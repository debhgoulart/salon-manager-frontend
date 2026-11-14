import { ref, computed } from 'vue';
import type { EmployeeResponse } from 'src/types/employee';
import type { ClientResponse } from 'src/types/client';
import type { ServiceResponse } from 'src/types/service';
import employeeService from 'src/services/employeeService';
import clientService from 'src/services/clientService';
import serviceService from 'src/services/serviceService';
import { useFormatters } from 'src/composables/useFormatters';

export function useAppointmentDependencies() {
  const { formatCurrency } = useFormatters();

  const employees = ref<EmployeeResponse[]>([]);
  const clients = ref<ClientResponse[]>([]);
  const services = ref<ServiceResponse[]>([]);
  const clientOptions = ref<Array<{ label: string; value: string }>>([]);

  const employeeFormOptions = computed(() =>
    employees.value.filter((e) => e.active).map((e) => ({ label: e.name, value: e.id })),
  );

  const serviceOptions = computed(() =>
    services.value
      .filter((s) => s.active)
      .map((s) => ({
        label: `${s.name} — ${formatCurrency(s.price)} (${s.durationMinutes} min)`,
        value: s.id,
      })),
  );

  async function loadDependencies(): Promise<void> {
    try {
      const [empRes, servRes, cliRes] = await Promise.all([
        employeeService.list({ page: 0, size: 50, active: true }),
        serviceService.list({ page: 0, size: 50, active: true }),
        clientService.list({ page: 0, size: 50 }),
      ]);
      employees.value = empRes.content;
      services.value = servRes.content;
      clients.value = cliRes.content;
      clientOptions.value = cliRes.content.map((c) => ({
        label: `${c.name} (${c.phone})`,
        value: c.id,
      }));
    } catch {
      // Resiliente caso backend esteja sem dados iniciais
    }
  }

  function filterClients(val: string, update: (cb: () => void) => void): void {
    if (!val) {
      update(() => {
        clientOptions.value = clients.value.map((c) => ({
          label: `${c.name} (${c.phone})`,
          value: c.id,
        }));
      });
      return;
    }
    update(() => {
      const needle = val.toLowerCase();
      clientOptions.value = clients.value
        .filter((c) => c.name.toLowerCase().includes(needle) || c.phone.includes(needle))
        .map((c) => ({ label: `${c.name} (${c.phone})`, value: c.id }));
    });
  }

  return {
    employees,
    clients,
    services,
    employeeFormOptions,
    serviceOptions,
    clientOptions,
    loadDependencies,
    filterClients,
  };
}
