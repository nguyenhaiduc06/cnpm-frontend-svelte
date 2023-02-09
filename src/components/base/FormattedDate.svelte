<script>
    export let date = "";


    // $: dateOnly = date ? date.substring(0, 10) : null;
    $: dateOnly = date ? new Date(date).toLocaleDateString("vi") : null;

    // $: timeOnly = date ? date.substring(10, 19) : null;
    $: timeOnly = date ? new Date(date).toLocaleTimeString("vi") : null;
</script>

{#if date}
    <div class="datetime">
        <div class="date">{dateOnly}</div>
        <div class="time">{timeOnly}</div>
    </div>
{:else}
    <span class="txt txt-hint">N/A</span>
{/if}

<style>
    .datetime {
        width: 100%;
        display: block;
        line-height: var(--smLineHeight);
    }
    .time {
        font-size: var(--smFontSize);
        color: var(--txtHintColor);
    }
</style>
