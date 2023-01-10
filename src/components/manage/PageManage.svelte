<script>
    import { replace } from "svelte-spa-router";
    import { pageTitle } from "@/stores/app";
    $pageTitle = "Quản lý";
    replace("/manage/households");
</script>
