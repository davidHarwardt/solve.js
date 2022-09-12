<script lang="ts">
    import type { DateTime } from "luxon";
    import { addRoom } from "../../scripts/controller";
    import type { Room as RoomType, Timetable } from "src/scripts/view-data";

    import Room from "./Room.svelte";

    export let timetable: Timetable;
    export let rooms: RoomType[];

    function time(t: DateTime) { return `${t.hour.toString().padStart(2, "0")}:${t.minute.toString().padStart(2, "0")}`; }
</script>

<div class="room-container">
    <div class="time-table-container">
        <div class="spacer"></div>

        {#each timetable as slot}
            <div class="time-slot" data-from={time(slot.start)} data-to={time(slot.start.plus(slot.duration))} style:height={`calc(var(--room-height) * ${slot.duration.as("minutes") / 60})`}></div>            
        {/each}
        <div class="add-time-slot-btn">+</div>
    </div>
    <div class="rooms-container" style={`grid-template-columns: repeat(${rooms.length + 1}, auto)`}>
        {#each rooms as room}
            <Room room={room} timetable={timetable}/>
        {/each}
        <div class="add-room-btn" on:click={_ => addRoom()}>+</div>
    </div>
</div>

<style>
    :global(.room-container) {
        --room-height: 15rem;
        --room-head-height: 8rem;
    }

    .room-container {
        overflow: auto;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
    }

    .add-room-btn, .add-time-slot-btn {
        background-color: var(--bg-sec);
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        cursor: pointer;
        transition: 0.125s ease-out;
    }

    .add-room-btn:hover {
        filter: brightness(1.1);
    }

    .add-time-slot-btn {
        font-size: 2rem;
    }

    .add-room-btn {
        font-size: 4rem;
        padding: var(--padding-large);
        margin: var(--padding-normal);
        border-radius: var(--border-normal);
    }

    .rooms-container {
        display: grid;
        justify-content: left;
    }
    
    .spacer {
        height: var(--room-head-height);
        background-color: var(--bg-sec);
        width: 3rem;
        margin-bottom: var(--padding-normal);
        box-shadow: 5px 0px 15px 5px #0000001a;
    }

    .time-table-container {
        position: sticky;
        left: 0;
        z-index: 20;
    }

    .time-slot {
        width: 3rem;
        background-color: var(--bg-sec);

        position: relative;
        margin-bottom: var(--padding-normal);
        box-shadow: 5px 0px 15px 5px #0000001a;
    }

    .time-slot::before {
        content: attr(data-from);
        position: absolute;
        top: 0.25rem;
        left: 0.125rem;
    }

    .time-slot::after {
        content: attr(data-to);
        position: absolute;
        bottom: 0.25rem;
        left: 0.125rem;
    }
</style>