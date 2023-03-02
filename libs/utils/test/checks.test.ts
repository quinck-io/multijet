import { expect } from 'chai'
import 'mocha'

import { LibLabel } from '../../../test/unit/common/labels'
import { isPresent } from '../src/checks'

describe(`${LibLabel.UTILS} isPresent`, () => {
    it('should return true if the value is not null or undefined', () => {
        expect(isPresent(5)).to.be.true
    })

    it('should return false if the value is undefined', () => {
        expect(isPresent(undefined)).to.be.false
    })

    it('should return false if the value is null', () => {
        expect(isPresent(null)).to.be.false
    })
})
