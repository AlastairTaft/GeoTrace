import * as methods from './backgroundSyncUtil'
import sinon from 'sinon'

describe('#backgroundSync', () => {

  it(`should work`.replace(/\s+/g, ' '), async () => {
    var submitRiskMap = sinon.spy()
    var deps = {
      popStoredRiskData: () => ({
        "+/uQQpBNx0b/zktnefcCjiVSCJ6Gp9ueukiuTaRTKLFcnQCDRayq0yeFWqmwRYk4dYEDorbuIA0TKorVy02VZw==": {
          "hash": "+/uQQpBNx0b/zktnefcCjiVSCJ6Gp9ueukiuTaRTKLFcnQCDRayq0yeFWqmwRYk4dYEDorbuIA0TKorVy02VZw==",
          "preSaltHash": "zcVdnrtUhgOoFXUuEme0OrQEWK9rnXMn0LdSjsmX9FcEnWA6hF28tto/qx1ccXgsbxnVwZ9iiRahxa1EENQxzw==",
          "timePassedSinceExposure": 5400000,
          "timestamp": 1588317355149,
        },
        "+2Kp8bk4R65j0gCdzqSSOGr2ZWfrDmw/B2xzUz21d0XwW4OoZRkV71d78G23kMEcPjEvfF2b4Tle7LiTe9wqGg==": {
          "hash": "+2Kp8bk4R65j0gCdzqSSOGr2ZWfrDmw/B2xzUz21d0XwW4OoZRkV71d78G23kMEcPjEvfF2b4Tle7LiTe9wqGg==",
          "preSaltHash": "zcVdnrtUhgOoFXUuEme0OrQEWK9rnXMn0LdSjsmX9FcEnWA6hF28tto/qx1ccXgsbxnVwZ9iiRahxa1EENQxzw==",
          "timePassedSinceExposure": 7200000,
          "timestamp": 1588317393116,
        },
        "+a1rEf/W5PPaE/AClGRI8dhgrfQRSxLCcAyNrkXZkDI/qTiYSH66CX4eFT4yj1JckLfpIrYJbnliu/gqanZK9w==": {
          "hash": "+a1rEf/W5PPaE/AClGRI8dhgrfQRSxLCcAyNrkXZkDI/qTiYSH66CX4eFT4yj1JckLfpIrYJbnliu/gqanZK9w==",
          "preSaltHash": "zcVdnrtUhgOoFXUuEme0OrQEWK9rnXMn0LdSjsmX9FcEnWA6hF28tto/qx1ccXgsbxnVwZ9iiRahxa1EENQxzw==",
          "timePassedSinceExposure": 7800000,
          "timestamp": 1588317367141,
        },
      }),
      getSalts: () => ([
        { success: true, hash: 'IWCGLNNbDHYAjcIcq9Hi1AhpzTMJE8AfhF8urSqcK1vortAuELTqdG3iEMCGLvpOFq5UpUnnJeHr+heR7fSRiw==', },
        { success: true, hash: 'VrPIr3YFPOSIiUxCAjPOOpMkeWLgudZsq9rqG73zlsywdHeKmVsgBLPWRJUjRDUfnjMY0EkHyjXm9Eefc20orw==', },
        { success: true, hash: 'X9JyA842l56J1x6CKQkB+D7teI9U7TqhIEaCkbo3PDMvB9Hc7Rd3hx+V4D8PI9gIWMdmAezOXPSXsKRcAcm3Sw==', },
      ]),
      getDeviceId: () => 'GU2zy4DYS46uCKezb3y634oehx41YIoib4IwBJMWbq05/IIqWw1loVlcDCLZpFkCUj3UVNMH+FcLcNcqfkbOtQ==',
      submitRiskMap,
      onError: err => { throw err },
      hashFunction: str => str,
    }
    await methods.createBackgroundSyncFunction(deps)()
    expect(submitRiskMap.calledOnce).toBe(true)
    expect(submitRiskMap.args[0])
    .toEqual([
      'GU2zy4DYS46uCKezb3y634oehx41YIoib4IwBJMWbq05/IIqWw1loVlcDCLZpFkCUj3UVNMH+FcLcNcqfkbOtQ==',
      [
        { 
          hash: "+/uQQpBNx0b/zktnefcCjiVSCJ6Gp9ueukiuTaRTKLFcnQCDRayq0yeFWqmwRYk4dYEDorbuIA0TKorVy02VZw==" + '-' + 'IWCGLNNbDHYAjcIcq9Hi1AhpzTMJE8AfhF8urSqcK1vortAuELTqdG3iEMCGLvpOFq5UpUnnJeHr+heR7fSRiw==',
          "timePassedSinceExposure": 5400000,
        },
        { 
          hash: "+2Kp8bk4R65j0gCdzqSSOGr2ZWfrDmw/B2xzUz21d0XwW4OoZRkV71d78G23kMEcPjEvfF2b4Tle7LiTe9wqGg==" + '-' + 'VrPIr3YFPOSIiUxCAjPOOpMkeWLgudZsq9rqG73zlsywdHeKmVsgBLPWRJUjRDUfnjMY0EkHyjXm9Eefc20orw==',
          "timePassedSinceExposure": 7200000,
        },
        { 
          hash: "+a1rEf/W5PPaE/AClGRI8dhgrfQRSxLCcAyNrkXZkDI/qTiYSH66CX4eFT4yj1JckLfpIrYJbnliu/gqanZK9w==" + '-' + 'X9JyA842l56J1x6CKQkB+D7teI9U7TqhIEaCkbo3PDMvB9Hc7Rd3hx+V4D8PI9gIWMdmAezOXPSXsKRcAcm3Sw==',
          "timePassedSinceExposure": 7800000,
        },
      ]
    ])
  })

  it(`should request salts from two different servers because there's two 
    different pre salt hashes.`.replace(/\s+/g, ' '), async () => {
    var submitRiskMap = sinon.spy()
    const getSalts = sinon.stub()
    getSalts.onCall(0).returns(([
      { success: true, hash: 'IWCGLNNbDHYAjcIcq9Hi1AhpzTMJE8AfhF8urSqcK1vortAuELTqdG3iEMCGLvpOFq5UpUnnJeHr+heR7fSRiw==', },
      { success: true, hash: 'VrPIr3YFPOSIiUxCAjPOOpMkeWLgudZsq9rqG73zlsywdHeKmVsgBLPWRJUjRDUfnjMY0EkHyjXm9Eefc20orw==', },
    ]))
    getSalts.onCall(1).returns(([
      { success: true, hash: 'X9JyA842l56J1x6CKQkB+D7teI9U7TqhIEaCkbo3PDMvB9Hc7Rd3hx+V4D8PI9gIWMdmAezOXPSXsKRcAcm3Sw==', },
    ]))

    var deps = {
      popStoredRiskData: () => ({
        "+/uQQpBNx0b/zktnefcCjiVSCJ6Gp9ueukiuTaRTKLFcnQCDRayq0yeFWqmwRYk4dYEDorbuIA0TKorVy02VZw==": {
          "hash": "+/uQQpBNx0b/zktnefcCjiVSCJ6Gp9ueukiuTaRTKLFcnQCDRayq0yeFWqmwRYk4dYEDorbuIA0TKorVy02VZw==",
          "preSaltHash": "zcVdnrtUhgOoFXUuEme0OrQEWK9rnXMn0LdSjsmX9FcEnWA6hF28tto/qx1ccXgsbxnVwZ9iiRahxa1EENQxzw==",
          "timePassedSinceExposure": 5400000,
          "timestamp": 1588317355149,
        },
        "+2Kp8bk4R65j0gCdzqSSOGr2ZWfrDmw/B2xzUz21d0XwW4OoZRkV71d78G23kMEcPjEvfF2b4Tle7LiTe9wqGg==": {
          "hash": "+2Kp8bk4R65j0gCdzqSSOGr2ZWfrDmw/B2xzUz21d0XwW4OoZRkV71d78G23kMEcPjEvfF2b4Tle7LiTe9wqGg==",
          "preSaltHash": "+KJCLCizMAdLreyPrxNGK9vc1Dzf+Swto6zdWmskdE5CvofMUywEEQ5k5qH+v942ZCt6FxK9YN3ODOH+Y7U0ug==",
          "timePassedSinceExposure": 7200000,
          "timestamp": 1588317393116,
        },
        "+a1rEf/W5PPaE/AClGRI8dhgrfQRSxLCcAyNrkXZkDI/qTiYSH66CX4eFT4yj1JckLfpIrYJbnliu/gqanZK9w==": {
          "hash": "+a1rEf/W5PPaE/AClGRI8dhgrfQRSxLCcAyNrkXZkDI/qTiYSH66CX4eFT4yj1JckLfpIrYJbnliu/gqanZK9w==",
          "preSaltHash": "zcVdnrtUhgOoFXUuEme0OrQEWK9rnXMn0LdSjsmX9FcEnWA6hF28tto/qx1ccXgsbxnVwZ9iiRahxa1EENQxzw==",
          "timePassedSinceExposure": 7800000,
          "timestamp": 1588317367141,
        },
      }),
      getSalts,
      getDeviceId: () => 'GU2zy4DYS46uCKezb3y634oehx41YIoib4IwBJMWbq05/IIqWw1loVlcDCLZpFkCUj3UVNMH+FcLcNcqfkbOtQ==',
      submitRiskMap,
      onError: err => { throw err },
      hashFunction: str => str,
    }
    await methods.createBackgroundSyncFunction(deps)()
    expect(submitRiskMap.calledOnce).toBe(true)
    expect(submitRiskMap.args[0])
    .toEqual([
      'GU2zy4DYS46uCKezb3y634oehx41YIoib4IwBJMWbq05/IIqWw1loVlcDCLZpFkCUj3UVNMH+FcLcNcqfkbOtQ==',
      [
        { 
          hash: "+/uQQpBNx0b/zktnefcCjiVSCJ6Gp9ueukiuTaRTKLFcnQCDRayq0yeFWqmwRYk4dYEDorbuIA0TKorVy02VZw==" + '-' + 'IWCGLNNbDHYAjcIcq9Hi1AhpzTMJE8AfhF8urSqcK1vortAuELTqdG3iEMCGLvpOFq5UpUnnJeHr+heR7fSRiw==',
          "timePassedSinceExposure": 5400000,
        },
        { 
          hash: "+a1rEf/W5PPaE/AClGRI8dhgrfQRSxLCcAyNrkXZkDI/qTiYSH66CX4eFT4yj1JckLfpIrYJbnliu/gqanZK9w==" + '-' + 'VrPIr3YFPOSIiUxCAjPOOpMkeWLgudZsq9rqG73zlsywdHeKmVsgBLPWRJUjRDUfnjMY0EkHyjXm9Eefc20orw==',
          "timePassedSinceExposure": 7800000,
        },
        { 
          hash: "+2Kp8bk4R65j0gCdzqSSOGr2ZWfrDmw/B2xzUz21d0XwW4OoZRkV71d78G23kMEcPjEvfF2b4Tle7LiTe9wqGg==" + '-' + 'X9JyA842l56J1x6CKQkB+D7teI9U7TqhIEaCkbo3PDMvB9Hc7Rd3hx+V4D8PI9gIWMdmAezOXPSXsKRcAcm3Sw==',
          "timePassedSinceExposure": 7200000,
        },
      ]
    ])
  })
})