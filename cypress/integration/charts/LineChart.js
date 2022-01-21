describe('Line Chart', () => {
  it('should show line chart', () => {
    cy.visit('localhost:8080');
    cy.get('[data-testid = line-chart]')
      .should('be.visible')
      .and((chart) => {
        expect(chart.height()).to.eql(500);
        expect(chart.width()).to.eql(600);
      });
  });
});
