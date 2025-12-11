import { CheckCircle, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
  ACTIF: { class: 'success', icon: CheckCircle, label: 'Actif' },
  EXPIRE: { class: 'error', icon: XCircle, label: 'Expiré' },
  ANNULE: { class: 'pending', icon: XCircle, label: 'Annulé' }
};


export const INITIAL_FORM_DATA = {
  code: '',
  nom: '',
  description: '',
  prix: '',
  dureeJours: '',
  actif: true,
  lignesAutorisees: []
};