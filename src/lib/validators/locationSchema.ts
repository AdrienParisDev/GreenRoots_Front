import { z } from "zod";


// Expression régulière pour autoriser :
// - les lettres : 
//       majuscules non accentuées => A-Z 
//       minuscules non accentuées => a-z
//       majuscules accentuées (de À à Ö) => À-Ö
//       accentuées du bloc Unicode suivant => Ø-ö
//       accentuées minuscules (jusqu’à ÿ) => ø-ÿ
// - les espaces => \s
// - les tirets => -
// Les chiffres, symboles et caractères spéciaux sont interdits.
const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;

// Expression régulière pour vérifier l'utilisation d'un point entre 2 nombres
// Peut optionnellement commencer par un signe négatif => ^-? 
// Doit avoir au moins un chiffre avant le point => \d+ 
// le point est optionnel, mais si présent, au moins un chiffre après le point => (\.\d+)?
// ✅ Valide : 42, 42.5, -42.5
// ❌ Invalide : .5, 42. ou .
const numberPointNumber = /^-?\d+(\.\d+)?$/



export const LocationSchemaForCreate = z.object({
    name: z
        .string()
        .min(1, "Le nom doit contenir au moins 1 caractère")
        .max(255, "Le nom ne doit pas dépasser 255 caractères")
        .regex(onlyLetters, "Le nom ne doit pas contenir de chiffres ni de caractères spéciaux"),

    latitude: z
        // Même si ton input est de type number, React stocke sa valeur en "string"
        .string()
        // Expression régulière pour vérifier l'utilisation d'un point entre 2 nombres
        .regex(numberPointNumber, "Nombre (ex: 42) ou nombre avec un point (ex : 42.5) ")
        // trim() supprime les espaces blancs au début et à la fin d’une chaîne de caractères.
        // Si un espace est mis dans l'input il reste considé comme vide 
        .refine((val) => val.trim() !== "", "La latitude est obligatoire")
        // Vérifie que la valeur peut être convertie en nombre.
        // Du fait de l'utilisation de la regex qui vérifie déjà les nombres, ce n'est plus utile ...
        // .refine((val) => !isNaN(parseFloat(val)), "La latitude doit être un nombre valide")
        // Convertit la string en nombre 
        .transform((val) => parseFloat(val))
        // Vérifie que la latitude se situe dans la plage géographique valide.
        // -90 (pôle Sud) à +90 (pôle Nord).
        .refine((val) => val >= -90 && val <= 90, {
            message: "La latitude doit être comprise entre -90 et 90",
        }),
    longitude: z
        // Même si ton input est de type number, React stocke sa valeur en "string"
        .string()
        // trim() supprime les espaces blancs au début et à la fin d’une chaîne de caractères.
        // Si un espace est mis dans l'input il reste considé comme vide 
        .refine((val) => val.trim() !== "", "La longitude est obligatoire")
        // Expression régulière pour vérifier l'utilisation d'un point entre 2 nombres
        .regex(numberPointNumber, "Nombre (ex: 42) ou nombre avec un point (ex : 42.5) ")
        // Convertit la string en nombre 
        .transform((val) => parseFloat(val))
        // Vérifie la plage de validité géographique de la longitude :
        // -180° (côté ouest maximal) à +180° (côté est maximal).
        .refine((val) => val >= -180 && val <= 180, {
            message: "La longitude doit être comprise entre -180 et 180",
        }),
});

export type LocationFormData = z.infer<typeof LocationSchemaForCreate>;
