import { CheckCircle, XCircle, CreditCard } from 'lucide-react';

export const STATUS_CONFIG = {
  ACHETE: { class: 'success', icon: CheckCircle, label: 'Acheté' },
  UTILISE: { class: 'info', icon: CheckCircle, label: 'Utilisé' },
  ANNULE: { class: 'error', icon: XCircle, label: 'Annulé' },
  REMBOURSE: { class: 'pending', icon: CreditCard, label: 'Remboursé' }
};

export const MOCK_CLIENT_ID = '550e8400-e29b-41d4-a716-446655440000';