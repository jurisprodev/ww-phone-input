import { computed, ref, watch } from 'vue';
import countries from '../countries';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';

export function usePhoneInput(props, emit, wwLib) {
    // Criar referência local para wwLib se não for fornecido
    const wwLibRef = wwLib || (typeof window !== 'undefined' ? window.wwLib : {});
    
    // Estado local
    const isReallyFocused = ref(false);
    const isDebouncing = ref(false);
    const inputRef = ref(null);
    const countryDropdownOpen = ref(false);
    const searchQuery = ref('');
    const selectedCountryCode = ref(props.content.defaultCountry || 'BR');
    let debounceTimeout = null;

    // Valor exibido no input (formato local)
    const displayValue = ref('');
    
    // Valor bruto (apenas dígitos)
    const rawValue = ref('');

    // Países filtrados pela busca
    const filteredCountries = computed(() => {
        if (!searchQuery.value) return countries;
        
        const query = searchQuery.value.toLowerCase();
        return countries.filter(country => 
            country.name.toLowerCase().includes(query) || 
            country.dialCode.includes(query) ||
            country.code.toLowerCase().includes(query)
        );
    });

    // País selecionado
    const selectedCountry = computed(() => {
        return countries.find(country => country.code === selectedCountryCode.value) || 
               countries.find(country => country.code === 'BR');
    });

    // Obter o limite máximo de caracteres para o país atual
    function getMaxLengthForCountry(countryCode) {
        const country = countries.find(c => c.code === countryCode) || 
                      countries.find(c => c.code === 'BR');
        
        // Verificar se há uma propriedade maxDigits definida
        if (country.maxDigits) {
            return country.maxDigits;
        }
        
        // Caso contrário, calcular com base no formato do país
        if (country.format) {
            // Contar quantos caracteres '#' existem no formato
            const placeholders = (country.format.match(/#/g) || []).length;
            return placeholders;
        }
        
        // Valores padrão por país se não houver informação
        switch (countryCode) {
            case 'BR': return 11; // DDD (2) + número celular (9)
            case 'US': return 10; // Código de área (3) + número (7)
            case 'PT': return 9;  // Típico para Portugal
            default: return 15;   // Valor genérico seguro
        }
    }

    // Formatar o número de telefone baseado no país usando libphonenumber-js ou formatação personalizada
    function formatPhoneNumber(value, countryCode) {
        if (!value) return '';
        
        // Remover tudo exceto números
        const numbers = value.replace(/\D/g, '');
        
        const country = countries.find(c => c.code === countryCode) || 
                       countries.find(c => c.code === 'BR');
        
        // Se não tiver números, retorne string vazia
        if (!numbers) return '';

        // Limitar a quantidade de dígitos ao máximo permitido para o país
        const maxLength = getMaxLengthForCountry(countryCode);
        const limitedNumbers = numbers.substring(0, maxLength);
        
        try {
            // Tentar usar libphonenumber-js para formatação
            const phoneNumber = parsePhoneNumberFromString(`+${country.dialCode}${limitedNumbers}`, country.code);
            
            if (phoneNumber) {
                // Determinar o formato com base nas configurações
                const format = props.content.phoneDisplayFormat === 'international' ? 'INTERNATIONAL' : 'NATIONAL';
                return phoneNumber.format(format);
            }
        } catch (error) {
            console.warn('Error formatting phone number:', error);
        }
        
        // Fallback para formatação personalizada baseada no país
        // Isso será usado quando libphonenumber-js não formatar corretamente
        switch (country.code) {
            case 'BR':
                // Formato: (DD) NNNNN-NNNN
                let formattedBr = '';
                if (limitedNumbers.length > 0) {
                    formattedBr += '(';
                    if (limitedNumbers.length > 0) {
                        formattedBr += limitedNumbers.substring(0, Math.min(2, limitedNumbers.length));
                    }
                    if (limitedNumbers.length > 2) {
                        formattedBr += ') ';
                        formattedBr += limitedNumbers.substring(2, Math.min(7, limitedNumbers.length));
                    }
                    if (limitedNumbers.length > 7) {
                        formattedBr += '-';
                        formattedBr += limitedNumbers.substring(7);
                    }
                }
                return formattedBr;
                
            case 'US':
                // Formato: (XXX) XXX-XXXX
                let formattedUs = '';
                if (limitedNumbers.length > 0) {
                    formattedUs += '(';
                    if (limitedNumbers.length > 0) {
                        formattedUs += limitedNumbers.substring(0, Math.min(3, limitedNumbers.length));
                    }
                    if (limitedNumbers.length > 3) {
                        formattedUs += ') ';
                        formattedUs += limitedNumbers.substring(3, Math.min(6, limitedNumbers.length));
                    }
                    if (limitedNumbers.length > 6) {
                        formattedUs += '-';
                        formattedUs += limitedNumbers.substring(6);
                    }
                }
                return formattedUs;
                
            default:
                // Usar o formato definido no país
                if (!country || !country.format) return limitedNumbers;
                
                let formatted = country.format.replace(/\+\d+\s/, ''); // Remove o prefixo +XX do formato
                let numIndex = 0;
                
                // Substituir '#' pelo número correspondente no formato
                for (let i = 0; i < formatted.length && numIndex < limitedNumbers.length; i++) {
                    if (formatted[i] === '#') {
                        formatted = formatted.substring(0, i) + limitedNumbers[numIndex] + formatted.substring(i + 1);
                        numIndex++;
                    }
                }
                
                // Remover os # restantes que não foram substituídos
                formatted = formatted.replace(/#/g, '');
                
                return formatted;
        }
    }

    // Extrair apenas os números do telefone
    function extractNumbers(value) {
        return value ? value.replace(/\D/g, '') : '';
    }

    // Função segura para usar a API de variáveis do WeWeb
    function createComponentVariable(name, defaultValue) {
        try {
            if (wwLibRef && wwLibRef.wwVariable && wwLibRef.wwVariable.useComponentVariable) {
                return wwLibRef.wwVariable.useComponentVariable({
                    uid: props.uid,
                    name: name,
                    defaultValue: defaultValue || '',
                });
            }
        } catch (e) {
            console.warn(`Error creating component variable ${name}:`, e);
        }
        
        // Fallback: criar uma variável simples se a API não estiver disponível
        const value = ref(defaultValue || '');
        return {
            value,
            setValue: (newValue) => { value.value = newValue; }
        };
    }

    // Variáveis do componente
    const { value: variableValue, setValue } = createComponentVariable(
        'value', 
        props.content.value || ''
    );

    // Também criar uma variável para o valor bruto (DDI + números)
    const { value: variableRawValue, setValue: setRawValue } = createComponentVariable(
        'rawValue', 
        selectedCountry.value ? (selectedCountry.value.dialCode + extractNumbers(props.content.value)) : extractNumbers(props.content.value) || ''
    );

    // Inicializar valores
    watch(
        () => props.content.value,
        newValue => {
            if (!isReallyFocused.value) {
                // Extrair apenas os números
                const numbers = extractNumbers(newValue);
                rawValue.value = numbers;
                
                // Formatar os números de acordo com o país
                displayValue.value = formatPhoneNumber(numbers, selectedCountryCode.value);
                
                // Atualizar variáveis
                variableValue.value = getOutputValue(numbers);
                // Incluir o DDI no rawValue
                setRawValue(selectedCountry.value.dialCode + numbers);
            }
        },
        { immediate: true }
    );

    // Observar mudanças no país selecionado
    watch(
        selectedCountryCode,
        (newCode, oldCode) => {
            if (newCode !== oldCode) {
                // Reformatar o número de acordo com o novo país
                displayValue.value = formatPhoneNumber(rawValue.value, newCode);
                
                // Atualizar o valor de saída
                variableValue.value = getOutputValue(rawValue.value);
                
                // Atualizar variável bruta com novo DDI
                const country = countries.find(c => c.code === newCode) || 
                              countries.find(c => c.code === 'BR');
                setRawValue(country.dialCode + rawValue.value);
                
                // Emitir evento de mudança de país
                emit('trigger-event', {
                    name: 'countryChange',
                    event: { country: newCode }
                });
            }
        }
    );

    // Observar mudanças no formato de exibição
    watch(
        () => props.content.phoneDisplayFormat,
        () => {
            if (!isReallyFocused.value) {
                displayValue.value = formatPhoneNumber(rawValue.value, selectedCountryCode.value);
            }
        }
    );

    // Validar número de telefone usando libphonenumber-js
    function validatePhoneNumber(number, countryCode) {
        if (!number || number.length < 3) return false;
        
        const country = countries.find(c => c.code === countryCode);
        if (!country) return false;
        
        try {
            // Tentar validar usando libphonenumber-js
            return isValidPhoneNumber(`+${country.dialCode}${number}`, country.code);
        } catch (error) {
            console.warn('Error validating phone number:', error);
            
            // Validação básica de fallback
            if (countryCode === 'BR') {
                return number.length >= 10 && number.length <= 11;
            }
            
            // Verificar pelo tamanho do formato
            const expectedLength = getMaxLengthForCountry(countryCode);
            return number.length >= expectedLength * 0.8; // 80% do comprimento esperado
        }
    }

    // Obter o valor formatado no formato de saída selecionado
    function getOutputValue(numbers) {
        if (!numbers) return '';
        
        const country = selectedCountry.value;
        
        // Sempre retornar o valor no formato internacional com código do país
        const nationalFormat = formatPhoneNumber(numbers, selectedCountryCode.value);
        return `+${country.dialCode} ${nationalFormat}`;
    }

    // Função segura para obter comprimento a partir de uma string
    function getLengthValue(lengthStr, defaultValue = 500) {
        try {
            if (wwLibRef && wwLibRef.wwUtils && wwLibRef.wwUtils.getLengthUnit) {
                return wwLibRef.wwUtils.getLengthUnit(lengthStr)[0];
            }
        } catch (e) {
            console.warn('Error getting length value:', e);
        }
        return defaultValue;
    }

    function handleManualInput(event) {
        if (props.content.readonly) return;
        
        // Obter valor do input
        const inputValue = event.target.value;
        
        // Extrair apenas os números (limitar a entrada a dígitos)
        const numbers = extractNumbers(inputValue);
        
        // Limitar a quantidade de caracteres ao máximo permitido para o país
        const maxLength = getMaxLengthForCountry(selectedCountryCode.value);
        const limitedNumbers = numbers.substring(0, maxLength);
        
        // Atualizar o valor bruto
        rawValue.value = limitedNumbers;
        
        // Atualizar display com formatação
        displayValue.value = formatPhoneNumber(limitedNumbers, selectedCountryCode.value);
        
        // Verificar validade se necessário
        const isValid = props.content.validatePhoneNumber ? 
                       validatePhoneNumber(limitedNumbers, selectedCountryCode.value) : 
                       true;
        
        // Obter valor formatado no formato de saída desejado
        const outputValue = getOutputValue(limitedNumbers);
        
        // Atualizar valores
        setValue(outputValue);
        // Incluir o DDI no rawValue
        setRawValue(selectedCountry.value.dialCode + limitedNumbers);
        
        // Emitir eventos
        if (props.content.debounce) {
            isDebouncing.value = true;
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
            
            const delay = getLengthValue(props.content.debounceDelay, 500);
            
            debounceTimeout = setTimeout(() => {
                emit('trigger-event', {
                    name: 'change',
                    event: { 
                        domEvent: event, 
                        value: outputValue,
                        rawValue: selectedCountry.value.dialCode + limitedNumbers,
                        isValid
                    }
                });
                isDebouncing.value = false;
            }, delay);
        } else {
            emit('trigger-event', {
                name: 'change',
                event: { 
                    domEvent: event, 
                    value: outputValue,
                    rawValue: selectedCountry.value.dialCode + limitedNumbers,
                    isValid
                }
            });
        }
    }

    function selectCountry(countryCode) {
        if (props.content.readonly) return;
        
        selectedCountryCode.value = countryCode;
        countryDropdownOpen.value = false;
        
        // Reformatar o número atual com o novo país
        displayValue.value = formatPhoneNumber(rawValue.value, countryCode);
        
        // Atualizar o valor de saída
        variableValue.value = getOutputValue(rawValue.value);
        
        // Atualizar variável bruta com novo DDI
        const country = countries.find(c => c.code === countryCode) || 
                      countries.find(c => c.code === 'BR');
        setRawValue(country.dialCode + rawValue.value);
    }

    function toggleCountryDropdown(event) {
        if (props.content.readonly) return;
        
        // Impedir que o evento se propague para fechar o dropdown logo após abrir
        event.stopPropagation();
        countryDropdownOpen.value = !countryDropdownOpen.value;
        
        // Limpar a busca ao abrir o dropdown
        if (countryDropdownOpen.value) {
            searchQuery.value = '';
        }
    }

    function onBlur() {
        isReallyFocused.value = false;
        
        // Permitir um pequeno atraso para que o clique no dropdown seja processado antes
        setTimeout(() => {
            countryDropdownOpen.value = false;
        }, 100);
        
        // Emitir evento de blur
        emit('trigger-event', {
            name: 'blur',
            event: null
        });
        
        // Também remover o estado de foco
        try {
            emit('remove-state', 'focus');
        } catch (e) {
            console.warn('Error removing focus state:', e);
        }
    }

    function getFlagEmoji(countryCode) {
        if (!countryCode) return '🏳️';
        
        // Conversão de código de país para emoji de bandeira (Regional Indicator Symbol)
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        
        return String.fromCodePoint(...codePoints);
    }

    function focusInput() {
        if (inputRef.value) {
            inputRef.value.focus();
            isReallyFocused.value = true;
            
            // Também emitir evento de foco
            emit('trigger-event', {
                name: 'focus',
                event: null
            });
        }
    }

    function onEnter(event) {
        if (props.content.readonly) return;
        
        emit('trigger-event', {
            name: 'onEnterKey',
            event: { 
                domEvent: event, 
                value: variableValue.value,
                rawValue: variableRawValue.value
            }
        });
    }

    return {
        inputRef,
        displayValue,
        variableValue,
        variableRawValue,
        rawValue,
        isReallyFocused,
        isDebouncing,
        selectedCountry,
        selectedCountryCode,
        countryDropdownOpen,
        searchQuery,
        filteredCountries,
        handleManualInput,
        selectCountry,
        toggleCountryDropdown,
        onBlur,
        focusInput,
        getFlagEmoji,
        onEnter,
        validatePhoneNumber
    };
}