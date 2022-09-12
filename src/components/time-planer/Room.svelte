<script lang="ts">
import { setRoomNumber } from "../../scripts/controller";


    import type { Room, Timetable } from "src/scripts/view-data";
    import RoomSlot from "./RoomSlot.svelte";

    export let room: Room;
    export let timetable: Timetable;
</script>

<div class="room">
    <div class="heading">
        <div class="room-number-outer">
            <input type="text" placeholder="Raumnummer" class="room-number" on:change={v => setRoomNumber(room.uuid, v.currentTarget.value)} value={room.number}>
        </div>
    </div>
    <div class="room-slots" style={`grid-template-rows: ${timetable.map(v => v.duration.as("minutes") / 60 * 15 + "rem").join(" ")}`}>

        {#each room.slots as slot}
            <RoomSlot room={room} roomSlot={slot}/>
        {/each}
    </div>
</div>

<style>
    .room {
        width: 15rem;
    }

    .heading {
        height: calc(var(--room-head-height) - var(--padding-normal));
        margin: calc(var(--padding-normal) * 0.5);
        background-color: var(--bg-sec);
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0px 5px 15px 5px #0000001a;
        border-radius: var(--border-normal);
    }

    .room-slots {
        display: grid;
        position: relative;
        gap: var(--padding-normal);
        margin-top: calc(1.5 * var(--padding-normal));
    }

    .room-number {
        text-align: center;
        font-weight: bold;
        padding: var(--padding-small);
        margin: 0.5rem auto;
    }

    .room-number-outer {
        display: grid;
        align-items: center;
        justify-content: center;
    }
</style>