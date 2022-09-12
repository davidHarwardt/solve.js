<script lang="ts">
    import SplitContainer from "./lib/SplitContainer.svelte";
    import RoomContainer from "./components/time-planer/RoomContainer.svelte";

    import { store } from "./scripts/controller";
    import type { ViewData } from "./scripts/view-data";
    import PlanerExamContainer from "./components/time-planer/ExamContainer.svelte";
    import EditorExamContiner from "./components/exam-editor/ExamContainer.svelte";
    import Titlebar from "./components/Titlebar.svelte";
    import TabsContainer from "./components/exam-editor/TabsContainer.svelte";

    let selected = "time-planer";
    function onSelect(v: "time-planer" | "exam-editor") {
        selected = v;
    }

    let viewPercentage = 0.8;

    let data: ViewData;
    store.subscribe(v => {
        data = v;
    });
</script>

<div class="app">
    <Titlebar selectedView={selected} onSelect={onSelect}/>
    {#if selected === "time-planer"}
        <SplitContainer bind:percentage={viewPercentage}>
            <RoomContainer timetable={data.timetable} rooms={data.rooms} slot="left"/>
            <PlanerExamContainer exams={data.remainingExams} slot="right"/>
        </SplitContainer>
    {:else}
        <SplitContainer bind:percentage={viewPercentage}>
            <EditorExamContiner exams={data.remainingExams} slot="left"/>
            <TabsContainer slot="right"/>
        </SplitContainer>
    {/if}
</div>

<style>
    .app {
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
    }

    :global(::-webkit-scrollbar) {
        width: 0.5rem;
        height: 0.5rem;
    }

    :global(::-webkit-scrollbar-track) {
        background-color: transparent;
    }

    :global(::-webkit-scrollbar-thumb) {
        background-color: var(--fg-sec);
        /* border-radius: 0.25rem; */
        /* border-radius: 0.25rem; */
    }

    :global(::-webkit-scrollbar-corner) {
        background-color: transparent;
    }
</style>