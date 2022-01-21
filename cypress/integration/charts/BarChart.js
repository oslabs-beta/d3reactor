describe('Bar Chart', () => {
  it('should show bar chart', () => {
    const width = 1000;
    const height = 900;
    cy.visit('localhost:8080');
    cy.viewport(width, height);
    cy.get('[data-testid = bar-chart]')
      .should('be.visible')
      .and((chart) => {
        expect(chart.width()).to.eql(width);
        expect(chart.height()).to.eql(height);
      });
    cy.get('[data-testid = bar-chart-legend]').should('be.visible');
    cy.get('[data-testid = rectangle-1]').trigger('mouseover');
    cy.get('[data-testid = tooltip-bar-chart]')
      .should('be.visible')
      .should('contain', 'date: 2019-07-23');
    cy.get('[data-testid = bar-chart-x-axis-label]')
      .should('be.visible')
      .should('contain', 'Date');
    cy.get('[data-testid = bar-chart-x-axis]').should('be.visible');
    cy.get('[data-testid = bar-chart-y-axis]').should('be.visible');
    cy.get('[data-testid = bar-chart-y-axis-label]')
      .should('be.visible')
      .should('contain', 'Value');
  });
});
