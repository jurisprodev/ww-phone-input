import { ref, computed, watch, nextTick } from 'vue';
import { parsePhoneNumberFromString, formatIncompletePhoneNumber, AsYouType } from 'libphonenumber-js';
import defaultCountries from '../countries';
import { normalizeCountry, prepareCountriesList, getFlagEmoji, cleanPhoneNumber, logger } from '../utils';

export function usePhoneInput(props, emit, wwLib) {
    const inputRef = ref(null);
    const displayValue = ref('');
    const rawValue = ref('');
    
    // Usar o sistema de gerenciamento de variáveis do WeWeb para expor as variáveis
    const { value: variableValue, setValue } = wwLib?.wwVariable?.useComponentVariable({
        uid: props.uid,
        name: 'value',
        defaultValue: props.content.value || '',
    }) || { value: ref(props.content.value || ''), setValue: (val) => { variableValue.value = val; } };

    const { value: variableRawValue, setValue: setRawValue } = wwLib?.wwVariable?.useComponentVariable({
        uid: props.uid,
        name: 'rawValue',
        defaultValue: cleanPhoneNumber(props.content.value) || '',
    }) || { value: ref(cleanPhoneNumber(props.content.value) || ''), setValue: (val) => { variableRawValue.value = val; } };
    
    const isReallyFocused = ref(false);
    const isDebouncing = ref(false);
    
    // Referência para a lista de países (padrão ou customizada)
    const countriesList = computed(() => {
        // Verificar se o conteúdo está definido
        if (!props.content) {
            return defaultCountries;
        }

        // Se o usuário definiu uma lista de países customizada, use-a
        if (props.content.countries && Array.isArray(props.content.countries) && props.content.countries.length > 0) {
            try {
                // Normaliza e filtra a lista de países
                const customCountries = prepareCountriesList(props.content.countries);
                
                if (customCountries.length === 0) {
                    return defaultCountries;
                }
                
                return customCountries;
            } catch (e) {
                return defaultCountries;
            }
        }
        
        // Se não houver lista customizada ou estiver vazia, use a lista padrão
        return defaultCountries;
    });

    // Estado para controlar o dropdown
    const countryDropdownOpen = ref(false);
    
    // Termo de busca para filtrar países
    const searchQuery = ref('');
    
    // Lista de países filtrada pela busca
    const filteredCountries = computed(() => {
        if (!searchQuery.value) {
            return countriesList.value;
        }
        
        const query = searchQuery.value.toLowerCase();
        return countriesList.value.filter(country => 
            country.name.toLowerCase().includes(query) || 
            country.dialCode.includes(query) ||
            country.code.toLowerCase().includes(query)
        );
    });

    // Código do país selecionado
    const selectedCountryCode = ref('');
    
    // Objeto do país selecionado
    const selectedCountry = computed(() => {
        const country = countriesList.value.find(c => c.code === selectedCountryCode.value);
        return country || (countriesList.value.length > 0 ? countriesList.value[0] : { code: '', dialCode: '', format: '', mask: '' });
    });

    // Watch para monitorar mudanças na lista de países
    watch(() => props.content?.countries, (newCountries) => {
        // Se o país selecionado não estiver mais na lista, selecionar o primeiro
        if (selectedCountryCode.value && countriesList.value.length > 0) {
            const exists = countriesList.value.some(c => c.code === selectedCountryCode.value);
            if (!exists) {
                selectedCountryCode.value = countriesList.value[0]?.code || '';
            }
        }
    }, { deep: true });
    
    // Inicializar o país padrão
    if (!selectedCountryCode.value && countriesList.value.length > 0) {
        // Define o país padrão baseado na prioridade ou usa o primeiro da lista
        const defaultCountry = props.content.defaultCountry 
            ? countriesList.value.find(c => c.code === props.content.defaultCountry)
            : countriesList.value.find(c => c.priority === 0) || countriesList.value[0];
            
        if (defaultCountry) {
            selectedCountryCode.value = defaultCountry.code;
        }
    }

    // Função para abrir/fechar o dropdown de países
    function toggleCountryDropdown(event) {
        // Evita que o evento se propague para o documento
        if (event) {
            event.stopPropagation();
        }
        
        countryDropdownOpen.value = !countryDropdownOpen.value;
        
        // Limpa o termo de busca quando abre o dropdown
        if (countryDropdownOpen.value) {
            searchQuery.value = '';
        }
    }

    // Função para selecionar um país
    function selectCountry(countryCode) {
        const previousCountry = selectedCountryCode.value;
        selectedCountryCode.value = countryCode;
        
        // Fechar o dropdown após selecionar
        countryDropdownOpen.value = false;
        
        // Se o país mudou, reformatar o número atual
        if (previousCountry !== countryCode && rawValue.value) {
            formatPhoneNumber();
        }
        
        // Focar no input após selecionar o país
        focusInput();
        
        // Emitir evento de mudança de país
        emit('trigger-event', {
            name: 'countryChange',
            event: { country: countryCode }
        });
    }

    // Função para formatar o número de telefone
    function formatPhoneNumber() {
        if (!rawValue.value) {
            displayValue.value = '';
            setValue('');
            setRawValue('');
            return;
        }
        
        try {
            // Usar AsYouType para formatação incremental
            const formattedNumber = new AsYouType(selectedCountry.value.code).input(`+${selectedCountry.value.dialCode}${rawValue.value}`);
            displayValue.value = formattedNumber;
            
            // Atualizar o valor da variável usando os setters
            setValue(`+${selectedCountry.value.dialCode}${rawValue.value}`);
            setRawValue(rawValue.value);
        } catch (error) {
            // Fallback para formatação básica
            displayValue.value = `+${selectedCountry.value.dialCode} ${rawValue.value}`;
            setValue(`+${selectedCountry.value.dialCode}${rawValue.value}`);
            setRawValue(rawValue.value);
        }
    }

    // Função para lidar com a entrada manual
    function handleManualInput(event) {
        const inputValue = event.target.value;
        
        // Se o valor está vazio, reiniciar tudo
        if (!inputValue) {
            rawValue.value = '';
            displayValue.value = '';
            setValue('');
            setRawValue('');
            
            // Emitir eventos para valor vazio
            emitChange();
            return;
        }
        
        // Limpar o número para conter apenas dígitos
        const digitsOnly = cleanPhoneNumber(inputValue);
        
        // Se começar com o código de discagem do país, remova-o
        const dialCode = selectedCountry.value.dialCode;
        let cleanedNumber = digitsOnly;
        
        if (dialCode && cleanedNumber.startsWith(dialCode)) {
            cleanedNumber = cleanedNumber.substring(dialCode.length);
        }
        
        // Se começar com '+', remova-o também
        if (cleanedNumber.startsWith('+')) {
            cleanedNumber = cleanedNumber.substring(1);
        }
        
        // Limitar ao número máximo de dígitos se definido
        if (selectedCountry.value.maxDigits && cleanedNumber.length > selectedCountry.value.maxDigits) {
            cleanedNumber = cleanedNumber.substring(0, selectedCountry.value.maxDigits);
        }
        
        // Atualizar o valor bruto
        rawValue.value = cleanedNumber;
        
        // Formatar o número
        formatPhoneNumber();
        
        // Emitir eventos para alteração de valor
        emitChange();
    }
    
    // Emitir mudança com debounce
    function emitChange() {
        if (props.content.debounce) {
            // Se já estiver debouncing, cancelar
            if (isDebouncing.value) {
                clearTimeout(isDebouncing.value);
            }
            
            // Iniciar novo debounce
            isDebouncing.value = setTimeout(() => {
                emitChangeEvent();
                isDebouncing.value = false;
            }, props.content.debounceDelay || 300);
        } else {
            // Sem debounce, emitir imediatamente
            emitChangeEvent();
        }
    }
    
    // Emitir eventos de mudança
    function emitChangeEvent() {
        // Criar o evento de mudança
        const phoneData = {
            value: variableValue.value,
            rawValue: variableRawValue.value,
            isValid: true
        };
        
        // Validar o número se necessário
        if (props.content.validatePhoneNumber) {
            try {
                const phoneNumber = parsePhoneNumberFromString(variableValue.value);
                phoneData.isValid = phoneNumber ? phoneNumber.isValid() : false;
            } catch (error) {
                phoneData.isValid = false;
            }
        }
        
        // Emitir evento de mudança
        emit('trigger-event', {
            name: 'change',
            event: phoneData
        });
        
        // Atualizar o valor do content (para integração com editor)
        try {
            emit('update:content:effect', {
                path: 'value',
                value: variableValue.value
            });
        } catch (e) {
            // Ignorar erros silenciosamente
        }
    }
    
    // Lidar com evento de blur (desfoco)
    function onBlur() {
        isReallyFocused.value = false;
        
        // Validar e formatar o número completo
        if (rawValue.value && props.content.validatePhoneNumber) {
            try {
                const phoneNumber = parsePhoneNumberFromString(variableValue.value);
                if (phoneNumber && phoneNumber.isValid()) {
                    // Atualizar com o formato completo
                    displayValue.value = phoneNumber.format('INTERNATIONAL');
                }
            } catch (e) {
                // Ignorar erros de validação silenciosamente
            }
        }
        
        // Emitir evento de blur
        emit('trigger-event', {
            name: 'blur',
            event: null
        });
        
        // Remover estado de foco
        try {
        emit('remove-state', 'focus');
        } catch (e) {
            // Ignorar erros silenciosamente
        }
    }
    
    // Focar no input
    function focusInput() {
        nextTick(() => {
            if (inputRef.value) {
                inputRef.value.focus();
            }
        });
    }
    
    // Função para obter o emoji da bandeira a partir do código do país
    function getFlagEmojiInternal(countryCode) {
        return getFlagEmoji(countryCode);
    }
    
    // Lidar com tecla Enter
    function onEnter() {
        // Emitir evento de tecla Enter
        emit('trigger-event', {
            name: 'onEnterKey',
            event: { 
                value: variableValue.value,
                rawValue: variableRawValue.value
            }
        });
    }

    // Observar mudanças iniciais no valor e atualizar o componente
    watch(
        () => props.content.value,
        (newValue) => {
            if (newValue && typeof newValue === 'string' && newValue !== variableValue.value) {
                try {
                    // Tentar extrair o código do país e número
                    let countryCode = selectedCountryCode.value;
                    let phoneNumber = '';
                    
                    // Se começa com +, tenta extrair o código de discagem
                    if (newValue.startsWith('+')) {
                        // Procurar por um país que corresponda ao código de discagem
                        const dialCode = newValue.substring(1).match(/^\d+/)?.[0] || '';
                        if (dialCode) {
                            // Encontrar país pelo código de discagem
                            const country = countriesList.value.find(c => c.dialCode === dialCode);
                            if (country) {
                                countryCode = country.code;
                                // Extrair apenas o número, sem o código de discagem
                                phoneNumber = newValue.substring(1 + dialCode.length).replace(/\D/g, '');
                            } else {
                                // Não encontrou país, usar o número completo
                                phoneNumber = newValue.substring(1).replace(/\D/g, '');
                            }
                        }
                    } else {
                        // Sem código de país, usar apenas os dígitos
                        phoneNumber = newValue.replace(/\D/g, '');
                    }
                    
                    // Atualizar código do país, se encontrado
                    if (countryCode && countryCode !== selectedCountryCode.value) {
                        selectedCountryCode.value = countryCode;
                    }
                    
                    // Atualizar número
                    rawValue.value = phoneNumber;
                    formatPhoneNumber();
                    
                    // Emitir evento de mudança inicial
                    emit('trigger-event', {
                        name: 'initValueChange',
                        event: {
                            value: variableValue.value,
                            rawValue: variableRawValue.value
                        }
                    });
                } catch (e) {
                    // Ignorar erros silenciosamente
                }
            }
        },
        { immediate: true }
    );

    // Retornar todos os valores e funções necessários
    return {
        inputRef,
        displayValue,
        rawValue,
        variableValue,
        variableRawValue,
        setValue,
        setRawValue,
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
        getFlagEmoji: getFlagEmojiInternal,
        onEnter
    };
}