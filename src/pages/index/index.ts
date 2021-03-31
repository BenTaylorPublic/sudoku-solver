class IndexView {

    private static startButton: HTMLInputElement;

    public static initialize(): void {
        this.startButton = document.getElementById("startButton") as HTMLInputElement;
        this.createEntryInputs();
        this.validate();
    }

    private static createEntryInputs(): void {
        const entryDiv: HTMLDivElement = document.getElementById("entry") as HTMLDivElement;

        for (let y: number = 0; y < 9; y++) {
            const row: HTMLDivElement = document.createElement("div");
            row.classList.add("row");
            let verticalSection: HTMLDivElement = document.createElement("div");
            verticalSection.classList.add("verticalSection");
            for (let x: number = 0; x < 9; x++) {
                const input: HTMLInputElement = document.createElement("input");
                input.type = "number";
                input.id = `${x}-${y}`;
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

            entryDiv.appendChild(row);

            if (y === 2 || y === 5) {
                const horizontalSection = document.createElement("div");
                horizontalSection.classList.add("horizontalSection");
                entryDiv.appendChild(horizontalSection);
            }
        }
    }

    private static validate(): void {
        //Check all values
        let total: number = 0;
        const validValues: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ""];
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `${x}-${y}`;
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
}

IndexView.initialize();