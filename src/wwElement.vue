<template>
  <div 
    class="ww-phone-input" 
    :class="{
      'readonly': isReadonly,
      'focus': isFocused
    }"
    :style="countryItemCSSVars"
  >
    <div class="ww-phone-input-inner-container" :style="containerStyle">
      <!-- Seletor de país (sempre à esquerda) -->
      <button
        ref="selectorRef"
        type="button"
        class="ww-phone-input-country-selector"
        @click="handleToggleDropdown"
        :style="countrySelectorStyle"
      >
        <div class="selected-country">
          <span class="flag">{{ getFlagEmoji(selectedCountry.code) }}</span>
          <span class="dial-code">+{{ selectedCountry.dialCode }}</span>
        </div>
        
        <!-- Dropdown de países -->
        <div 
          v-if="countryDropdownOpen" 
          class="country-dropdown" 
          :class="{'dropdown-up': dropdownDirection === 'up'}"
          :style="dropdownStyle"
        >
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="searchPlaceholder" 
              @click.stop
              :style="searchInputStyle"
              class="search-input"
            >
          </div>
          <div class="country-list" :style="countryListStyle">
            <div 
              v-for="country in filteredCountries" 
              :key="country.code" 
              class="country-item"
              @click.stop="selectCountry(country.code)"
              :class="{ active: country.code === selectedCountry.code }"
              :style="countryItemStyle"
            >
              <span class="flag">{{ getFlagEmoji(country.code) }}</span>
              <span class="country-name">{{ country.name }}</span>
              <span class="dial-code">+{{ country.dialCode }}</span>
            </div>
          </div>
        </div>
      </button>
      
      <!-- Input de telefone -->
      <input
        ref="inputRef"
        type="tel"
        v-bind="inputBindings"
        class="ww-phone-input-field"
        @input="handleManualInput"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onEnter"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, inject, onMounted } from 'vue';
import { usePhoneInput } from './composables/usePhoneInput';
import countries from './countries';

