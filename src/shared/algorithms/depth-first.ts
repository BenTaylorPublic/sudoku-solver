import {SudokuAlgorithm} from "../sudoku-algorithm";
import {SudokuState} from "../sudoku-state";
import {DrawableSudokuState} from "../drawable-sudoku-state";
import {StepAction} from "../enums";

export class DepthFirst implements SudokuAlgorithm {
    public name: string = "Depth First";

    private stack: SudokuState[];
    private _givenUp: string | null;
    private nextToAssign: number = 1;

    constructor() {
        this.stack = [];
        this._givenUp = null;
    }

    setup(initialBoard: SudokuState): void {
        this.stack.push(initialBoard);
    }

    step(): DrawableSudokuState {
        const current: SudokuState | undefined = this.stack.pop();
        if (current == null) {
            console.error("Stack is empty");
            this._givenUp = "Stack is empty";
            const empty: SudokuState = new SudokuState();
            return new DrawableSudokuState(empty.cells, {
                x: 0,
                y: 0
            }, StepAction.FailedToAssign);
        }

        const firstOpenCell: CellXY = current.firstOpenCell;
        for (let i = this.nextToAssign; i < 9; i++) {
            if (current.isValid2(firstOpenCell, i)) {
                //Not sure about this yet...
                if (i < 9) {
                    this.nextToAssign = i + 1;
                }
            }
        }
        return new DrawableSudokuState(current.cells, {
            x: 0,
            y: 0
        }, StepAction.Assigned);
    }

    get givenUp(): boolean {
        return this._givenUp != null;
    }

}