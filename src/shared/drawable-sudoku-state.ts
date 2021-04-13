import {SudokuState} from "./sudoku-state";
import {SudokuCell} from "./sudoku-cell";
import {StepAction} from "./enums";
import {CellXY} from "./interfaces";

export class DrawableSudokuState extends SudokuState {
    public lastActionedCell: CellXY;
    public action: StepAction;

    constructor(cells: SudokuCell[][], lastActionedCell: CellXY, action: StepAction) {
        super(cells);
        this.lastActionedCell = lastActionedCell;
        this.action = action;
    }
}