import {SudokuAlgorithm} from "../sudoku-algorithm";
import {SudokuState} from "../sudoku-state";
import {DrawableSudokuState} from "../drawable-sudoku-state";
import {CellXY, Stat} from "../interfaces";
import {StepAction} from "../enums";

export class Logical implements SudokuAlgorithm {
    public name: string = "Logical";

    private _givenUp: string | null;

    private nextToAssign: number = 1;
    private state: SudokuState;
    private numbersThatFit: number[];
    private cell: CellXY;

    constructor() {
        this._givenUp = null;
        this.state = new SudokuState();
        this.numbersThatFit = [];
        this.cell = {
            x: 0,
            y: 0
        };
    }

    setup(initialBoard: SudokuState): void {
        this.state = initialBoard;
        this.cell = this.state.firstOpenCell;
    }

    step(): DrawableSudokuState {
        const clone: SudokuState = SudokuState.clone(this.state);
        let action: StepAction | null = null;
        let result: DrawableSudokuState | null = null;

        //This is a special case, if it got through all 9 numbers with only 1 being valid
        if (this.nextToAssign === 10) {
            action = StepAction.Assigned;
            this.state.cells[this.cell.y][this.cell.x].value = this.numbersThatFit[0];
            result = new DrawableSudokuState(this.state.cells, this.cell, action, this.getStats());
            return result;
        }

        if (this.state.isValid2(this.cell, this.nextToAssign)) {
            clone.cells[this.cell.y][this.cell.x].value = this.nextToAssign;

            if (this.numbersThatFit.length >= 1) {
                //This means that there's 2 numbers that fit
                //So we can't assign it yet
                this.numbersThatFit.push(this.nextToAssign);
                action = StepAction.LogicalFoundSecondOption;
                result = new DrawableSudokuState(clone.cells, this.cell, action, this.getStats());
            } else {
                //No other valid numbers yet
                this.numbersThatFit.push(this.nextToAssign);
                action = StepAction.LogicalFoundOption;
                result = new DrawableSudokuState(clone.cells, this.cell, action, this.getStats());
            }
        } else {
            //Not valid
            clone.cells[this.cell.y][this.cell.x].value = this.nextToAssign;

            action = StepAction.FailedToAssign;
            result = new DrawableSudokuState(clone.cells, this.cell, action, this.getStats());
        }

        if (action === StepAction.LogicalFoundSecondOption) {
            this.moveToNextCell();
        } else {
            this.nextToAssign++;
            if (this.nextToAssign === 10 &&
                this.numbersThatFit.length !== 1) {
                this.moveToNextCell();
            }
        }


        return result;
    }

    get givenUp(): boolean {
        return this._givenUp != null;
    }

    private getStats(): Stat[] {
        return [];
    }

    private moveToNextCell(): void {
        this.nextToAssign = 1;
        this.numbersThatFit = [];
        do {
            this.cell.x++;
            if (this.cell.x === 9) {
                this.cell.x = 0;
                this.cell.y++;
                if (this.cell.y === 9) {
                    //The end
                    this._givenUp = "Reached the end. Will eventually loop if 1 was assigned.";
                    console.info("Reached the end. Will eventually loop if 1 was assigned.");
                }
            }
        } while (!this.state.cells[this.cell.y][this.cell.x].needsValue);
    }
}