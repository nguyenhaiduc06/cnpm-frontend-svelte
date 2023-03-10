<script>
    import { querystring } from "svelte-spa-router";
    import { push } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGift, CollectionReward } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import GiftUpsertPanel from "./GiftUpsertPanel.svelte";
    import { Api } from "@/services/api";
    import CommonHelper from "@/utils/CommonHelper";
    import Table from "../base/Table.svelte";
    import BulkBar from "../base/BulkBar.svelte";
    import RewardFormPanel from "./RewardFormPanel.svelte";
    import CustomFormPanel from "./CustomFormPanel.svelte";
    import CustomSearchBar from "../base/CustomSearchBar.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("rewardReport") || "";
    $: year = reactiveParams.get("year") || "";
    $: occasion = reactiveParams.get("occasion") || "";
    let residentUpsertPanel;
    let residentsList;
    let rewardUpsertPanel;
    let rewardSelectPanel;
    let filter;
    let sort;
    let rewardList;

    $: records = [];
    $: baseRecords = [];
    let selectedHouseholds = [];
    let isLoading;

    let rewardResidents;
    let residents;
    let households;

    $: filter = reportId ? `gift_report ="${reportId}"` : "";

    load();
    async function load() {
        reactiveParams = new URLSearchParams($querystring);
        reportId = reactiveParams.get("rewardreport") || "";
        year = reactiveParams.get("year") || "";
        isLoading = true;

        rewardResidents = await Api.getRewards(reportId);

        residents = (await Api.getAllResidents()).filter((x) =>
            rewardResidents.find((n) => n.resident == x.resident)
        );
        records = [];
        households = await Api.getHouseholds({});

        for (let i of residents) {
            let reward = rewardResidents.find((x) => x.resident == i.resident);
            let index = records.findIndex((x) => x.householdId == i.household);
            let numReward = CommonHelper.getCorrespondingRewards(reward.education_result);
            if (index == -1) {
                let household = households.find((x) => x.id == i.household)?.address;
                if (household) {
                    records.push({
                        householdId: i.household,
                        household: household,
                        reward_received: 1,
                        id: records.length + 1,
                        total_cost: reward ? numReward * CommonHelper.costPerReward : 0,
                    });
                }
            } else {
                records[index].reward_received++;
                records[index].total_cost += reward ? numReward * CommonHelper.costPerReward : 0;
            }
        }

        //const giftHouseholds = residents.group(({ household }) => household);
        isLoading = false;
        baseRecords = [...records];
        reportId = reactiveParams.get("rewardreport") || "";
    }
    async function deleteSelectedHouseholds() {
        let deleteTask = [];
        for (let i of selectedHouseholds) {
            if (!i) continue;
            let residentsToDelete = residents.filter((x) => x.household == i.householdId);
            let rewardsToDelete = rewardResidents.filter((x) =>
                residentsToDelete.find((n) => n.resident == x.resident)
            );
            for (let reward of rewardsToDelete) {
                deleteTask.push(Api.deleteReward(reward.id));
            }
        }
        selectedHouseholds = {};
        Promise.all(deleteTask)
            .then(() => {
                load();
            })
            .catch((e) => {
                addErrorToast(e.message);
            });
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Qu???n l??</div>
            <div class="breadcrumb-item">Danh s??ch ph??t qu??</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            {#if reportId}
                <div class="breadcrumb-item">C??c h??? c?? th??nh vi??n ???????c khen th?????ng trong n??m {year}</div>
            {:else}
                <span class="txt">T???t c??? h??? kh???u</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => rewardSelectPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Th??m trao qu??</span>
            </button>
        </div>
    </div>
    <CustomSearchBar
        searchField="household"
        placeholder="T??m h??? kh???u (nh???p ?????a ch???)"
        on:submit={(e) => {
            const searchVal = e.detail.household || "";
            records = baseRecords.filter((x) => x.household.includes(searchVal));
        }}
        on:clear={(e) => {
            records = [...baseRecords];
        }}
    />
    <Table
        {records}
        fields={[
            {
                name: "id",
                label: "STT",
            },
            {
                name: "household",
                label: "H??? gia ????nh",
            },
            {
                name: "reward_received",
                label: "S??? th??nh vi??n khen th?????ng",
            },
            {
                name: "total_cost",
                label: "T???ng chi ph??",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedHouseholds}
        on:select={(e) =>
            push(
                `/manage/reward-resident?household=${e.detail.householdId}&rewardreport=${reportId}&year=${year}`
            )}
    />
    <BulkBar
        bulkSelected={selectedHouseholds}
        actions={[{ label: "X??a", onClick: deleteSelectedHouseholds, isDanger: true }]}
    />
</PageWrapper>

<GiftUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionGift}
    excludedFields={["gift_report"]}
    excludedVal={[reportId]}
    on:save={() => load()}
    on:delete={() => load()}
    on:create={(e) => console.log("???? create record with data", e.detail.number)}
    on:update={(e) => console.log("???? update record with data", e.detail)}
/>

<CustomFormPanel
    bind:this={rewardSelectPanel}
    fields={[
        {
            name: "household",
            type: "relation",
            options: {
                collectionId: "households",
                maxSelect: 1,
            },
        },
    ]}
    existedHousehold={records.map((x) => x.householdId)}
    on:submit={async (e) => {
        let household = e.detail.household;
        records.push({
            householdId: household,
            household: households.find((x) => x.id == household).address,
            reward_received: 0,
            id: records.length + 1,
            total_cost: 0,
        });
        records = records;
    }}
/>