export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwFrontState: { type: Object, required: true },
    wwEditorState: { type: Object, required: true },
    parentSelection: { type: Object, default: () => ({ allow: false, texts: {} }) },
    /* wwEditor:end */
  },
  emits: [
    'element-event',
    'trigger-event',
    'add-state',
    'remove-state',
    'update:content:effect',
    'update:sidepanel-content',
  ],
  setup(props, { emit }) {
    // Injetar wwLib diretamente
    const wwLib = inject('wwLib', window.wwLib || {});
    
    // Placeholder de busca simples
    const searchPlaceholder = computed(() => {
      try {
        if (wwLib && wwLib.wwLang) {
          return wwLib.wwLang.getText({ en: 'Search', pt: 'Buscar' });
        }
      } catch (e) {
        console.warn('Error getting search placeholder:', e);
      }
      return 'Buscar';
    });

    // Função para lidar com evento de foco
    function onFocus() {
      isReallyFocused.value = true;
      
      // Emitir evento de foco
      emit('trigger-event', {
        name: 'focus',
        event: null
      });
      
      // Adicionar estado
      try {
        emit('add-state', 'focus');
      } catch (e) {
        console.warn('Error adding focus state:', e);
      }
    }

    const {
      inputRef,
      displayValue,
      rawValue,
      variableValue,
      variableRawValue,
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
      onEnter
    } = usePhoneInput(props, emit, wwLib);

    // Injetar hook de formulário se disponível
    const useForm = inject('_wwForm:useForm', () => {});

    // Propriedades para integração com formulário
    const fieldName = computed(() => props.content.fieldName);
    const validation = computed(() => props.content.validation);
    const customValidation = computed(() => props.content.customValidation);
    const required = computed(() => props.content.required);

    // Integração com formulário
    useForm(
      variableValue,
      { 
        fieldName, 
        validation, 
        customValidation, 
        required, 
        initialValue: computed(() => props.content.value) 
      },
      { 
        elementState: props.wwElementState, 
        emit, 
        sidepanelFormPath: 'form', 
        setValue: (v) => variableValue.value = v 
      }
    );

    // Placeholder personalizado
    const placeholder = computed(() => {
      const country = selectedCountry.value;
      
      // Se existe um placeholder definido, usa ele
      if (props.content.placeholder) {
        if (typeof props.content.placeholder === 'string') {
          return props.content.placeholder;
        }
        
        // Multi-idioma
        try {
          if (wwLib && wwLib.wwLang) {
            return wwLib.wwLang.getText(props.content.placeholder);
          }
        } catch (e) {
          // Fallback
          const keys = Object.keys(props.content.placeholder);
          if (keys.length > 0) {
            return props.content.placeholder[keys[0]];
          }
        }
      }
      
      // Fallback para o placeholder padrão do país
      return country.format || 'Digite seu telefone';
    });

    // Estado de somente leitura
    const isReadonly = computed(() => {
      /* wwEditor:start */
      if (props.wwEditorState?.isSelected) {
        return props.wwElementState.states.includes('readonly');
      }
      /* wwEditor:end */
      return props.wwElementState.props.readonly === undefined
          ? props.content.readonly
          : props.wwElementState.props.readonly;
    });

    // Estado de foco
    const isFocused = computed(() => {
      /* wwEditor:start */
      if (props.wwEditorState?.isSelected) {
        return props.wwElementState.states.includes('focus');
      }
      /* wwEditor:end */
      return isReallyFocused.value;
    });

    // Observar mudanças no estado readonly
    watch(
      () => props.content.readonly,
      value => {
        try {
          if (value) {
            emit('add-state', 'readonly');
          } else {
            emit('remove-state', 'readonly');
          }
        } catch (e) {
          console.warn('Error updating readonly state:', e);
        }
      },
      { immediate: true }
    );

    // Obter estilos de texto do content de forma segura
    const textStyles = computed(() => {
      try {
        if (wwLib && wwLib.wwUtils) {
          return wwLib.wwUtils.getTextStyleFromContent(props.content);
        }
      } catch (e) {
        console.warn('Error getting text styles:', e);
      }
      return {};
    });

    // Aplicar estilos a todos os elementos
    const containerStyle = computed(() => {
      return {
        ...textStyles.value,
      };
    });

    const countrySelectorStyle = computed(() => {
      return {
        ...textStyles.value,
        backgroundColor: props.content.selectorBackgroundColor || 'rgba(0, 0, 0, 0.03)',
        color: props.content.selectorTextColor || textStyles.value.color || 'inherit',
      };
    });

    const dropdownStyle = computed(() => {
      // Aplicar valores com fallbacks seguros
      const borderWidth = props.content.dropdownBorderWidth || '1px';
      const borderColor = props.content.dropdownBorderColor || 'rgba(0, 0, 0, 0.1)';
      const borderRadius = props.content.dropdownBorderRadius || '4px';
      const bgColor = props.content.dropdownBackgroundColor || 'white';
      
      return {
        backgroundColor: bgColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: borderRadius,
      };
    });

    const searchInputStyle = computed(() => {
      return {
        ...textStyles.value,
        fontSize: '14px',
        color: props.content.searchInputTextColor || textStyles.value.color || 'inherit',
        backgroundColor: props.content.searchInputBackgroundColor || 'white',
        border: `1px solid ${props.content.searchInputBorderColor || 'rgba(0, 0, 0, 0.1)'}`,
        borderRadius: props.content.searchInputBorderRadius || '4px',
        '--placeholder-color': props.content.placeholderColor || '#888',
      };
    });

    const countryItemStyle = computed(() => {
      return {
        ...textStyles.value,
        fontSize: '14px',
        color: props.content.countryItemTextColor || textStyles.value.color || 'inherit',
      };
    });

    // Estilos extras CSS para itens de país
    const countryItemCSSVars = computed(() => {
      return {
        '--country-item-active-bg': props.content.countryItemActiveBackground || 'rgba(0, 0, 0, 0.1)',
        '--country-item-hover-bg': props.content.countryItemHoverBackground || 'rgba(0, 0, 0, 0.05)',
      };
    });

    // Bindings para o input
    const inputBindings = computed(() => ({
      value: displayValue.value,
      type: 'tel',
      name: props.wwElementState.name || '',
      readonly: isReadonly.value,
      required: props.content.required,
      autocomplete: props.content.autocomplete ? 'on' : 'off',
      placeholder: placeholder.value,
      style: {
        ...textStyles.value,
        '--placeholder-color': props.content.placeholderColor || '#888',
      },
    }));

    // Referência para o botão seletor de país
    const selectorRef = ref(null);
    // Direção do dropdown (up ou down)
    const dropdownDirection = ref('down');
    
    // Função para verificar se o dropdown deve aparecer para cima ou para baixo
    function calculateDropdownDirection() {
      if (!selectorRef.value) return 'down';
      
      const rect = selectorRef.value.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // Se o espaço abaixo for menor que 300px, exibir para cima
      if (spaceBelow < 300) {
        return 'up';
      } else {
        return 'down';
      }
    }
    
    // Wrapper para toggleCountryDropdown que também calcula a direção
    function handleToggleDropdown(event) {
      if (isReadonly.value) return;
      
      if (!countryDropdownOpen.value) {
        // Ao abrir o dropdown, calcular a direção
        dropdownDirection.value = calculateDropdownDirection();
      }
      
      // Usar a função original do composable
      toggleCountryDropdown(event);
    }

    // Estilo da lista de países
    const countryListStyle = computed(() => {
      return {
        maxHeight: props.content.countryListHeight ? `${props.content.countryListHeight}px` : '280px'
      };
    });

    onMounted(() => {
      // Fechar dropdown quando clicar fora
      document.addEventListener('click', event => {
        if (countryDropdownOpen.value) {
          const dropdown = document.querySelector('.ww-phone-input .country-dropdown');
          const selector = document.querySelector('.ww-phone-input .ww-phone-input-country-selector');
          
          if (dropdown && selector && 
              !dropdown.contains(event.target) && 
              !selector.contains(event.target)) {
            countryDropdownOpen.value = false;
          }
        }
      });
    });

    return {
      inputRef,
      displayValue,
      isReallyFocused,
      isReadonly,
      isFocused,
      selectedCountry,
      countryDropdownOpen,
      searchQuery,
      filteredCountries,
      handleManualInput,
      selectCountry,
      toggleCountryDropdown: handleToggleDropdown,
      handleToggleDropdown,
      onBlur,
      onFocus,
      focusInput,
      getFlagEmoji,
      onEnter,
      inputBindings,
      placeholder,
      containerStyle,
      countrySelectorStyle,
      dropdownStyle,
      searchInputStyle,
      countryItemStyle,
      searchPlaceholder,
      selectorRef,
      dropdownDirection,
      countryListStyle,
      countryItemCSSVars,
    };
  },
};
</script>

