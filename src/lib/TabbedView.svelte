<script lang="ts">
    export let currentTab: string;
    export let tabs: string[];
</script>

<div class="tabbed-view">
    <div class="content">
        <slot/>
    </div>
    <div class="tabs">
        {#each tabs as tab}
            <div class="tab" class:active={currentTab === tab} on:click={_ => currentTab = tab}>{tab}</div> 
        {/each}
    </div>
</div>

<style>
    .tab {
        writing-mode: vertical-rl;
        padding: var(--padding-normal);
        margin: var(--padding-small);
        background-color: var(--bg-sec);
        cursor: pointer;
        user-select: none;
        border-radius: var(--border-small);
    }
    
    .active {
        outline: 0.2rem var(--fg-sec) solid;
    }

    .tabbed-view {
        display: grid;
        grid-template-columns: 1fr auto;
    }
</style>