<script lang="ts">
    import type { Exam } from "src/scripts/view-data";



    export let exam: Exam;
</script>

<div class="exam-edit-card">
    {exam.id}: test
</div>

<style>
    .exam-edit-card {
        color: var(--bg-main);
        background-color: var(--color-blue);
        padding: var(--padding-normal);
        border-radius: var(--border-normal);
        width: 20ch;
        height: fit-content;
        min-height: 9rem;
    } 
</style>