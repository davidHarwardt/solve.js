<script lang="ts">
    import { addExam } from "../../scripts/controller";

    import type { Exam } from "src/scripts/view-data";
    import ExamEditCard from "./ExamEditCard.svelte";

    export let exams: Exam[];
</script>

<div class="exam-container">
    {#each exams as exam}
        <ExamEditCard exam={exam}/> 
    {/each}
    <div class="add-exam-btn" on:click={_ => addExam()}>+</div>
</div>

<style>
    .exam-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1rem;
        align-content: flex-start;
        overflow: auto;
    }

    .add-exam-btn {
        user-select: none;
        cursor: pointer;
        font-size: 4rem;
        padding: var(--padding-large);
        margin: var(--padding-large);
        background-color: var(--bg-sec);
        border-radius: var(--border-normal);
        transition: 0.125s ease-out;
        height: fit-content;
        min-height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .add-exam-btn:hover {
        filter: brightness(1.1);
    }
</style>