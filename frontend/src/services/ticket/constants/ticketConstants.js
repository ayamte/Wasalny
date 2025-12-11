import { CheckCircle, XCircle, CreditCard } from 'lucide-react';

export const STATUS_CONFIG = {
  ACHETE: { class: 'success', icon: CheckCircle, label: 'Acheté' },
  UTILISE: { class: 'info', icon: CheckCircle, label: 'Utilisé' },
  ANNULE: { class: 'error', icon: XCircle, label: 'Annulé' },
  REMBOURSE: { class: 'pending', icon: CreditCard, label: 'Remboursé' }
};

