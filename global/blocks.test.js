import * as methods from './blocks'

describe('#blocks', () => {
  describe('#getEarthCircumferenceAtLatitude', () => {
    
    it('should be 0 at the North pole', () => {
      var result = methods.getEarthCircumferenceAtLatitude(90)
      // The rounding error doesn't get exactly 0 but gets very close
      expect(result).toBe(2.453886023791509e-9)
    })

    it('should be 0 at the South pole', () => {
      var result = methods.getEarthCircumferenceAtLatitude(-90)
      // The rounding error doesn't get exactly 0 but gets very close
      expect(result).toBe(2.453886023791509e-9)
    })

    it('should be 28,000k half way up the latitude', () => {
      var result = methods.getEarthCircumferenceAtLatitude(45)
      // The rounding error doesn't get exactly 0 but gets very close
      expect(result).toBe(28337304.256050892)
    })
  })

  describe('#getNoBlocksAtLatitude', () => {
    it('There should be 4,007,500 blocks on the equator', () => {
      var result = methods.getNoBlocksAtLatitude(0)
      expect(result).toBe(4007500)
    })

    it('There should be 2,833,730 blocks half way down the equator', () => {
      var result = methods.getNoBlocksAtLatitude(-45)
      expect(result).toBe(2833730)
    })
  })

  describe('#getBlockIdentifierForLocation', () => {
    it('should get the correct grid block for the Eiffel Tower', () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: 48.8576733,
        longitude: 2.294044,
      })
      expect(result).toEqual({foo: 'bar'})
    })
    it(`should get the correct grid block for the Black Star Square, which is
      near to the equator`.replace(/\s+/g, ' '), () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: 5.5483676,
        longitude: -0.1930962,
      })
      expect(result).toEqual({foo: 'bar'})
    })
    it(`#foobar should get the correct grid block for Hotel Tulpan which is very far 
      north`.replace(/\s+/g, ' '), () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: 78.6589801,
        longitude: 16.3149812,
      })
      expect(result).toEqual({foo: 'bar'})
    })
  })
})