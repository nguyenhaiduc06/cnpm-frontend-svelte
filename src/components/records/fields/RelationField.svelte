<script>
    import { SchemaField } from "pocketbase";
    import CommonHelper from "@/utils/CommonHelper";
    import RecordSelect from "@/components/records/RecordSelect.svelte";
    import Field from "@/components/base/Field.svelte";

    export let field = new SchemaField();
    export let value = undefined;
    export let excluded = false;
    export let recordSelectComponent = RecordSelect;
    export let existedValues = [];

    $: isMultiple = field.options?.maxSelect != 1;
    $: if (
        isMultiple &&
        Array.isArray(value) &&
        field.options?.maxSelect &&
        value.length > field.options.maxSelect
    ) {
        value = value.slice(field.options.maxSelect - 1);
    }
</script>

<Field class="form-field {field.required ? 'required' : ''}" name={field.name} let:uniqueId>
    <label for={uniqueId}>
        <i class={CommonHelper.getFieldTypeIcon(field.type)} />
        <span class="txt">{field.name}</span>
    </label>
    <svelte:component
        this={recordSelectComponent}
        toggle
        disable={excluded}
        defaultVal={excluded.defaultVal}
        id={uniqueId}
        multiple={isMultiple}
        selectPlaceholder={excluded && excluded.defaultVal ? excluded.defaultVal : "- Select -"}
        collectionId={field.options?.collectionId}
        bind:keyOfSelected={value}
        {existedValues}
        {...$$restProps}
    />
    {#if field.options?.maxSelect > 1}
        <div class="help-block">Select up to {field.options.maxSelect} items.</div>
    {/if}
</Field>
