<script lang="ts">
    import type { Exam } from "src/scripts/working-data";
    import ExamCard from "./ExamCard.svelte";

    export let exams: Exam[];

    let search = "";
    function clear() { search = ""; }

    $: filtered = exams.filter(v => v.id.includes(search));

    let draggingOver = false;
    function dragEnter(ev: DragEvent) {
        ev.preventDefault();
        draggingOver = true;
    }

    function dragLeave(ev: DragEvent) {
        draggingOver = false;
    }

    function dragOver(ev: DragEvent) {
        ev.preventDefault();
    }

    function drop(ev: DragEvent) {
        ev.preventDefault();

        draggingOver = false;
    }

</script>

<div class="exam-container" on:dragover={dragOver} on:dragenter={dragEnter} on:dragleave={dragLeave} on:drop={drop}>
    <div class="search-bar-container">
        <input type="text" bind:value={search} class="search-bar">
        <input type="button" value="x" on:click={clear} class="clear-btn">
    </div>
    <div class="cards-container" class:dragging-over={draggingOver}>
        {#each filtered as exam}
            <ExamCard exam={exam} onRemove={() => {}}/>
        {/each}
    </div>
</div>

<style>
    .search-bar-container {
        display: grid;
        grid-template-columns: 1fr 2rem;
        padding: var(--padding-normal);
        gap: var(--padding-normal);
    }


    .cards-container {
        padding: var(--padding-normal);
        margin: var(--padding-normal);
        gap: var(--padding-normal);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        color: var(--bg-main);
        user-select: none;
        border-radius: var(--border-normal);
    }

    .dragging-over {
        outline: var(--fg-sec) 0.25rem solid;
        outline-offset: -0.5rem;
    }
</style>