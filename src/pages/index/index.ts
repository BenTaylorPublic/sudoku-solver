import {SudokuState} from "../../shared/sudoku-state";
import {SudokuAlgorithm} from "../../shared/sudoku-algorithm";
import {DepthFirst} from "../../shared/algorithms/depth-first";
import {SudokuCell} from "../../shared/sudoku-cell";
import {DrawableSudokuState} from "../../shared/drawable-sudoku-state";
import {StepAction} from "../../shared/enums";

class IndexView {

    private static startButton: HTMLButtonElement;
    private static stepButton: HTMLButtonElement;
    private static algorithm: SudokuAlgorithm;

    public static initialize(): void {
        this.startButton = document.getElementById("startButton") as HTMLButtonElement;
        this.startButton.onclick = this.start.bind(this);
        this.stepButton = document.getElementById("stepButton") as HTMLButtonElement;
        this.stepButton.onclick = this.step.bind(this);
        this.createEntryInputs();
        this.validate();
        this.createVisualizationDivs();
    }

    private static createEntryInputs(): void {
        const inputBoxes: HTMLDivElement = document.getElementById("inputBoxes") as HTMLDivElement;

        for (let y: number = 0; y < 9; y++) {
            const row: HTMLDivElement = document.createElement("div");
            row.classList.add("row");
            let verticalSection: HTMLDivElement = document.createElement("div");
            verticalSection.classList.add("verticalSection");
            for (let x: number = 0; x < 9; x++) {
                const input: HTMLInputElement = document.createElement("input");
                input.type = "number";
                input.id = `i-${y}-${x}`;
                input.min = "1";
                input.max = "9";
                input.onkeyup = this.validate.bind(this);

                verticalSection.appendChild(input);

                if (x === 2 || x === 5) {
                    row.appendChild(verticalSection);
                    verticalSection = document.createElement("div");
                    verticalSection.classList.add("verticalSection");
                }
            }
            row.appendChild(verticalSection);

            inputBoxes.appendChild(row);

            if (y === 2 || y === 5) {
                const horizontalSection = document.createElement("div");
                horizontalSection.classList.add("horizontalSection");
                inputBoxes.appendChild(horizontalSection);
            }
        }
    }

    private static validate(): void {
        //Check all values
        let total: number = 0;
        const validValues: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ""];
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `i-${y}-${x}`;
                const input: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                if (!validValues.includes(input.value)) {
                    //Invalid
                    this.startButton.disabled = true;
                    return;
                }
                total += Number(input.value);
            }
        }

        if (total <= 0) {
            //Invalid
            this.startButton.disabled = true;
            return;
        }

        this.startButton.disabled = false;
    }

    private static createVisualizationDivs(): void {
        const visualizationBoxes: HTMLDivElement = document.getElementById("visualizationBoxes") as HTMLDivElement;

        for (let y: number = 0; y < 9; y++) {
            const row: HTMLDivElement = document.createElement("div");
            row.classList.add("row");
            let verticalSection: HTMLDivElement = document.createElement("div");
            verticalSection.classList.add("verticalSection");
            for (let x: number = 0; x < 9; x++) {
                const div: HTMLDivElement = document.createElement("div");
                div.id = `v-${y}-${x}`;
                div.classList.add("vCell");
                verticalSection.appendChild(div);

                if (x === 2 || x === 5) {
                    row.appendChild(verticalSection);
                    verticalSection = document.createElement("div");
                    verticalSection.classList.add("verticalSection");
                }
            }
            row.appendChild(verticalSection);

            visualizationBoxes.appendChild(row);

            if (y === 2 || y === 5) {
                const horizontalSection = document.createElement("div");
                horizontalSection.classList.add("horizontalSection");
                visualizationBoxes.appendChild(horizontalSection);
            }
        }
    }

    private static start(): void {
        this.startButton.disabled = true;

        const startingState: SudokuState = new SudokuState();

        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `i-${y}-${x}`;
                const input: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                if (input.value !== "") {
                    startingState.setInitialValue(x, y, Number(input.value));
                }
            }
        }
        this.initialDraw(startingState);
        this.solvingLogic(startingState);
    }

    private static async solvingLogic(startingState: SudokuState): Promise<void> {
        this.algorithm = new DepthFirst();

        this.algorithm.setup(startingState);

        const autoStep: boolean = (document.getElementById("autostep") as HTMLInputElement).checked;
        if (autoStep) {
            let state: DrawableSudokuState;
            do {
                state = this.algorithm.step();
                this.draw(state);
                await this.delay(1);
                if ((state.isSolved && state.action === StepAction.Assigned) || this.algorithm.givenUp) {
                    break;
                }
            } while (true);
            console.log(`solved: ${state.isSolved}`);
            console.log(`givenUp: ${this.algorithm.givenUp}`);
        } else {
            this.stepButton.disabled = false;
        }

    }

    private static step(): void {
        this.stepButton.disabled = true;
        const state: DrawableSudokuState = this.algorithm.step();
        this.draw(state);
        if (state.isSolved || this.algorithm.givenUp) {
            alert("End");
            return;
        }
        this.stepButton.disabled = false;
    }

    private static draw(state: DrawableSudokuState): void {
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `v-${y}-${x}`;
                const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
                const cell: SudokuCell = state.cells[y][x];
                if (cell.value == null) {
                    div.innerText = "";
                } else {
                    div.innerText = cell.value.toString();
                }

                if (cell.locked) {
                    div.classList.add("locked");
                } else {
                    div.classList.remove("locked");
                }

                div.classList.remove("assigned");
                div.classList.remove("failedToAssign");
            }
        }

        if (state.lastActionedCell != null) {
            const id: string = `v-${state.lastActionedCell.y}-${state.lastActionedCell.x}`;
            const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
            if (state.action === StepAction.Assigned) {
                div.classList.add("assigned");
            } else {
                div.classList.add("failedToAssign");
            }
        }
    }

    private static initialDraw(state: SudokuState): void {
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `v-${y}-${x}`;
                const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
                const cell: SudokuCell = state.cells[y][x];
                if (cell.value != null) {
                    div.innerText = cell.value.toString();
                }

                if (cell.locked) {
                    div.classList.add("locked");
                }
            }
        }
    }

    private static async delay(ms: number): Promise<void> {
        await new Promise(resolve => setTimeout(() => resolve(1), ms));
    }
}

IndexView.initialize();