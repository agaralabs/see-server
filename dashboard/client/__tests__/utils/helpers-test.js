import Helpers from '../../src/js/utils/helpers';


describe('Helper util functions', () => {
    it('should return the number string from mixed string', () => {
        expect(Helpers.getNumberStr('47hsjh2n')).toEqual('472');
        expect(Helpers.getNumberStr('  ere82h')).toEqual('82');
        expect(Helpers.getNumberStr('863974 ks-2*00')).toEqual('863974200');
    });


    it('should return human readable form of Date', () => {
        expect(Helpers.formatDate(new Date('2015, 10, 20'), 'dddd MMMM Do, YYYY')).toEqual('Tuesday October 20th, 2015');
        expect(Helpers.formatDate(new Date('2015, 10, 20'))).toEqual('Oct 20th, 2015');
    });


    it('should round the floating point number', () => {
        expect(Helpers.roundFloatingNumber(13.449292, 3)).toEqual(13.449);
        expect(Helpers.roundFloatingNumber(13.4139, 3)).toEqual(13.414);
        expect(Helpers.roundFloatingNumber(13.99093, 3)).toEqual(13.991);
        expect(Helpers.roundFloatingNumber(13.99993, 3)).toEqual(14);
    });
});
