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
          'countries',
          'mappingCode',
          'mappingName',
          'mappingDialCode',
          'mappingFormat',
          'mappingMask',
          'mappingMaxDigits',
          'mappingFlag',
          'useCustomImages',
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
      countries: {
          label: {
              en: 'Countries List',
              pt: 'Lista de Países'
          },
          type: 'ObjectList',
          options: {
              useSchema: true,
              item: {
                  type: 'Object',
                  options: {
                      item: {
                          code: {
                              type: 'Text',
                              label: { en: 'Country Code', pt: 'Código do País' },
                              defaultValue: '',
                              required: true,
                          },
                          name: {
                              type: 'Text',
                              label: { en: 'Country Name', pt: 'Nome do País' },
                              defaultValue: '',
                              required: true,
                          },
                          dialCode: {
                              type: 'Text',
                              label: { en: 'Dial Code', pt: 'Código de Discagem' },
                              defaultValue: '',
                              required: true,
                          },
                          format: {
                              type: 'Text',
                              label: { en: 'Format', pt: 'Formato' },
                              defaultValue: '',
                          },
                          mask: {
                              type: 'Text',
                              label: { en: 'Mask', pt: 'Máscara' },
                              defaultValue: '',
                          },
                          maxDigits: {
                              type: 'Number',
                              label: { en: 'Max Digits', pt: 'Máximo de Dígitos' },
                              defaultValue: 0,
                          },
                          priority: {
                              type: 'Number',
                              label: { en: 'Priority', pt: 'Prioridade' },
                              defaultValue: 0,
                          },
                          flag: {
                              type: 'Text',
                              label: { en: 'Flag URL', pt: 'URL da Bandeira' },
                              defaultValue: '',
                              hidden: content => !content.useCustomImages,
                          },
                      }
                  }
              }
          },
          bindable: true,
          defaultValue: null,
          bindingValidation: {
              validations: [
                  {
                      type: 'array',
                  },
                  {
                      type: 'object',
                  },
              ],
              tooltip: 'A collection or an array of data: \n\n`myCollection` or `[{code: "BR", name: "Brasil", dialCode: "55"}, ...]`',
          },
          section: 'settings',
          propertyHelp: {
              tooltip: 'Personalize a lista de países disponíveis para seleção. Cada item deve incluir código do país (ex: BR), nome e código de discagem (ex: 55).',
          },
      },
      useCustomImages: {
          label: {
              en: 'Use custom flag images',
              pt: 'Usar imagens de bandeira personalizadas'
          },
          type: 'OnOff',
          bindable: true,
          defaultValue: false,
          section: 'settings',
      },
      mappingCode: {
          label: { 
              en: 'Country code per item',
              pt: 'Código do país por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['code']",
          },
          propertyHelp: {
              tooltip:
                  'The country code (ISO 2-letter code, e.g. BR, US). This will be executed for each item in the countries list.',
          },
          section: 'settings',
          hidden: content => !content.countries,
      },
      mappingName: {
          label: { 
              en: 'Country name per item',
              pt: 'Nome do país por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['name']",
          },
          propertyHelp: {
              tooltip:
                  'The country name (e.g. Brasil, Estados Unidos). This will be executed for each item in the countries list.',
          },
          section: 'settings',
          hidden: content => !content.countries,
      },
      mappingDialCode: {
          label: { 
              en: 'Dial code per item',
              pt: 'Código de discagem por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['dialCode']",
          },
          propertyHelp: {
              tooltip:
                  'The country dial code (e.g. 55, 1). This will be executed for each item in the countries list.',
          },
          section: 'settings',
          hidden: content => !content.countries,
      },
      mappingFormat: {
          label: { 
              en: 'Format per item',
              pt: 'Formato por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['format']",
          },
          propertyHelp: {
              tooltip:
                  'The phone number format (e.g. +## (##) #####-####). This will be executed for each item in the countries list.',
          },
          section: 'settings',
          hidden: content => !content.countries,
      },
      mappingMask: {
          label: { 
              en: 'Mask per item',
              pt: 'Máscara por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['mask']",
          },
          propertyHelp: {
              tooltip:
                  'The phone number mask (e.g. +00 (00) 00000-0000). This will be executed for each item in the countries list.',
          },
          section: 'settings',
          hidden: content => !content.countries,
      },
      mappingMaxDigits: {
          label: { 
              en: 'Max digits per item',
              pt: 'Dígitos máximos por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['maxDigits']",
          },
          propertyHelp: {
              tooltip:
                  'The maximum number of digits for the phone number (e.g. 11). This will be executed for each item in the countries list.',
          },
          section: 'settings',
          hidden: content => !content.countries,
      },
      mappingFlag: {
          label: { 
              en: 'Flag image per item',
              pt: 'Imagem da bandeira por item'
          },
          type: 'Formula',
          options: content => ({
              template: Array.isArray(content.countries) ? content.countries[0] : null,
          }),
          defaultValue: {
              type: 'f',
              code: "context.mapping?.['flag']",
          },
          propertyHelp: {
              tooltip:
                  'The flag image URL for the country. This will be executed for each item in the countries list. Only used when "Use custom flag images" is enabled.',
          },
          section: 'settings',
          hidden: content => !content.countries || !content.useCustomImages,
      },
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