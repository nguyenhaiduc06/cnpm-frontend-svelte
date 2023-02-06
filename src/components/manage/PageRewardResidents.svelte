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

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("rewardreport") || "";
    $: year = reactiveParams.get("year") || "";
    $: household = reactiveParams.get("household") || "";

    let residentUpsertPanel;
    let residentsList;
    let rewardSelectPanel;
    let filter;
    let selectedRecords = [];

    $: rewardedResidents = [];
    $: residents_snaps = [];
    let isLoading;

    $: filter = reportId ? `household ="${household}"` : "";
    load();
    async function load() {
        reactiveParams = new URLSearchParams($querystring);
        reportId = reactiveParams.get("rewardreport") || "";
        household = reactiveParams.get("household") || "";
        isLoading = true;

        rewardedResidents = await Api.getRewards(reportId);
        residents_snaps = (await Api.getAllResidents()).filter(
            (x) => rewardedResidents.find((n) => n.resident == x.resident) && x.household == household
        );

        rewardedResidents = rewardedResidents.filter((x) =>
            residents_snaps.find((n) => n.resident == x.resident)
        );
        for (let resident of rewardedResidents) {
            let residentName = (await Api.getResidentInfo(resident.resident, false)).name;
            resident.residentName = residentName;
            resident.num_reward = CommonHelper.getCorrespondingRewards(resident.education_result);
            resident.cost = resident.num_reward * CommonHelper.costPerReward;
        }

        isLoading = false;
        rewardedResidents = rewardedResidents;
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
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Danh sách phát quà</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            {#if reportId}
                <div class="breadcrumb-item">
                    Các phần thưởng của hộ {household} trong dịp năm {year}
                </div>
            {:else}
                <span class="txt">Tất cả hộ khẩu</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => residentUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Thêm trao quà</span>
            </button>
        </div>
    </div>
    <Table
        records={rewardedResidents}
        fields={[
            {
                name: "residentName",
                label: "Tên nhân khẩu",
            },
            {
                name: "school",
                label: "Trường",
            },
            {
                name: "class",
                label: "Lớp",
            },
            {
                name: "grade",
                label: "Khối",
            },
            {
                name: "education_result",
                label: "Kết quả học tập",
            },
            {
                name: "education_proof",
                label: "Minh chứng",
                type: "file"
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedRecords}
        on:select={(e) => rewardSelectPanel?.show(e?.detail)}
    />
    <BulkBar
        bulkSelected={selectedRecords}
        actions={[{ label: "Xóa", onClick: deleteSelected, isDanger: true }]}
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
