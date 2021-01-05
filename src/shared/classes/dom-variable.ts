import {DocumentService} from "../services/document-service";

export class DomVariable<T> {
    private element: HTMLElement;
    private originalText: string | null = null;

    constructor(id: string, value: T) {
        this._value = value;
        this.element = DocumentService.getElementById<HTMLElement>(id);

        if (this.element.innerText.includes("{}")) {
            this.originalText = this.element.innerText;
        }

        this.setValueInDom();
    }

    private _value: T;

    public get value(): T {
        return this._value;
    }

    public set value(value: T) {
        this._value = value;
        this.setValueInDom();
    }

    private setValueInDom(): void {
        let valueAsString: string = "";
        if (typeof this._value === "string") {
            valueAsString = this._value;
        } else if (typeof this._value === "number" || typeof this._value === "boolean") {
            valueAsString = this._value.toString();
        } else if (typeof this._value === "object") {
            valueAsString = JSON.stringify(this._value);
        }
        if (this.originalText != null) {
            this.element.innerText = this.originalText.replace("{}", valueAsString);
        } else {
            this.element.innerText = valueAsString;
        }
    }


}