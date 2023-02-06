<script>
  import { link, querystring, replace } from "svelte-spa-router";
  import PageWrapper from "@/components/base/PageWrapper.svelte";
  import RefreshButton from "@/components/base/RefreshButton.svelte";
  import ManageSidebar from "./ManageSidebar.svelte";

  import Table from "../base/Table.svelte";
  import { Api } from "@/services/api";

  $: reactiveParams = new URLSearchParams($querystring);
  $: householdId = reactiveParams.get("householdId") || "";

  let residentsTable;
  let updateResidentFormPanel;

  let isLoading = true;
  let selectedResidents = {};

  let residentChanges;

  $: householdId, load();

  function load() {
      isLoading = true;
      Api.getResidentChange().then((result) => {
        residentChanges = result.map(record => {
          const {id, change_type} = record;
          const { resident, old_household, new_household} = record.expand;
          const {name, citizen_id} = resident;
          const from = old_household.address;
          const to = new_household.address;
          return {
            id,
            citizen_id,
            name,
            from,
            to,
            change_type,
          }
        });
        isLoading = false;
      })
  }
</script>

<ManageSidebar />

<PageWrapper>
  <header class="page-header">
      <nav class="breadcrumbs">
          <div class="breadcrumb-item">Quản lý</div>
          <div class="breadcrumb-item">Thống kê lịch sử thay đổi</div>
      </nav>

      <div class="inline-flex">
          <RefreshButton on:refresh={() => residentsTable?.load()} />
      </div>
  </header>

  <Table
      records={residentChanges}
      fields={[
          {
              name: "citizen_id",
              label: "CCCD",
          },
          {
              name: "name",
              label: "Họ và tên",
          },
          {
              name: "change_type",
              label: "Loại",
          },
          {
              name: "from",
              label: "Đến từ",
          },
          {
              name: "to",
              label: "Tới",
          },
      ]}
      {isLoading}
      bind:bulkSelected={selectedResidents}
      on:select={(e) => updateResidentFormPanel?.show(e.detail)}
  />
</PageWrapper>
