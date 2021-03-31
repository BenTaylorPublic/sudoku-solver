import {SudokuCell} from "./sudoku-cell";

export class SudokuState {
    public cells: SudokuCell[][];
    public lastCellSet: CellXY | null;

    constructor() {
        this.lastCellSet = null;
        this.cells = [];
        for (let y: number = 0; y < 9; y++) {
            this.cells.push([]);
            for (let x: number = 0; x < 9; x++) {
                this.cells[y].push(new SudokuCell());
            }
        }
    }

    public setInitialValue(x: number, y: number, value: number): void {
        this.cells[y][x].setInitialValue(value);
    }
}