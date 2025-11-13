package com.wasalny.paiement.service;  
  
import com.wasalny.paiement.entity.InfoPaiementCarte;  
import org.springframework.stereotype.Service;  
import java.time.YearMonth;  
import java.time.format.DateTimeFormatter;  
  
@Service  
public class ValidationCarteService {  
      
    public boolean validerCarte(InfoPaiementCarte info) {  
        if (info == null) return false;  
          
        return validerNumeroCarte(info.getNumeroCarte()) &&  
               validerDateExpiration(info.getDateExpiration()) &&  
               validerCVV(info.getCvv()) &&  
               info.getNomTitulaire() != null && !info.getNomTitulaire().trim().isEmpty();  
    }  
      
    private boolean validerNumeroCarte(String numero) {  
        if (numero == null) return false;  
        String numeroNettoye = numero.replaceAll("[\\s-]", "");  
        if (!numeroNettoye.matches("\\d{15,16}")) return false;  
        return algorithmeDeLuhn(numeroNettoye);  
    }  
      
    /* L'algorithme de Luhn (aussi appelé "modulo 10") est un algorithme de validation utilisé par toutes les cartes bancaires réelles (Visa, Mastercard, American Express, etc.).

    Comment fonctionne l'algorithme
    L'algorithme vérifie qu'un numéro de carte est mathématiquement valide en calculant une somme de contrôle  */
    private boolean algorithmeDeLuhn(String numero) {  
        int somme = 0;  
        boolean alternatif = false;  
          
        for (int i = numero.length() - 1; i >= 0; i--) {  
            int chiffre = Character.getNumericValue(numero.charAt(i));  
            if (alternatif) {  
                chiffre *= 2;  
                if (chiffre > 9) chiffre -= 9;  
            }  
            somme += chiffre;  
            alternatif = !alternatif;  
        }  
        return (somme % 10 == 0);  
    }  
      
    private boolean validerDateExpiration(String date) {  
        if (date == null) return false;  
        try {  
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");  
            YearMonth expiration = YearMonth.parse(date, formatter);  
            return !expiration.isBefore(YearMonth.now());  
        } catch (Exception e) {  
            return false;  
        }  
    }  
      
    private boolean validerCVV(String cvv) {  
        return cvv != null && cvv.matches("\\d{3}");  
    }  
}