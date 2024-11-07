document.addEventListener("DOMContentLoaded", function() {
    const bingoCard = document.getElementById("bingo-card");
    const status = document.getElementById("status");
    const size = 5;
    let selectedCells = Array(size).fill(null).map(() => Array(size).fill(false));
    let bingoNumbers = generateBingoNumbers();

    // ビンゴカードを生成（各列に指定された範囲の数字を格納）
    function generateBingoNumbers() {
        const card = [];

        for (let col = 0; col < size; col++) {
            const columnNumbers = new Set();
            while (columnNumbers.size < size) {
                let num = getRandomNumber(col);
                if (!columnNumbers.has(num)) columnNumbers.add(num);
            }
            card.push([...columnNumbers]);
        }

        card[Math.floor(size / 2)][Math.floor(size / 2)] = "FREE"; // 中央はFREE
        return card[0].map((_, colIndex) => card.map(row => row[colIndex])); // 転置して行ごとに返す
    }

    function getRandomNumber(column) {
        const min = column * 15 + 1;
        const max = column * 15 + 15;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function renderBingoCard() {
        bingoCard.innerHTML = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.textContent = bingoNumbers[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (bingoNumbers[i][j] === "FREE") {
                    cell.classList.add("selected");
                    selectedCells[i][j] = true;
                }

                cell.addEventListener("click", () => selectCell(cell, i, j));
                bingoCard.appendChild(cell);
            }
        }
    }

    function selectCell(cell, row, col) {
        if (cell.classList.contains("selected")) return;

        cell.classList.add("selected");
        selectedCells[row][col] = true;
        checkBingo();
    }

    function checkBingo() {
        let bingo = false;
        let reach = false;

        // 各列（B, I, N, G, O）のチェック
        for (let col = 0; col < size; col++) {
            const selectedCount = selectedCells.map(row => row[col]).filter(cell => cell).length;
            if (selectedCount === size) bingo = true;
            else if (selectedCount === size - 1) reach = true;
        }

        // 斜めのチェック（左上から右下）
        const diag1Count = selectedCells.map((row, i) => row[i]).filter(cell => cell).length;
        if (diag1Count === size) bingo = true;
        else if (diag1Count === size - 1) reach = true;

        // 斜めのチェック（右上から左下）
        const diag2Count = selectedCells.map((row, i) => row[size - 1 - i]).filter(cell => cell).length;
        if (diag2Count === size) bingo = true;
        else if (diag2Count === size - 1) reach = true;

        // 状態メッセージの表示
        if (bingo) {
            status.textContent = "ビンゴ！";
        } else if (reach) {
            status.textContent = "リーチ！";
        } else {
            status.textContent = "";
        }
    }

    renderBingoCard();
});

