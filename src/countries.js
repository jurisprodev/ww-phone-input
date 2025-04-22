export default [
    {
      code: 'BR',
      name: 'Brasil',
      dialCode: '55',
      format: '+## (##) #####-####',
      mask: '+00 (00) 00000-0000',
      maxDigits: 11, // DDD (2) + número celular (9)
      priority: 0, // Prioridade mais alta para Brasil
      areaCodes: null
    },
    {
      code: 'US',
      name: 'Estados Unidos',
      dialCode: '1',
      format: '+# (###) ###-####',
      mask: '+0 (000) 000-0000',
      maxDigits: 10, // Código de área (3) + número (7)
      priority: 1
    },
    {
      code: 'PT',
      name: 'Portugal',
      dialCode: '351',
      format: '+### ### ### ###',
      mask: '+000 000 000 000',
      maxDigits: 9, // Formato típico em Portugal
      priority: 2
    },
    {
      code: 'AR',
      name: 'Argentina',
      dialCode: '54',
      format: '+## ## ####-####',
      mask: '+00 00 0000-0000',
      maxDigits: 10, // Formato típico na Argentina
      priority: 3
    },
    {
      code: 'UY',
      name: 'Uruguai',
      dialCode: '598',
      format: '+### # ###-##-##',
      mask: '+000 0 000-00-00',
      maxDigits: 8, // Formato típico no Uruguai
      priority: 3
    },
    {
      code: 'CO',
      name: 'Colômbia',
      dialCode: '57',
      format: '+## ### ###-####',
      mask: '+00 000 000-0000',
      maxDigits: 10, // Formato típico na Colômbia
      priority: 3
    },
    {
      code: 'MX',
      name: 'México',
      dialCode: '52',
      format: '+## ## ####-####',
      mask: '+00 00 0000-0000',
      maxDigits: 10, // Formato típico no México
      priority: 3
    },
    {
      code: 'ES',
      name: 'Espanha',
      dialCode: '34',
      format: '+## ### ### ###',
      mask: '+00 000 000 000',
      maxDigits: 9, // Formato típico na Espanha
      priority: 3
    },
    {
      code: 'IT',
      name: 'Itália',
      dialCode: '39',
      format: '+## ### ### ####',
      mask: '+00 000 000 0000',
      maxDigits: 10, // Formato típico na Itália
      priority: 3
    },
    {
      code: 'FR',
      name: 'França',
      dialCode: '33',
      format: '+## # ## ## ## ##',
      mask: '+00 0 00 00 00 00',
      maxDigits: 9, // Formato típico na França
      priority: 3
    },
    {
      code: 'DE',
      name: 'Alemanha',
      dialCode: '49',
      format: '+## ### ### ####',
      mask: '+00 000 000 0000',
      maxDigits: 11, // Formato típico na Alemanha
      priority: 3
    },
    {
      code: 'GB',
      name: 'Reino Unido',
      dialCode: '44',
      format: '+## #### ######',
      mask: '+00 0000 000000',
      maxDigits: 10, // Formato típico no Reino Unido
      priority: 3
    },
    {
      code: 'UZ',
      name: 'Uzbequistão',
      dialCode: '998',
      format: '+### ## ###-##-##',
      mask: '+000 00 000-00-00',
      maxDigits: 9, // Formato típico no Uzbequistão
      priority: 4
    },
    // Adicione mais países conforme necessário
  ];