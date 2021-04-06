import {SudokuAlgorithm} from "../sudoku-algorithm";
import {SudokuState} from "../sudoku-state";
import {DrawableSudokuState} from "../drawable-sudoku-state";
import {StepAction} from "../enums";

export class DepthFirst implements SudokuAlgorithm {
    public name: string = "Depth First";

    private stack: SudokuState[];
    private _givenUp: string | null;

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
            this._givenUp = "Stack is empty";
            const empty: SudokuState = new SudokuState();
            return new DrawableSudokuState(empty.cells, {
                x: 0,
                y: 0
            }, StepAction.FailedToAssign);
        }

        current.cells[0][0].value = 1;
        return new DrawableSudokuState(current.cells, {
            x: 0,
            y: 0
        }, StepAction.Assigned);
    }

    get givenUp(): boolean {
        return this._givenUp != null;
    }

}