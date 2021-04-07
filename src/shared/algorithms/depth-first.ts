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
        const clone: SudokuState = SudokuState.clone(current);
        let action: StepAction | null = null;

        if (current.isValid2(firstOpenCell, this.nextToAssign)) {
            //Should be good to insert
            clone.cells[firstOpenCell.y][firstOpenCell.x].value = this.nextToAssign;
            this.stack.push(clone);
            action = StepAction.Assigned;
        } else {
            //Create a drawable state to show it failed to insert there
            clone.cells[firstOpenCell.y][firstOpenCell.x].value = this.nextToAssign;
            action = StepAction.FailedToAssign;
        }

        if (this.nextToAssign < 9) {
            //Need to push the current back on the stack
            this.stack.push(current);
            this.nextToAssign++;
        } else {
            //Otherwise it is 9, so reset it to 1
            this.nextToAssign = 1;
        }
        console.log("Stack size: " + this.stack.length);
        return new DrawableSudokuState(clone.cells, firstOpenCell, action);
    }

    get givenUp(): boolean {
        return this._givenUp != null;
    }

}