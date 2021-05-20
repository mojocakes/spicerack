import { Service } from "@/core";
import { IViewProvider } from "../types";

export abstract class View extends Service implements IViewProvider {
    public abstract render(...params: any[]): Promise<string>;
}
