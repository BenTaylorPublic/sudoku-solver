export class SudokuCell {
    public locked: boolean;
    public value: number | null;

    constructor() {
        this.locked = false;
        this.value = null;
    }

    public setInitialValue(value: number): void {
        this.value = value;
        this.locked = true;
    }
}