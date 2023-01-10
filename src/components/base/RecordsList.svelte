<script>
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import ApiClient from "@/utils/ApiClient";
    import CommonHelper from "@/utils/CommonHelper";
    import tooltip from "@/actions/tooltip";
    import { confirm } from "@/stores/confirmation";
    import { addSuccessToast } from "@/stores/toasts";
    import SortHeader from "@/components/base/SortHeader.svelte";
    import Toggler from "@/components/base/Toggler.svelte";
    import Field from "@/components/base/Field.svelte";
    import FormattedDate from "@/components/base/FormattedDate.svelte";
    import IdLabel from "@/components/base/IdLabel.svelte";
    import HorizontalScroller from "@/components/base/HorizontalScroller.svelte";
    import RecordFieldCell from "@/components/records/RecordFieldCell.svelte";

    const dispatch = createEventDispatcher();

    export let isLoading = true;
    export let records = [];
    export let fields = [];
    export let sort = "";
    export let filter = "";

    let isDeleting = false;
    let bulkSelected = {};

    $: totalBulkSelected = Object.keys(bulkSelected).length;

    $: areAllRecordsSelected = records.length && totalBulkSelected == records.length;

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

    function deleteSelectedConfirm() {
        const msg = `Do you really want to delete the selected ${
            totalBulkSelected === 1 ? "record" : "records"
        }?`;

        confirm(msg, deleteSelected);
    }

    async function deleteSelected() {
        if (isDeleting || !totalBulkSelected || !collection?.id) {
            return;
        }

        let promises = [];
        for (const recordId of Object.keys(bulkSelected)) {
            promises.push(ApiClient.collection(collection.id).delete(recordId));
        }

        isDeleting = true;

        return Promise.all(promises)
            .then(() => {
                addSuccessToast(
                    `Successfully deleted the selected ${totalBulkSelected === 1 ? "record" : "records"}.`
                );
                deselectAllRecords();
            })
            .catch((err) => {
                ApiClient.errorResponseHandler(err);
            })
            .finally(() => {
                isDeleting = false;

                // always reload because some of the records may not be deletable
                return reloadLoadedPages();
            });
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
                        <RecordFieldCell {record} {field} />
                    {/each}
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
                            <h6>No records found.</h6>
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
    <small class="block txt-hint txt-right m-t-sm">Showing {records.length} records</small>
{/if}

{#if totalBulkSelected}
    <div class="bulkbar" transition:fly|local={{ duration: 150, y: 5 }}>
        <div class="txt">
            Selected <strong>{totalBulkSelected}</strong>
            {totalBulkSelected === 1 ? "record" : "records"}
        </div>
        <button
            type="button"
            class="btn btn-xs btn-secondary btn-outline p-l-5 p-r-5"
            class:btn-disabled={isDeleting}
            on:click={() => deselectAllRecords()}
        >
            <span class="txt">Reset</span>
        </button>
        <div class="flex-fill" />
        <button
            type="button"
            class="btn btn-sm btn-secondary btn-danger"
            class:btn-loading={isDeleting}
            class:btn-disabled={isDeleting}
            on:click={() => deleteSelectedConfirm()}
        >
            <span class="txt">Delete selected</span>
        </button>
    </div>
{/if}
