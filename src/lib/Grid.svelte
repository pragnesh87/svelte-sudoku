<script>
  import { onMount } from "svelte";
  import {
    grid,
    initGrid,
    solveUsingCandid,
    solveNext,
    isSolved,
  } from "../store/sudoku";
  import Cell from "./Cell.svelte";

  onMount(() => {
    initGrid();
    solveUsingCandid();
  });

  console.log($grid);
</script>

{#each $grid as values, row}
  {#each values as _, col}
    <Cell {row} {col} val={$grid[row][col]} />
  {/each}
{/each}

{#if !$isSolved}
  <button type="button" on:click={(e) => solveNext()}>Solve Next</button>
{/if}
