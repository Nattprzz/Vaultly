/**
 * statusConfig.ts — re-exporta los helpers de tracker-statuses.ts
 * para mantener compatibilidad con imports existentes.
 *
 * No añadir lógica aquí. La fuente de verdad es src/constants/tracker-statuses.ts
 */
export {
  getStatusLabel,
  getStatusIcon,
  getStatusInfo,
  getCategoryStatuses,
  getAllStatuses,
  getDefaultStatus,
  isValidStatus,
  getActionText,
  STATUS_CONFIG,
  CATEGORY_STATUSES,
  SEMANTIC_GROUPS,
} from '@/constants/tracker-statuses';

export type { CategoryStatus, StatusInfo } from '@/constants/tracker-statuses';
