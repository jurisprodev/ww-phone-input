export default {
  inherit: {
      type: 'ww-text',
      exclude: ['text'],
  },
  editor: {
      label: { en: 'Phone Input', pt: 'Input de Telefone' },
      icon: 'phone',
      customSettingsPropertiesOrder: [
          'formInfobox',
          ['fieldName', 'customValidation', 'validation'],
          'defaultCountry',
          'value',
          'placeholder',
          'readonly',
          'required',
          'autocomplete',
          'validatePhoneNumber',
          'debounce',
          'debounceDelay',
      ],
      customStylePropertiesOrder: [
          'placeholderColor',
          ['selectorBackgroundColor', 'selectorTextColor'],
          ['dropdownBackgroundColor', 'dropdownBorderWidth', 'dropdownBorderColor', 'dropdownBorderRadius'],
          ['searchInputBackgroundColor', 'searchInputBorderColor', 'searchInputBorderRadius', 'searchInputTextColor'],
          ['countryItemTextColor', 'countryItemActiveBackground', 'countryItemHoverBackground'],
          ['countrySelectorWidth', 'countryListHeight'],
          'textPaddingX',
          'textPaddingY',
      ],
  },
  states: ['focus', 'readonly'],
  actions: [{ label: 'Focus element', action: 'focusInput' }],
  triggerEvents: [
      { name: 'change', label: { en: 'On change' }, event: { value: '', rawValue: '', isValid: true }, default: true },
      { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '', rawValue: '' } },
      { name: 'onEnterKey', label: { en: 'On enter key' }, event: { value: '', rawValue: '' } },
      { name: 'focus', label: { en: 'On focus' }, event: null },
      { name: 'blur', label: { en: 'On blur' }, event: null },
      { name: 'countryChange', label: { en: 'On country change', pt: 'Ao mudar país' }, event: { country: '' } },
  ],
  properties: {
      placeholderColor: {
          label: {
              en: 'Placeholder color',
              pt: 'Cor do placeholder',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: '#888888',
      },
      selectorBackgroundColor: {
          label: {
              en: 'Selector background',
              pt: 'Fundo do seletor',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'rgba(0, 0, 0, 0.03)',
      },
      selectorTextColor: {
          label: {
              en: 'Selector text color',
              pt: 'Cor do texto do seletor',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: null,
      },
      dropdownBackgroundColor: {
          label: {
              en: 'Dropdown background',
              pt: 'Fundo do dropdown',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'white',
      },
      dropdownBorderWidth: {
          label: {
              en: 'Dropdown border width',
              pt: 'Espessura da borda',
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 0, max: 10 },
              ],
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: '1px',
      },
      dropdownBorderColor: {
          label: {
              en: 'Dropdown border color',
              pt: 'Cor da borda',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'rgba(0, 0, 0, 0.1)',
      },
      dropdownBorderRadius: {
          label: {
              en: 'Dropdown radius',
              pt: 'Raio do dropdown',
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 0, max: 20 },
              ],
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: '4px',
      },
      searchInputBackgroundColor: {
          label: {
              en: 'Search background',
              pt: 'Fundo da busca',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'white',
      },
      searchInputBorderColor: {
          label: {
              en: 'Search border color',
              pt: 'Cor da borda da busca',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'rgba(0, 0, 0, 0.1)',
      },
      searchInputBorderRadius: {
          label: {
              en: 'Search border radius',
              pt: 'Raio da borda da busca',
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 0, max: 20 },
              ],
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: '4px',
      },
      searchInputTextColor: {
          label: {
              en: 'Search text color',
              pt: 'Cor do texto de busca',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: null,
      },
      countryItemTextColor: {
          label: {
              en: 'Country item color',
              pt: 'Cor do item de país',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: null,
      },
      countryItemActiveBackground: {
          label: {
              en: 'Selected item background',
              pt: 'Fundo do item selecionado',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'rgba(0, 0, 0, 0.1)',
      },
      countryItemHoverBackground: {
          label: {
              en: 'Hover item background',
              pt: 'Fundo do item em hover',
          },
          type: 'Color',
          options: {
              nullable: true,
          },
          bindable: true,
          responsive: true,
          states: true,
          defaultValue: 'rgba(0, 0, 0, 0.05)',
      },
      value: {
          label: {
              en: 'Init value',
              pt: 'Valor inicial',
          },
          type: 'Text',
          section: 'settings',
          bindable: true,
          defaultValue: '',
      },
      defaultCountry: {
          label: { 
              en: 'Default country', 
              pt: 'País padrão' 
          },
          type: 'TextSelect',
          section: 'settings',
          options: {
              options: [
                  { value: 'BR', label: 'Brasil (+55)' },
                  { value: 'US', label: 'Estados Unidos (+1)' },
                  { value: 'PT', label: 'Portugal (+351)' },
                  { value: 'AR', label: 'Argentina (+54)' },
                  { value: 'UY', label: 'Uruguai (+598)' },
                  { value: 'CO', label: 'Colômbia (+57)' },
                  { value: 'MX', label: 'México (+52)' },
                  { value: 'ES', label: 'Espanha (+34)' },
                  { value: 'IT', label: 'Itália (+39)' },
                  { value: 'FR', label: 'França (+33)' },
                  { value: 'DE', label: 'Alemanha (+49)' },
                  { value: 'GB', label: 'Reino Unido (+44)' },
              ],
          },
          defaultValue: 'BR',
          bindable: true,
      },
      countrySelectorWidth: {
          label: { 
              en: 'Selector width', 
              pt: 'Largura do seletor' 
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 40, max: 120 },
              ],
          },
          defaultValue: '70px',
          responsive: true,
      },
      countryListHeight: {
          label: { 
              en: 'Country list height', 
              pt: 'Altura da lista de países' 
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 100, max: 400 },
              ],
          },
          defaultValue: '250px',
          responsive: true,
      },
      textPaddingX: {
          label: { 
              en: 'Text field padding X', 
              pt: 'Padding horizontal do texto' 
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 0, max: 40 },
                  { value: 'em', label: 'em', min: 0, max: 5 },
                  { value: 'rem', label: 'rem', min: 0, max: 5 },
              ],
          },
          section: 'style',
          responsive: true,
          states: true,
          defaultValue: '12px',
      },
      textPaddingY: {
          label: { 
              en: 'Text field padding Y', 
              pt: 'Padding vertical do texto' 
          },
          type: 'Length',
          options: {
              unitChoices: [
                  { value: 'px', label: 'px', min: 0, max: 40 },
                  { value: 'em', label: 'em', min: 0, max: 5 },
                  { value: 'rem', label: 'rem', min: 0, max: 5 },
              ],
          },
          section: 'style',
          responsive: true,
          states: true,
          defaultValue: '8px',
      },
      placeholder: {
          label: { en: 'Placeholder', pt: 'Placeholder' },
          type: 'Text',
          options: { placeholder: 'Digite seu telefone' },
          section: 'settings',
          multiLang: true,
          bindable: true,
          defaultValue: {},
      },
      readonly: {
          label: { en: 'Read only', pt: 'Somente leitura' },
          type: 'OnOff',
          section: 'settings',
          bindable: true,
          defaultValue: false,
          hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.readonly !== undefined),
      },
      required: {
          label: { en: 'Required', pt: 'Obrigatório' },
          type: 'OnOff',
          section: 'settings',
          defaultValue: true,
          bindable: true,
      },
      validatePhoneNumber: {
          label: { en: 'Validate number', pt: 'Validar número' },
          type: 'OnOff',
          section: 'settings',
          defaultValue: false,
          bindable: true,
      },
      debounce: {
          label: { en: 'Debounce', pt: 'Debounce' },
          type: 'OnOff',
          section: 'settings',
          defaultValue: false,
      },
      debounceDelay: {
          type: 'Length',
          label: {
              en: 'Delay',
              pt: 'Atraso',
          },
          options: {
              unitChoices: [{ value: 'ms', label: 'ms', min: 1, max: 5000 }],
          },
          section: 'settings',
          defaultValue: '500ms',
          responsive: true,
          hidden: content => !content.debounce,
      },
      autocomplete: {
          label: { en: 'Autocomplete', pt: 'Autocompletar' },
          type: 'OnOff',
          section: 'settings',
          defaultValue: false,
          bindable: true,
      },
      fieldName: {
          label: { en: 'Field name', pt: 'Nome do campo' },
          section: 'settings',
          type: 'Text',
          defaultValue: '',
          bindable: true,
          hidden: (_, sidePanelContent) => {
              return !sidePanelContent.form?.uid;
          },
      },
      customValidation: {
          label: { en: 'Custom validation', pt: 'Validação personalizada' },
          section: 'settings',
          type: 'OnOff',
          defaultValue: false,
          bindable: true,
          hidden: (_, sidePanelContent) => {
              return !sidePanelContent.form?.uid;
          },
      },
      validation: {
          label: { en: 'Validation', pt: 'Validação' },
          section: 'settings',
          type: 'Formula',
          defaultValue: '',
          bindable: true,
          hidden: (content, sidePanelContent) => {
              return !sidePanelContent.form?.uid || !content.customValidation;
          },
      },
  },
};