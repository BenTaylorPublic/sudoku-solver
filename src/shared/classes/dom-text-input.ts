import {TextValidationRuleset} from "./text-validation-ruleset";
import {DocumentService} from "../services/document-service";

export class DomTextInput {
    private inputElement: HTMLInputElement;
    private tooltipElement: HTMLDivElement;
    private onTextInputValidationChange: OnTextInputValidationChange | null = null;
    private validationRuleset: TextValidationRuleset;
    private onEnter: VoidCallback | null = null;
    private lastValidationResult: string | null = null;

    constructor(divId: string, value: string = "", validationRuleset: TextValidationRuleset, onTextInputValidationChange?: OnTextInputValidationChange | null, type: "text" | "password" = "text") {
        const divElement: HTMLDivElement = DocumentService.getElementById<HTMLDivElement>(divId);
        divElement.classList.add("domTextInput");

        this.inputElement = document.createElement("input");
        this.inputElement.type = type;
        this.inputElement.value = value;
        this.inputElement.addEventListener("input", this.eventOnTextInputChange.bind(this));
        this.inputElement.addEventListener("mouseenter", this.eventOnInputMouseEnter.bind(this));
        this.inputElement.addEventListener("mouseleave", this.eventOnInputMouseLeave.bind(this));
        this.inputElement.addEventListener("keypress", this.eventOnInputKeyPress.bind(this));
        divElement.appendChild(this.inputElement);

        this.tooltipElement = document.createElement("div");
        this.tooltipElement.className = "tooltipElement";
        divElement.appendChild(this.tooltipElement);

        if (onTextInputValidationChange != null) {
            this.onTextInputValidationChange = onTextInputValidationChange;
        }

        this.validationRuleset = validationRuleset;

        this.lastValidationResult = this.validate();
    }

    public get value(): string {
        return this.inputElement.value;
    }

    public set value(value: string) {
        this.inputElement.value = value;
        this.eventOnTextInputChange();
    }

    get isValid(): boolean {
        return this.lastValidationResult == null;
    }

    public forceRevalidate(): void {
        this.eventOnTextInputChange();
    }

    public select(): void {
        this.inputElement.select();
    }

    public addEnterEventListener(callback: VoidCallback): void {
        this.onEnter = callback;
    }

    private eventOnInputKeyPress(data: KeyboardEvent): void {
        if (data.code === "Enter" &&
            this.onEnter != null) {
            this.onEnter();
        }
    }

    private eventOnTextInputChange(): void {
        this.lastValidationResult = this.validate();
        if (this.onTextInputValidationChange != null) {
            this.onTextInputValidationChange(this.inputElement.value, this.lastValidationResult);
        }
    }

    private eventOnInputMouseEnter(): void {
        this.tooltipElement.classList.add("hover");
    }

    private eventOnInputMouseLeave(): void {
        this.tooltipElement.classList.remove("hover");
    }

    private validate(): string | null {
        const validationResult: string | null = this.validationRuleset.validate(this.inputElement.value);
        if (validationResult != null) {
            //Invalid
            this.tooltipElement.innerText = validationResult;
            this.tooltipElement.classList.add("enabled");
            this.inputElement.classList.add("borderRed");
            this.inputElement.classList.remove("borderGreen");
        } else {
            //Valid
            this.tooltipElement.classList.remove("enabled");
            this.inputElement.classList.remove("borderRed");
            this.inputElement.classList.add("borderGreen");
        }
        return validationResult;
    }
}