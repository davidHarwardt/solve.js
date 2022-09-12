<script lang="ts">
    enum SelectedView {
        TimePlaner,
        ExamEditor,
    }

    export let onSelect: (v: "time-planer" | "exam-editor") => void;
    export let selectedView;

</script>

<div class="title-bar">
    <div class="title-left"></div>
    <div class="title-center">
        <div class="select-tab" on:click={_ => onSelect("time-planer")} class:active={selectedView === "time-planer"}>Räume</div>
        <div class="select-tab" on:click={_ => onSelect("exam-editor")} class:active={selectedView === "exam-editor"}>Prüfungen</div>
    </div>
    <div class="title-right"></div>
</div>

<style>
    .title-bar {
        background-color: var(--bg-sec);
    }

    .title-center {
        text-align: center;
    }

    .active {
        outline: var(--fg-sec) 0.2rem solid;
    }

    .select-tab {
        display: inline-block;
        padding: var(--padding-normal);
        margin: var(--padding-small);
        background-color: var(--bg-main);
        border-radius: var(--border-small);
        transition: 0.125s ease-out;
        user-select: none;
        cursor: pointer;
    }

    .select-tab:hover {
        filter: brightness(1.1);
    }
</style>