<script lang="ts">
    import TabbedView from "../../lib/TabbedView.svelte";

    let currentTab: string = "Schüler";
</script>

<div class="tabs-container">
    <TabbedView bind:currentTab={currentTab} tabs={["Schüler", "Lehrer", "Räume"]}>
        {#if currentTab === "Schüler"}
            student
        {:else if currentTab === "Lehrer"}
            teacher
        {:else if currentTab === "Räume"}
            room
        {/if}
    </TabbedView>
</div>

<style>

</style>