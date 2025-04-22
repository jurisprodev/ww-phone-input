/**
 * Utilitários para o componente de input de telefone
 */

/**
 * Extrai as propriedades básicas de um objeto de país
 * @param {Object} country - Objeto do país
 * @returns {Object} - Objeto normalizado
 */
export function normalizeCountry(country) {
    if (!country) return null;
    
    return {
        code: String(country.code || '').toUpperCase() || '',
        name: String(country.name || ''),
        dialCode: String(country.dialCode || ''),
        format: String(country.format || ''),
        mask: String(country.mask || ''),
        maxDigits: Number(country.maxDigits || 0),
        flag: country.flag || null,
        priority: Number(country.priority || 0),
        areaCodes: Array.isArray(country.areaCodes) ? country.areaCodes : null,
    };
}

/**
 * Filtra e prepara uma lista de países para uso no componente
 * @param {Array} countries - Lista de países
 * @returns {Array} - Lista normalizada e filtrada
 */
export function prepareCountriesList(countries) {
    if (!Array.isArray(countries) || countries.length === 0) {
        return [];
    }
    
    return countries
        .map(normalizeCountry)
        .filter(country => country && country.code && country.name && country.dialCode);
}

/**
 * Converte um código de país em emoji de bandeira
 * @param {String} countryCode - Código do país (2 letras)
 * @returns {String} - Emoji da bandeira
 */
export function getFlagEmoji(countryCode) {
    if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
        return '🏳️';
    }
    
    try {
        // Convertendo cada letra para o correspondente Regional Indicator Symbol
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
            
        // Convertendo código para emoji
        return String.fromCodePoint(...codePoints);
    } catch (e) {
        return '🏳️';
    }
}

/**
 * Limpar um número de telefone para conter apenas dígitos
 * @param {String} phoneNumber - Número de telefone
 * @returns {String} - Número limpo
 */
export function cleanPhoneNumber(phoneNumber) {
    return String(phoneNumber || '').replace(/\D/g, '');
}

/**
 * Logs formatados para desenvolvimento
 * Versão simplificada para produção
 */
export const logger = {
    log: () => {},
    error: (label, error) => console.error(`[PhoneInput] ${label}:`, error),
    warn: (label, message) => console.warn(`[PhoneInput] ${label}:`, message)
}; 