import Helpers from '../../src/js/utils/helpers';


describe('Helper util functions', () => {
    it('should return the number string from mixed string', () => {
        expect(Helpers.getNumberStr('47hsjh2n')).toEqual('472');
        expect(Helpers.getNumberStr('  ere82h')).toEqual('82');
        expect(Helpers.getNumberStr('863974 ks-2*00')).toEqual('863974200');
    });
});
