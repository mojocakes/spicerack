import { MagicModel } from './MagicModel';

type IVehicle = {
    brand: string;
    color: string;
    reg: string;
    roof: {
        material: string;
        opens: boolean;
    };
}
class Car extends MagicModel<IVehicle> implements IVehicle {
    brand = '';
    color = '';
    reg = '';
    roof = {
        material: 'steel',
        opens: false,
    };

    fillable = [
        'color',
    ];
}

const camper: IVehicle = {
    brand: 'Vauxhall',
    color: 'red',
    reg: '5 URF BU 5',
    roof: {
        material: 'steel',
        opens: false,
    },
};

describe('data/Model', () => {
    it('Stores data provided to constructor', () => {
        const model = new Car(camper) as any;
        expect(model.data).toEqual(camper);
    });

    it('Allows property retrival directly from the instance', () => {
        const model = new Car(camper);
        expect(model.brand).toBe(camper.brand);
        expect(model.roof.material).toBe(camper.roof.material);
    });

    it('Allows "fillable" properties to be set directly on the model', () => {
        const model = new Car(camper);
        model.color = 'pink';
        expect((model as any).data.color).toBe('pink');
    });

    it('Does not allow non "fillable" properties to be set directly on the model', () => {
        const model = new Car(camper);
        model.reg = 'ABC NEW REG';
        expect((model as any).data.reg).toBe(camper.reg);
    });

    describe('set()', () => {
        it('Stores provided data', () => {
            const model = new Car(camper);
            model.set({ color: 'purple' });
            expect(model.color).toBe('purple');
        });
    });

    describe('serialize()', () => {
        it('Returns the model data as an object', () => {
            const model = new Car(camper);
            const data = model.serialize();
            expect(data).toEqual(camper);
        });
    });
});
