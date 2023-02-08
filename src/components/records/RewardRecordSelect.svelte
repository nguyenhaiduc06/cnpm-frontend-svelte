<script>
    import ApiClient from "@/utils/ApiClient";
    import CommonHelper from "@/utils/CommonHelper";
    import ObjectSelect from "@/components/base/ObjectSelect.svelte";
    import RecordSelectOption from "./RecordSelectOption.svelte";
    import RecordUpsertPanel from "@/components/records/RecordUpsertPanel.svelte";
    import { querystring } from "svelte-spa-router";
    import GiftSelect from "../base/GiftSelect.svelte";
    import RewardSelect from "../base/RewardSelect.svelte";

    const uniqueId = "select_" + CommonHelper.randomString(5);

    // original select props
    export let multiple = false;
    export let selected = [];
    export let keyOfSelected = multiple ? [] : undefined;
    export let selectPlaceholder;
    export let disable = false;
    export let unique = "";
    export let labelMetaField;
    export let optionMetaField;
    export let optionComponent = RecordSelectOption; // custom component to use for each dropdown option item

    let selectComponent = () => {};

    // custom props
    export let collectionId;
    export let filter;
    $: keyOfSelected = disable ? selectPlaceholder : keyOfSelected;
    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("rewardreport") || "";

    let list = [];
    let currentPage = 1;
    let totalItems = 0;
    let isLoadingList = false;
    let isLoadingSelected = false;
    let isLoadingCollection = false;
    let collection = null;
    let upsertPanel;

    $: if (collectionId) {
        loadCollection();
        loadSelected().then(() => {
            loadList(true);
        });
    }

    $: isLoading = isLoadingList || isLoadingSelected;

    $: canLoadMore = totalItems > list.length;

    async function loadCollection() {
        if (!collectionId) {
            collection = null;
            isLoadingCollection = false;
            return;
        }

        isLoadingCollection = true;

        try {
            collection = await ApiClient.collections.getOne(collectionId, {
                filter: filter,
                $cancelKey: "collection_" + uniqueId,
            });
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isLoadingCollection = false;
    }

    async function loadSelected() {
        const selectedIds = CommonHelper.toArray(keyOfSelected);

        if (!collectionId || !selectedIds.length) {
            return;
        }

        isLoadingSelected = true;

        let loadedItems = [];

        // batch load all selected records to avoid parser stack overflow errors
        const filterIds = selectedIds.slice();
        const loadPromises = [];
        while (filterIds.length > 0) {
            const filters = [];
            for (const id of filterIds.splice(0, 50)) {
                filters.push(`id="${id}"`);
            }

            loadPromises.push(
                ApiClient.collection(collectionId).getFullList(200, {
                    filter: filters.join("||"),
                    $autoCancel: false,
                })
            );
        }

        try {
            await Promise.all(loadPromises).then((values) => {
                loadedItems = loadedItems.concat(...values);
            });

            // preserve selected order
            selected = [];
            for (const id of selectedIds) {
                const item = CommonHelper.findByKey(loadedItems, "id", id);
                if (item) {
                    selected.push(item);
                }
            }

            // add the selected models to the list (if not already)
            list = CommonHelper.filterDuplicatesByKey(selected.concat(list));
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isLoadingSelected = false;
    }

    async function loadList(reset = false) {
        if (!collectionId) {
            return;
        }

        isLoadingList = true;

        try {
            const page = reset ? 1 : currentPage + 1;

            const snapshots = await ApiClient.collection(collectionId).getList(page, 200, {
                sort: "-created",
                filter:
                    collectionId == "resident_snapshots"
                        ? filter
                            ? `${filter} && active = true`
                            : "active = true"
                        : filter,
                $cancelKey: uniqueId + "loadList",
                expand: "resident, household, gift",
            });

            if (reset) {
                list = CommonHelper.toArray(selected).slice();
            }
            const rewardList = await ApiClient.collection("reward").getList(1, 200, {
                sort: "",
                filter: `reward_report="${reportId}"`,
            });
            if (unique && unique.length > 0) {
                const existedItems = rewardList.items.map((x) => x[unique]);
                snapshots.items = snapshots.items.filter((x) => !existedItems.includes(x.resident));
            }
            snapshots.items.map((x) => (x.id = x.resident));
            snapshots.items.map((x) => {
                (x.name = x.expand.resident.name), (x.household = x.expand.household.address);
            });

            list = CommonHelper.filterDuplicatesByKey(
                list.concat(snapshots.items, CommonHelper.toArray(selected))
            );
            currentPage = snapshots.page;
            totalItems = snapshots.totalItems;
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isLoadingList = false;
    }
</script>

<ObjectSelect
    selectPlaceholder={isLoading ? "Loading..." : selectPlaceholder}
    items={list}
    tmpItems={list}
    searchable={list.length > 5}
    selectionKey="id"
    labelComponent={optionComponent}
    selectComponent={RewardSelect}
    labelComponentProps={{
        metaField: labelMetaField,
    }}
    optionComponentProps={{
        metaField: optionMetaField,
    }}
    disabled={isLoading || disable}
    {optionComponent}
    {multiple}
    bind:keyOfSelected
    bind:selected
    on:show
    on:hide
    class="records-select block-options"
    {...$$restProps}
>
    <svelte:fragment slot="afterOptions">
        {#if !isLoadingCollection && collection}
            <button
                type="button"
                class="btn btn-warning btn-block btn-sm m-t-5"
                on:click={() => upsertPanel?.show()}
            >
                <span class="txt">New record</span>
            </button>
        {/if}
        {#if canLoadMore}
            <button
                type="button"
                class="btn btn-block btn-sm m-t-5"
                class:btn-loading={isLoadingList}
                class:btn-disabled={isLoadingList}
                on:click|stopPropagation={() => loadList()}
            >
                <span class="txt">Load more</span>
            </button>
        {/if}
    </svelte:fragment>
</ObjectSelect>

<RecordUpsertPanel
    bind:this={upsertPanel}
    {collection}
    on:save={(e) => {
        if (e?.detail?.id) {
            keyOfSelected = CommonHelper.toArray(keyOfSelected).concat(e.detail.id);
        }
        loadList(true);
    }}
/>
