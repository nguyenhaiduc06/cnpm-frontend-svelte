<script>
    import { createEventDispatcher, tick } from "svelte";
    import { Record } from "pocketbase";
    import CommonHelper from "@/utils/CommonHelper";
    import OverlayPanel from "@/components/base/OverlayPanel.svelte";
    import TextField from "@/components/records/fields/TextField.svelte";
    import NumberField from "@/components/records/fields/NumberField.svelte";
    import BoolField from "@/components/records/fields/BoolField.svelte";
    import EmailField from "@/components/records/fields/EmailField.svelte";
    import UrlField from "@/components/records/fields/UrlField.svelte";
    import DateField from "@/components/records/fields/DateField.svelte";
    import SelectField from "@/components/records/fields/SelectField.svelte";
    import JsonField from "@/components/records/fields/JsonField.svelte";
    import FileField from "@/components/records/fields/FileField.svelte";
    import RelationField from "@/components/records/fields/RelationField.svelte";

    const dispatch = createEventDispatcher();
    const formId = "record_" + CommonHelper.randomString(5);

    export let title;
    export let fields;
    export let cancelLabel = "Cancel";
    export let submitLabel = "Submit";

    let panel;
    let record = new Record();
    let uploadedFilesMap = {};
    let deletedFileIndexesMap = {};

    function submit() {
        dispatch("submit", record);
        hide();
    }

    export function show(model) {
        console.log("🚀 ~ model", model)
        load(model);
        panel?.show();
    }

    export function hide() {
        panel?.hide();
    }

    async function load(model) {
        if (model?.clone) {
            record = model.clone();
        } else {
            record = new Record();
        }
        uploadedFilesMap = {};
        deletedFileIndexesMap = {};
    }
</script>

<OverlayPanel bind:this={panel} class="overlay-panel-lg record-panel" beforeHide={() => {}} on:hide on:show>
    <svelte:fragment slot="header">
        <h4>
            <strong>{title}</strong>
        </h4>
    </svelte:fragment>
    <div class="tabs-content">
        <form id={formId} class="tab-item active" on:submit|preventDefault={submit}>
            {#each fields as field (field.name)}
                {#if field.type === "text"}
                    <TextField {field} bind:value={record[field.name]} />
                {:else if field.type === "number"}
                    <NumberField {field} bind:value={record[field.name]} />
                {:else if field.type === "bool"}
                    <BoolField {field} bind:value={record[field.name]} />
                {:else if field.type === "email"}
                    <EmailField {field} bind:value={record[field.name]} />
                {:else if field.type === "url"}
                    <UrlField {field} bind:value={record[field.name]} />
                {:else if field.type === "date"}
                    <DateField {field} bind:value={record[field.name]} />
                {:else if field.type === "select"}
                    <SelectField {field} bind:value={record[field.name]} />
                {:else if field.type === "json"}
                    <JsonField {field} bind:value={record[field.name]} />
                {:else if field.type === "file"}
                    <FileField
                        {field}
                        {record}
                        bind:value={record[field.name]}
                        bind:uploadedFiles={uploadedFilesMap[field.name]}
                        bind:deletedFileIndexes={deletedFileIndexesMap[field.name]}
                    />
                {:else if field.type === "relation"}
                    <RelationField {field} bind:value={record[field.name]} />
                {/if}
            {/each}
        </form>
    </div>

    <svelte:fragment slot="footer">
        <button type="button" class="bth btn-secondary" disabled={false} on:click={() => hide()}>
            <span class="txt">{cancelLabel}</span>
        </button>
        <button
            type="submit"
            form={formId}
            class="btn btn-expanded"
            class:btn-loading={false}
            disabled={false}
        >
            <span class="txt">{submitLabel}</span>
        </button>
    </svelte:fragment>
</OverlayPanel>
