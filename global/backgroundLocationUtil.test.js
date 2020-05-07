import * as methods from './backgroundLocationUtil'
import sinon from 'sinon'

describe('#backgroundLocationUtil', () => {
  describe('#createBackgroundTrackFunction', () => {
    it('should store the location as one doesn\' exist', async () => {
      var setStoredLocation = sinon.spy()
      var func = methods.createBackgroundTrackFunction({
        getStoredLocation: () => null,
        setStoredLocation,
        timeBlockSize: 1000 * 60 * 5,
      })
      var testLocations = [
        {
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 6,
            heading: 0,
            speed: 1,
          },
          timestamp: 2340,
        },
      ]
      await func({ data: { locations: testLocations, } })
      expect(setStoredLocation.calledOnce).toBe(true)
      expect(setStoredLocation.args[0][0]).toEqual('300000-0')
      expect(setStoredLocation.args[0][1]).toEqual(
        {
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 6,
            heading: 0,
            speed: 1,
          },
          timestamp: 2340,
        }
      )
    })
    it('should discard the location if the accuracy is worse than 10 meters', 
      async () => {
      var setStoredLocation = sinon.spy()
      var func = methods.createBackgroundTrackFunction({
        getStoredLocation: () => null,
        setStoredLocation,
        timeBlockSize: 1000 * 60 * 5,
      })
      var testLocations = [
        {
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 10.5,
            heading: 0,
            speed: 1,
          },
          timestamp: 44500,
        },
      ]
      await func({ data: { locations: testLocations, } })
      expect(setStoredLocation.notCalled).toBe(true)
    })
    it('should replace the location if it has better accuracy', async () => {
      var setStoredLocation = sinon.spy()
      var func = methods.createBackgroundTrackFunction({
        getStoredLocation: () => ({
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 6,
            heading: 0,
            speed: 1,
          },
          timestamp: 1000,
        }),
        setStoredLocation,
        timeBlockSize: 1000 * 60 * 5,
      })
      var testLocations = [
        {
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 5,
            heading: 0,
            speed: 1,
          },
          timestamp: 1234,
        },
      ]
      await func({ data: { locations: testLocations, } })
      expect(setStoredLocation.calledOnce).toBe(true)
      expect(setStoredLocation.args[0][0]).toEqual('300000-0')
      expect(setStoredLocation.args[0][1]).toEqual(
        {
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 5,
            heading: 0,
            speed: 1,
          },
          timestamp: 1234,
        }
      )
    })
    it('should not replace the location if it has worse accuracy', 
      async () => {
      var setStoredLocation = sinon.spy()
      var func = methods.createBackgroundTrackFunction({
        getStoredLocation: () => ({
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 5,
            heading: 0,
            speed: 1,
          },
          timestamp: 3000,
        }),
        setStoredLocation,
        timeBlockSize: 1000 * 60 * 5,
      })
      var testLocations = [
        {
          coords: {
            latitude: 1,
            longitude: 2,
            altitude: -1,
            accuracy: 6,
            heading: 0,
            speed: 1,
          },
          timestamp: 2000,
        },
      ]
      await func({ data: { locations: testLocations, } })
      expect(setStoredLocation.notCalled).toBe(true)
    })
  })
})