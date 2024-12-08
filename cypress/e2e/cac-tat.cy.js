/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')

  })
  it('verifica o título da aplicação', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche campos obrigatórios e envia formulário', () => {
    cy.fillMandatoryFieldsAndSubmit('Danilo', 'Marroco', 'email@email.com', 'Estou aprendendo Cypress')
    cy.get('.success').should('be.visible').contains('Mensagem enviada com sucesso.')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit('Danilo', 'Marroco', 'emailemail.com', 'Estou aprendendo Cypress')
    cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('valida campo telefone só aceita numero', () => {
    cy.get('#phone').type('abcdef').should('not.have.value')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Danilo')
    cy.get('#lastName').type('Marroco')
    cy.get('#email').type('email@email.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Eu estou aprendendo cypress', { delay: 0 })
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Danilo')
      .should('have.value', 'Danilo')
      .clear().should('not.have.value')
    cy.get('#lastName')
      .type('Marroco')
      .should('have.value', 'Marroco')
      .clear().should('not.have.value')
    cy.get('#email')
      .type('email@email.com')
      .should('have.value', 'email@email.com')
      .clear().should('not.have.value')
    cy.get('#phone')
      .type('11999999999')
      .should('have.value', '11999999999')
      .clear().should('not.have.value')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
  })
  
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')    
  })
  
  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')    
  }) 

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')    
  })
  
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[value="feedback"]').check().should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"')
      .should('have.length', 3)
      .each(($radio) => {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o ultimo', () => {
    cy.get('#check input[type="checkbox"]')
    .check()
    .last().should('be.checked')
    .uncheck().should('not.be.checked')
    
    /*
    cy.get('#email-checkbox').check()
    cy.get('#email-checkbox').should('be.checked')
    cy.get('#phone-checkbox').check()
    cy.get('#phone-checkbox').should('be.checked')
    cy.get('#phone-checkbox').uncheck()
    cy.get('#phone-checkbox').should('not.be.checked')
    */
  })

  it('check all boxes', () => {
    cy.get('#check input[type="checkbox"]').as('checkboxes').check()
    
    cy.get('@checkboxes').each(checkbox => {
      expect(checkbox[0].checked).to.equal(true)
    })
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
    .should('not.have.value')
    .selectFile('cypress/fixtures/example.json')
    .should((input) => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]')
    .should('not.have.value')
    .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
    .should((input) => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture("example.json").as('sampleFile')
    cy.get('input[type="file"]')
    .should('not.have.value')
    .selectFile('@sampleFile', { action: 'drag-drop'})
    .should((input) => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a').invoke('removeAttr', 'target').click()
    cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    cy.contains('CAC TAT - Política de privacidade').should('be.visible')
  })

  it('testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')
    cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
    cy.get('.success')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .and('contain', 'Mensagem enviada com sucesso.')
    .invoke('hide')
    .should('not.be.visible')
  
    cy.get('.error')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .and('contain', 'Valide os campos obrigatórios')
    .invoke('hide')
    .should('not.be.visible')
  })

  it('preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('lorem ipsum lorem', 20) 
    cy.get('#open-text-area')
    .invoke('val', longText)
    .should('have.value', longText)
  })

  it('faz uma requisição HTTP', () => {
    cy.request({
      method:'GET', 
      url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.statusText).to.equal('OK')
      expect(response.body).to.include('CAC TAT')

      // refactor com desestruturação
      const { status, statusText, body} = response
      expect(status).to.equal(200)
      expect(statusText).to.equal('OK')
      expect(body).to.include('CAC TAT')
    })
  })

  it.only('encontra o gato escondido', () => {
    cy.get('#cat').invoke('show').should('be.visible')
  })
})

