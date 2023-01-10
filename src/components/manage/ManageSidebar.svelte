<script>
    import { link } from "svelte-spa-router";
    import active from "svelte-spa-router/active";
</script>

<aside class="page-sidebar collection-sidebar">
    <div class="sidebar-content">
        <a
            href="/manage/households"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/households", className: "active" }}
        >
            <span class="txt">Hộ khẩu</span>
        </a>
        <a
            href="/manage/residents"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/residents.*", className: "active" }}
        >
            <span class="txt">Nhân khẩu</span>
        </a>
    </div>
</aside>
