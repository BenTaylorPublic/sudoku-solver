import {SudokuState} from "../../shared/sudoku-state";
import {SudokuAlgorithm} from "../../shared/sudoku-algorithm";
import {DepthFirst} from "../../shared/algorithms/depth-first";
import {SudokuCell} from "../../shared/sudoku-cell";

class IndexView {

    private static startButton: HTMLInputElement;

    public static initialize(): void {
        this.startButton = document.getElementById("startButton") as HTMLInputElement;
        this.startButton.onclick = this.start.bind(this);
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
        this.draw(startingState);
        this.solvingLogic(startingState);
    }

    private static solvingLogic(startingState: SudokuState): void {
        const algorithm: SudokuAlgorithm = new DepthFirst();

        algorithm.setup(startingState);

        let state: SudokuState;
        do {
            state = algorithm.step();
        } while (!state.isSolved || algorithm.givenUp);
        this.draw(state);
    }

    private static draw(state: SudokuState): void {
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

                div.classList.remove("lastCellSet");
            }
        }

        if (state.lastCellSet != null) {
            const id: string = `v-${state.lastCellSet.y}-${state.lastCellSet.x}`;
            const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
            div.classList.add("lastCellSet");
        }
    }
}

IndexView.initialize();