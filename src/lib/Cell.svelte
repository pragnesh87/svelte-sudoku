<script>
  import { validate } from "../store/sudoku";
  export let row;
  export let col;
  export let val;
</script>

{#if val}
  <input
    type="number"
    maxlength="1"
    data-row={row}
    data-col={col}
    id="id{row}{col}"
    class="cell grey"
    value={val}
  />
{:else}
  <input
    type="number"
    maxlength="1"
    data-row={row}
    data-col={col}
    id="id{row}{col}"
    class="cell"
    value=""
    on:keyup={(e) => validate(e, row, col)}
  />
{/if}
