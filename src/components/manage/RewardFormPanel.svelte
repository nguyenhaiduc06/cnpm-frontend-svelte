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
    import RewardRecordSelect from "../records/RewardRecordSelect.svelte";
    import { CollectionResidents } from "@/utils/database/collections";
    import RecordSelect from "../records/RecordSelect.svelte";

    const dispatch = createEventDispatcher();
    const formId = "record_" + CommonHelper.randomString(5);

    export let title;
    export let fields;
    export let cancelLabel = "Cancel";
    export let submitLabel = "Submit";
    export let excludedFields = {};
    export let relationFieldComponent = RelationField;
    export let household;

    let panel;
    let record = new Record();
    let uploadedFilesMap = {};
    let deletedFileIndexesMap = {};
    let residentsCollectionId = CollectionResidents.id;

    function submit() {
        let data = exportFormData();
        dispatch("submit", data);
        hide();
    }
    $: filter = household == "" ? "" : `household="${household}"`;

    export function show(model) {
        console.log("🚀 ~ model", model);
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
    function exportFormData() {
        const data = record?.export() || {};
        const formData = new FormData();

        const exportableFields = {};
        for (const field of fields || []) {
            exportableFields[field.name] = true;
        }
        // export base fields
        for (const key in data) {
            // skip non-schema fields
            if (!exportableFields[key]) {
                continue;
            }
            // normalize nullable values
            if (typeof data[key] === "undefined") {
                data[key] = null;
            }

            CommonHelper.addValueToFormData(formData, key, data[key]);
        }

        // add uploaded files  (if any)
        for (const key in uploadedFilesMap) {
            const files = CommonHelper.toArray(uploadedFilesMap[key]);
            for (const file of files) {
                formData.append(key, file);
            }
        }

        // unset deleted files (if any)
        for (const key in deletedFileIndexesMap) {
            const indexes = CommonHelper.toArray(deletedFileIndexesMap[key]);
            for (const index of indexes) {
                formData.append(key + "." + index, "");
            }
        }

        return formData;
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
                    <svelte:component
                        this={relationFieldComponent}
                        {field}
                        bind:value={record[field.name]}
                        filter={field.options?.collectionId == "resident_snapshots" ? filter : ""}
                        excluded={excludedFields[field.name]}
                        recordSelectComponent={field.options?.collectionId == "resident_snapshots" ? RewardRecordSelect : RecordSelect}
                    />
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
