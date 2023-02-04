<script>
    import { fly } from "svelte/transition";
    export let bulkSelected = {};
    export let actions;
    $: totalBulkSelected = Object.keys(bulkSelected).length;
</script>

{#if totalBulkSelected}
    <div class="bulkbar" transition:fly|local={{ duration: 150, y: 5 }}>
        <div class="txt">
            Đã chọn <strong>{totalBulkSelected}</strong>
        </div>
        <div class="flex-fill" />
        {#each actions as { label, onClick, isDanger = false }}
            <button
                type="button"
                class={`btn btn-sm btn-secondary ${isDanger && "btn-danger"}`}
                on:click={() => onClick()}
            >
                <span class="txt">{label}</span>
            </button>
        {/each}
    </div>
{/if}
