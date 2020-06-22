import * as spicerack from './';

describe('library', () => {
    it('exports modules', () => {
        expect(Object.keys(spicerack).length).toBe(14);
    });
});
