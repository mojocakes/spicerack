[TOC]

# Models
    A model class holds some data.
## Making a new model

```typescript
import { Model } from 'spicerack/models';

interface IVehicle {
    brand: string;
    color: string;
    model: string;
}

class Vehicle extends Model<IVehicle> {
    // default values
    public brand = '';
    public color = '';
    public model = '';
}

const campervan = new Vehicle({
    brand: 'Volkswagen',
    color: 'red',
    model: 'Westfalia',
});
```

## Retrieving values
You can grab values from a model instance:
```typescript
campervan.color; // red
```

## Setting values
You can set values directly on the model instance, however you first need to mark them as "fillable" on the class:

```typescript
class Vehicle extends Model<IVehicle> {
    ...
    protected $fillable = ['brand', 'model'];
}

campervan.brand = 'Tesla'; // Tesla
campervan.color = 'black'; // red
```
