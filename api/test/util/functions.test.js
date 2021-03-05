const { expect } = require('chai')
const chai = require('chai')
const functions = require('../../src/util/functions')

describe('util/functions', function () {
  describe('addHours', function () {
    it('should return a new Date object whose timestamp is N hours ahead of the current time', () => {
      let h = (new Date().getHours() + 5) % 24
      let d = functions.addHours(5)
      let h_ = d.getHours()
      expect(h).to.equal(h_)
      h = new Date().getHours() - 17
      if (h < 0) {
        h += 24
      }
      d = functions.addHours(-17)
      h_ = d.getHours()
      expect(h).to.equal(h_)
    })
  })
})
