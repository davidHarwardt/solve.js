<script lang="ts">
    export let percentage;
    let container: HTMLDivElement;

    function seperatorGrab(ev: PointerEvent) {
        container.setPointerCapture(ev.pointerId);
        document.body.addEventListener("pointermove", move, false);
        document.body.addEventListener("pointerup", (ev: PointerEvent) => {
            container.releasePointerCapture(ev.pointerId);
            document.body.removeEventListener("pointermove", move, false);
        }, { once: true });
    }

    function move(ev: PointerEvent) {
        ev.preventDefault();
        percentage = Math.min(Math.max(ev.clientX / container.clientWidth, 0.05), 0.95);

        if(ev.shiftKey) {
            percentage = Math.floor(percentage / 0.05) * 0.05;
        }
    }

</script>

<div class="split-container" style:grid-template-columns={`${percentage * 100}% auto minmax(0, 1fr)`} bind:this={container}>
    <slot name="left"></slot>
    <div class="seperator" on:pointerdown={seperatorGrab}></div>
    <slot name="right"></slot>
</div>

<style>
    .split-container {
        width: 100%;
        display: grid;
        position: relative;
        /* grid-template-columns: 50% auto minmax(0, 1fr); */
    }

    ::slotted {
        position: relative;
    }

    .seperator {
        /* position: relative; */
        width: 0.2rem;
        background-color: var(--fg-sec);
        transition: 0.125s ease-out transform, background-color;

        cursor: ew-resize;
    }

    .seperator:hover {
        transform: scaleX(2);
        background-color: var(--fg-main);
        transition-delay: 0.5s;
    }
</style>