<style lang="scss" scoped>
.ww-phone-input {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 40px;
  border-radius: 8px;
  transition: all 0.3s;
  overflow: visible;
  z-index: 1;
}

.ww-phone-input:hover,
.ww-phone-input.focus {
  z-index: 10;
}

.ww-phone-input-inner-container {
  display: flex;
  flex-grow: 1;
  position: relative;
  height: 100%;
  overflow: visible;
}

.ww-phone-input.focus .ww-phone-input-inner-container {
  border-color: rgba(0, 0, 0, 0.3);
}

.ww-phone-input.readonly {
  opacity: 0.7;
  cursor: not-allowed;
}

.ww-phone-input-country-selector {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  z-index: 2;
}

.ww-phone-input-country-selector:hover,
.ww-phone-input-country-selector:focus {
  background-color: rgba(0, 0, 0, 0.05);
}

.selected-country {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 100%;
  gap: 4px;
}

.flag {
  font-size: 1.2em;
  margin-right: 4px;
}

.dial-code {
  font-size: 0.9em;
  opacity: 0.8;
}

.country-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 280px;
  /* Remover estilos padrão que podem estar sobrescrevendo as propriedades dinâmicas */
  /* background-color: white; */
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  /* border-radius: 8px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 350px;
  z-index: 999;
  margin-top: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.country-dropdown.dropdown-up {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 5px;
}

.search-container {
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 8px;
  /* Remover estilos fixos que serão aplicados dinamicamente */
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
  /* border-radius: 4px; */
  font-family: inherit;
  outline: none;
}

.search-input:focus {
  border-color: rgba(0, 0, 0, 0.3);
}

.search-container input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.country-list {
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 5px 0;
  overscroll-behavior: contain;
  flex: 1;
}

.country-list::-webkit-scrollbar {
  width: 6px;
}

.country-list::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
  border-radius: 3px;
}

.country-list::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}

.country-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 40px;
}

.country-item:hover {
  background-color: var(--country-item-hover-bg, rgba(0, 0, 0, 0.05));
}

.country-item.active {
  background-color: var(--country-item-active-bg, rgba(0, 0, 0, 0.1));
}

.country-name {
  flex: 1;
}

.dial-code {
  opacity: 0.7;
}

.ww-phone-input-field {
  flex: 1;
  padding-top: v-bind('content.textPaddingY || "8px"');
  padding-bottom: v-bind('content.textPaddingY || "8px"');
  padding-left: v-bind('content.textPaddingX || "12px"');
  padding-right: v-bind('content.textPaddingX || "12px"');
  border: none;
  outline: none;
  min-width: 0;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;
}

.ww-phone-input-field::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

@media screen and (max-width: 480px) {
  .country-dropdown {
    min-width: 100%;
    left: 0;
    right: 0;
    max-height: 50vh;
  }
  
  .country-list {
    max-height: 40vh;
  }
}
</style>