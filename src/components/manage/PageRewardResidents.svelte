<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionReward } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import { Api } from "@/services/api";
    import Table from "../base/Table.svelte";
    import CommonHelper from "@/utils/CommonHelper";
    import RewardFormPanel from "./RewardFormPanel.svelte";
    import BulkBar from "../base/BulkBar.svelte";
    import { detach } from "svelte/internal";
    import CustomSearchBar from "../base/CustomSearchBar.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("rewardreport") || "";
    $: year = reactiveParams.get("year") || "";
    $: household = reactiveParams.get("household") || "";

    let residentUpsertPanel;
    let residentsList;
    let rewardSelectPanel;
    let filter;
    let selectedRecords = [];

    $: records = [];
    $: baseRecords = [];
    $: residents_snaps = [];
    let isLoading;

    $: filter = reportId ? `household ="${household}"` : "";
    $: console.trace(records)
    load();
    async function load() {
        reactiveParams = new URLSearchParams($querystring);
        reportId = reactiveParams.get("rewardreport") || "";
        household = reactiveParams.get("household") || "";
        isLoading = true;

        let rewardedResidents = await Api.getRewards(reportId);
        residents_snaps = (await Api.getAllResidents()).filter(
            (x) => rewardedResidents.find((n) => n.resident == x.resident) && x.household == household
        );

        rewardedResidents = rewardedResidents.filter((x) =>
            residents_snaps.find((n) => n.resident == x.resident)
        );
        for (let resident of rewardedResidents) {
            let residentName = resident.expand.resident.name;
            resident.residentName = residentName;
            resident.num_reward = CommonHelper.getCorrespondingRewards(resident.education_result);
            resident.cost = resident.num_reward * CommonHelper.costPerReward;
        }

        records = rewardedResidents;
        baseRecords = [...rewardedResidents];
        isLoading = false;
    }
    async function deleteSelected() {
        const rewards = Object.values(selectedRecords);
        const deleteTasks = rewards.map((x) => Api.deleteReward(x.id));
        selectedRecords = {};
        Promise.all(deleteTasks)
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
                <div class="breadcrumb-item">
                    C??c th??nh vi??n ???????c khen th?????ng c???a h??? {household} trong n??m {year}
                </div>
            {:else}
                <span class="txt">T???t c??? h??? kh???u</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => residentUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Th??m trao qu??</span>
            </button>
        </div>
    </div>
    <CustomSearchBar 
        searchField="residentName"
        placeholder="T??m nh??n kh???u (nh???p t??n)"
        on:submit={(e) => {
            const searchKey = e.detail.residentName;
            records = baseRecords.filter(x => x.residentName.includes(searchKey))
        }}
        on:clear={(e) => {
            records = [...baseRecords]
        }}
    />
    <Table
        records={records}
        fields={[
            {
                name: "residentName",
                label: "T??n nh??n kh???u",
            },
            {
                name: "school",
                label: "Tr?????ng",
            },
            {
                name: "class",
                label: "L???p",
            },
            {
                name: "grade",
                label: "Kh???i",
            },
            {
                name: "education_result",
                label: "K???t qu??? h???c t???p",
            },
            {
                name: "education_proof",
                label: "Minh ch???ng",
                type: "file"
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedRecords}
        on:select={(e) => rewardSelectPanel?.show(e?.detail)}
    />
    <BulkBar
        bulkSelected={selectedRecords}
        actions={[{ label: "X??a", onClick: deleteSelected, isDanger: true }]}
    />
</PageWrapper>

<RewardFormPanel
    bind:this={residentUpsertPanel}
    on:submit={async (e) => {
        const { resident, reward_report, school, grade, education_result, education_proof } = e.detail;
        await Api.addReward(e.detail);
        load();
    }}
    {household}
    fields={CollectionReward.schema}
    excludedFields={{
        reward_report: {
            fieldName: "reward_report",
            defaultVal: reportId,
        },
    }}
/>

<FormPanel
    bind:this={rewardSelectPanel}
    on:submit={async (e) => {
        let data = new FormData();
        for (let i of Object.keys(e.detail)) {
            data.append(i, e.detail[i]);
        }
        await Api.updateReward(e.detail.id, data);
        load();
    }}
    fields={[
        {
            name: "school",
            type: "text",
        },
        {
            name: "class",
            type: "text",
        },
        {
            name: "grade",
            type: "number",
        },
        {
            name: "education_result",
            type: "select",
            options: {
                maxSelect: 1,
                values: ["Excellent", "Good", "Average", "Bad"],
            },
        },
        {
            name: "education_proof",
            type: "file",
        },
    ]}
    excludedFields={{
        resident: {
            fieldName: "resident",
            defaultVal: undefined,
        },
        gift_report: {
            fieldName: "reward_report",
            defaultVal: reportId,
        },
    }}
/>
