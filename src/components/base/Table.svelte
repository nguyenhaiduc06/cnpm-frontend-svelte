<script>
    import { createEventDispatcher } from "svelte";
    import CommonHelper from "@/utils/CommonHelper";
    import SortHeader from "@/components/base/SortHeader.svelte";
    import HorizontalScroller from "@/components/base/HorizontalScroller.svelte";
    import RecordFieldCell from "@/components/records/RecordFieldCell.svelte";

    const dispatch = createEventDispatcher();

    export let isLoading;
    export let records = [];
    export let fields;
    export let bulkSelected = {};
    export let sort = "";
    export let filter = "";

    $: totalBulkSelected = Object.keys(bulkSelected).length;

    $: areAllRecordsSelected = records.length && totalBulkSelected === records.length;

    function toggleSelectAllRecords() {
        if (areAllRecordsSelected) {
            deselectAllRecords();
        } else {
            selectAllRecords();
        }
    }

    function deselectAllRecords() {
        bulkSelected = {};
    }

    function selectAllRecords() {
        for (const record of records) {
            bulkSelected[record.id] = record;
        }
        bulkSelected = bulkSelected;
    }

    function toggleSelectRecord(record) {
        if (!bulkSelected[record.id]) {
            bulkSelected[record.id] = record;
        } else {
            delete bulkSelected[record.id];
        }

        bulkSelected = bulkSelected; // trigger reactivity
    }
</script>

<HorizontalScroller class="table-wrapper">
    <table class="table" class:table-loading={isLoading}>
        <thead>
            <tr>
                <th class="bulk-select-col min-width">
                    {#if isLoading}
                        <span class="loader loader-sm" />
                    {:else}
                        <div class="form-field">
                            <input
                                type="checkbox"
                                id="checkbox_0"
                                disabled={!records.length}
                                checked={areAllRecordsSelected}
                                on:change={() => toggleSelectAllRecords()}
                            />
                            <label for="checkbox_0" />
                        </div>
                    {/if}
                </th>

                {#each fields as field (field.name)}
                    <SortHeader
                        class="col-type-{field.type} col-field-{field.name}"
                        name={field.name}
                        bind:sort
                    >
                        <div class="col-header-content">
                            <!-- <i class={CommonHelper.getFieldTypeIcon(field.type)} /> -->
                            <span class="txt">{field.label}</span>
                        </div>
                    </SortHeader>
                {/each}

                <th class="col-type-action min-width">
                    <button type="button" class="btn btn-sm btn-secondary p-0">
                        <i class="ri-more-line" />
                    </button>
                </th>
            </tr>
        </thead>
        <tbody>
            {#each records as record (record.id)}
                <tr
                    tabindex="0"
                    class="row-handle"
                    on:click={() => dispatch("select", record)}
                    on:keydown={(e) => {
                        if (e.code === "Enter") {
                            e.preventDefault();
                            dispatch("select", record);
                        }
                    }}
                >
                    <td class="bulk-select-col min-width">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="form-field" on:click|stopPropagation>
                            <input
                                type="checkbox"
                                id="checkbox_{record.id}"
                                checked={bulkSelected[record.id]}
                                on:change={() => toggleSelectRecord(record)}
                            />
                            <label for="checkbox_{record.id}" />
                        </div>
                    </td>

                    {#each fields as field (field.name)}
                        <!-- <RecordFieldCell {record} {field} /> -->
                        <td>{record[field.name]}</td>
                    {/each}

                    <td class="col-type-action min-width">
                        <i class="ri-arrow-right-line" />
                    </td>
                </tr>
            {:else}
                {#if isLoading}
                    <tr>
                        <td colspan="99" class="p-xs">
                            <span class="skeleton-loader" />
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="99" class="txt-center txt-hint p-xs">
                            <h6>Không có dữ liệu</h6>
                            {#if filter?.length}
                                <button
                                    type="button"
                                    class="btn btn-hint btn-expanded m-t-sm"
                                    on:click={() => (filter = "")}
                                >
                                    <span class="txt">Clear filters</span>
                                </button>
                            {/if}
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</HorizontalScroller>

{#if records.length}
    <small class="block txt-hint txt-right m-t-sm">Đang hiển thị {records.length} kết quả</small>
{/if}
