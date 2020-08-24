export type TDefaultModelProperties = {
    id?: number | string;
}

export type TModelData<T> = TDefaultModelProperties & T;

export type TModelIdentifier =
    | string
    | number
;
