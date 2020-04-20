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
      expect(result).toEqual({
        "id": {
          "latitudeNumber": 542971,
          "longitudeNumber": 16801
        },
        "geoJSON": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  2.2939441658095228,
                  48.85761847630474
                ],
                [
                  2.2940807019779537,
                  48.85761847630474
                ],
                [
                  2.2940807019779537,
                  48.85770845830834
                ],
                [
                  2.2939441658095228,
                  48.85770845830834
                ],
                [
                  2.2939441658095228,
                  48.85761847630474
                ]
              ]
            ]
          }
        }
      })
    })
    it(`should get the correct grid block for the Black Star Square, which is
      near to the equator`.replace(/\s+/g, ' '), () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: 5.54834,
        longitude: -0.1930962,
      })
      expect(result).toEqual({
        "id": {
          "latitudeNumber": 61660,
          "longitudeNumber": -2140
        },
        "geoJSON": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -0.1931443774277802,
                  5.548290341931613
                ],
                [
                  -0.1930541230458046,
                  5.548290341931613
                ],
                [
                  -0.1930541230458046,
                  5.548380323935213
                ],
                [
                  -0.1931443774277802,
                  5.548380323935213
                ],
                [
                  -0.1931443774277802,
                  5.548290341931613
                ]
              ]
            ]
          }
        }
      })
    })
    it(`should get the correct grid block for Hotel Tulpan which is very far 
      north`.replace(/\s+/g, ' '), () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: 78.6589801,
        longitude: 16.3149812,
      })
      expect(result).toEqual({
        "id": {
          "latitudeNumber": 874163,
          "longitudeNumber": 35714
        },
        "geoJSON": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  16.31459134340858,
                  78.65893821235753
                ],
                [
                  16.315048155620694,
                  78.65893821235753
                ],
                [
                  16.315048155620694,
                  78.65902819436113
                ],
                [
                  16.31459134340858,
                  78.65902819436113
                ],
                [
                  16.31459134340858,
                  78.65893821235753
                ]
              ]
            ]
          }
        }
      })
    })
    it(`should get the correct grid block for Otuhaka Beach, Tonga, which has
      a very extreme negative longitude`.replace(/\s+/g, ' '), () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: -21.082144,
        longitude: -175.3437198,
      })
      expect(result).toEqual({
        "id": {
          "latitudeNumber": -234293,
          "longitudeNumber": -1821266
        },
        "geoJSON": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -175.34372041526933,
                  -21.08215356928614
                ],
                [
                  -175.34362413953562,
                  -21.08215356928614
                ],
                [
                  -175.34362413953562,
                  -21.082063587282544
                ],
                [
                  -175.34372041526933,
                  -21.082063587282544
                ],
                [
                  -175.34372041526933,
                  -21.08215356928614
                ]
              ]
            ]
          }
        }
      })
    })
    it(`should get the correct grid block for Sugar Loaf, an Island new New 
      Zealand, has an extreme negative longitude and moderate negative 
      latitude`.replace(/\s+/g, ' '), () => {

      var result = methods.getBlockIdentifierForLocation({
        latitude: -44.271032,
        longitude: -176.282394,
      })
      expect(result).toEqual({
        "id": {
          "latitudeNumber": -491999,
          "longitudeNumber": -1405144
        },
        "geoJSON": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -176.2825137861241,
                  -44.27105578884223
                ],
                [
                  -176.2823883310008,
                  -44.27105578884223
                ],
                [
                  -176.2823883310008,
                  -44.27096580683863
                ],
                [
                  -176.2825137861241,
                  -44.27096580683863
                ],
                [
                  -176.2825137861241,
                  -44.27105578884223
                ]
              ]
            ]
          }
        }
      })
    })
    it(`should get the correct block when in the block band right below 
      the equator, near Gabon`.replace(/\s+/g, ' '), () => {
      var result = methods.getBlockIdentifierForLocation({
        latitude: -0.00005,
        longitude: 9.44682,
      })
      expect(result).toEqual({
        "id": {
          "latitudeNumber": -1,
          "longitudeNumber": 105161
        },
        "geoJSON": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  9.446777292576419,
                  -0.00008998200359928014
                ],
                [
                  9.446867124142234,
                  -0.00008998200359928014
                ],
                [
                  9.446867124142234,
                  0
                ],
                [
                  9.446777292576419,
                  0
                ],
                [
                  9.446777292576419,
                  -0.00008998200359928014
                ]
              ]
            ]
          }
        }
      })
    })
  })
})