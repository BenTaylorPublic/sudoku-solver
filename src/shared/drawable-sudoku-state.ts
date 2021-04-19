import {SudokuState} from "./sudoku-state";
import {SudokuCell} from "./sudoku-cell";
import {StepAction} from "./enums";
import {CellXY, Stat} from "./interfaces";

export class DrawableSudokuState extends SudokuState {
    public lastActionedCell: CellXY;
    public action: StepAction;
    public stats: Stat[];

    constructor(cells: SudokuCell[][], lastActionedCell: CellXY, action: StepAction, stats: Stat[]) {
        super(cells);
        this.lastActionedCell = {
            x: lastActionedCell.x,
            y: lastActionedCell.y
        };
        this.action = action;
        this.stats = stats;
    }
}