describe('Beaches functional tests', () => {
  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(201);
      
      //nesse caso fizemos uma verificação dentro do toEqual, para que mesmo se for adicionado outros campos no retorno de quando for criado por exemplo o Id, o teste continue funcionando, o expect.objectContaining é para ver se o objeto passado está contido no response, se tiver, está ok
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });
  });
});
