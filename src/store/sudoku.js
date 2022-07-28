import {
	get,
	writable
} from "svelte/store";

export const grid = writable([
	[]
]);
export const isSolved = writable(0);

export const boardsize = 9;
export const gameArr = [
	"806047003901083547300900600680090300012376084009800706290760031003502060108400270", //0
	"001700509573024106800501002700295018009400305652800007465080071000159004908007053", //1
	"007300405000020900253064870090740360000030080836209047100802603600000018082610004", //2
	"032054900090001004080700031005600027800070000270140005000210300018907652603000000", //3
	"010000300000300051308146009900000000280050704000602900600400000000003107107805090", //4
	"005200000400300700600000010800020100040800500000095000083040070090006080500902000", //5
	"203008607140726009507139428025081904410903205079205036602010093700502001081367040", //6
];

const puzzleno = 5;
const puzzle = gameArr[puzzleno];

let candidates = [];
let emptyCells = [];

export function initGrid() {
	console.log('gridInit');
	let boxes = [
		[]
	];
	for (let i = 0; i < boardsize; i++) {
		if (i > 0) {
			boxes.push([]);
		}
		for (let j = 0; j < boardsize; j++) {
			let index = i * boardsize + j;
			let num = parseInt(puzzle.charAt(index));
			boxes[i][j] = num;
			if (num == 0) {
				emptyCells.push({
					"row": i,
					"col": j
				});
			}
		}
	}
	grid.set(boxes);
}

export function validate(e, row, col) {
	var val = parseInt(e.target.value) || 0;

	if (validateGridRowCol(row, col, val)) {

		grid.update($grid => {
			$grid[row][col] = val;
			console.log($grid);
			return $grid;
		});

		document.getElementById(`id${row}${col}`).classList.remove('error');
	} else {
		document.getElementById(`id${row}${col}`).classList.add('error');
	}
}

function validateGridRowCol(row, col, val) {
	if (checkRow(row, val) && checkCol(col, val) && checkGrid(row, col, val)) {
		return true;
	}
	return false;
}

function checkRow(row, num) {
	let boxes = get(grid);
	return boxes[row].indexOf(num) === -1;
}

function checkCol(col, num) {
	let boxes = get(grid);
	return boxes.map(row => row[col]).indexOf(num) === -1;
}

function checkGrid(row, col, num) {
	let boxArr = [];
	let boxes = get(grid);
	let rowStart = row - (row % 3);
	let colStart = col - (col % 3);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			boxArr.push(boxes[rowStart + i][colStart + j]);
		}
	}
	return boxArr.indexOf(num) === -1;
}

function getCandidValue(row, col) {
	var candid = [];
	for (let num = 1; num <= 9; num++) {
		if (validateGridRowCol(row, col, num)) {
			candid.push(num);
		}
	}
	if (candid.length > 0) {
		let current = {};
		current.row = row;
		current.col = col;
		current.candid = candid;

		candidates.push(current);
	}
}

export function solveUsingCandid() {
	emptyCells.forEach(function (element, index) {
		getCandidValue(element.row, element.col);
	});

	sortCadidValues();

	console.log(candidates);
}

function sortCadidValues() {
	candidates = removeEmptyCandidValues();
	candidates.sort(function (a, b) {
		return parseInt(a.candid.length) - parseInt(b.candid.length);
	});
}

function removeCandidValueAt(row, col, val) {
	return candidates.filter(function (cell) {
		if (cell.row === row && cell.col === col && cell.candid.length > 0) {
			let array = cell.candid;
			var ind = array.indexOf(val);
			if (ind !== -1) {
				array.splice(ind, 1);
			}

			return array;
		}
	});
}

function removeEmptyCandidValues() {
	return candidates.filter(function (cell) {
		return cell.candid.length > 0;
	});
}

export function solveNext() {
	candidates.forEach(function (element, index) {
		if (element.candid.length == 1) {
			console.log(`checking value at ${element.row}${element.col}`);
			let num = element.candid[0];
			document.getElementById(`id${element.row}${element.col}`).value = num;
			grid.update($grid => {
				$grid[element.row][element.col] = num;
				return $grid;
			});

			removeCandidValueFromRow(element.row, num);
			removeCandidValueFromCol(element.col, num);
			removeCandidValueFromGrid(element.row, element.col, num);
		}
	});
	sortCadidValues();
	if (candidates.length == 0) {
		isSolved.set(1);
	}
	console.log(candidates);
}

function removeCandidValueFromRow(row, val) {
	candidates.forEach(function (cell, index) {
		if (cell.row == row) {
			let array = cell.candid;
			var ind = array.indexOf(val);
			if (ind !== -1) {
				array.splice(ind, 1);
			}

			cell.candid = array;
		}
	});
}

function removeCandidValueFromCol(col, val) {
	candidates.forEach(function (cell, index) {
		if (cell.col == col) {
			let array = cell.candid;
			var ind = array.indexOf(val);
			if (ind !== -1) {
				array.splice(ind, 1);
			}

			cell.candid = array;
		}
	});
}

function removeCandidValueFromGrid(row, col, val) {
	let rowStart = row - (row % 3);
	let colStart = col - (col % 3);

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let values = removeCandidValueAt(rowStart + i, colStart + j, val);
		}
	}
}