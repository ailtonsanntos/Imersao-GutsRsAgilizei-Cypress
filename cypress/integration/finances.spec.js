/// <reference types="cypress" />>  //Informações sobre a documentação do Cypress

import { format, prepareLocalStorage } from '../support/utils'

//const { invoke } = require("cypress/types/lodash");

// cy.viewport
// arquivos de config 
// configs por linhas de comando


context('Dev Finances Agilizei', () => {

    //hooks
    //Trechos de códigos que executam antes e depois do teste
    //before -> Antes de todos os testes
    //beforeEach -> Antes de cada teste
    //after -> depois de todos os testes
    //afterEach -> depois de cada testes

    beforeEach(() => {
         //Acessando a página
         cy.visit('https://devfinance-agilizei.netlify.app', {
             onBeforeLoad: (win) => {
                prepareLocalStorage(win)
             }
         })

         //cy.get('#data-table tbody tr').should('have.length', 0)        
    });
  


    it('Cadastrar entradas', () => {
        //-Entender o fluxo manualmente
        //-mapear os elementos que vamos interagir
        //descrever as interações com cypress       

       
        cy.get('#transaction .button').click() //id+ classe
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type(15) //atributos
        cy.get('[type=date]').type('2021-03-28') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor

         //descrever as asserções que a gente precisa

        cy.get('#data-table tbody tr').should('have.length', 3)  //have.length - valida o tamanho da tabela      
        
    });

    //Cadastrar Saídas
    it('Cadastrar saídas', () => {

        
        
        cy.get('#transaction .button').click() //id+ classe
        cy.get('#description').type('Presente') //id
        cy.get('[name=amount]').type(-15) //atributos
        cy.get('[type=date]').type('2021-03-28') //atributos
        cy.get('button').contains('Salvar').click() //tipo e valor

         //descrever as asserções que a gente precisa

        cy.get('#data-table tbody tr').should('have.length', 3)  //have.length - valida o tamanho da tabela
        
    });

    //Remover Entradas e Saídas
    it('Remover entradas e saídas', () => {  
      
        //Estratégia 1: Voltar para o elemento pai, e avançar para um td img e o atributo
        cy.get('td.description')
            .contains('Mesada') //Posso encontrar o elemento por texto
            .parent('')
            .find('img[onclick*=remove]')
            .click()

        //Estratégia 2: buscar todos os irmãos dos elementos, e buscar o que tem img + atributo
        cy.get('td.description')
            .contains('Suco Kapo')
            .siblings()
            .children('img[onclick*=remove]')
            .click()

            cy.get('#data-table tbody tr').should('have.length', 0) 
    });

    it('Validar saldo com diversas transações', () => {

        

        // capturar as linhas com as transações
        // capturar o texto dessas colunas

        // formatar esses valores das linhas
        // Somar os valores de entradas e saídas

        let incomes = 0
        let expenses = 0


        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                        if (text.includes('-')) {
                            expenses = expenses + format(text)
                        } else {
                            incomes = incomes + format(text)
                        }

                        cy.log('entradas', incomes)
                        cy.log('saidas', expenses)

                    })  // Invoke - Invocar uma função JavaScript do browser                  


            } )  //Navegar em cada it de uma lista e executar uma determinada ação       

        // capturar o texto do total 
        // comparar o somatorio e de entradas e saídas com o total

        cy.get('#totalDisplay').invoke('text').then(text => {
            cy.log('valor total', format(text))
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)

        })
        
    });

    
    
});