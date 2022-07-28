<script>
  import Grid from "./lib/Grid.svelte";
</script>

<main>
  <h1>Svelte + Sudoku</h1>

  <div class="d-flex x-center y-middle">
    <div id="sudoku" class="sudoku-board" >
      <Grid/>
    </div>
  </div>
</main>
