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
            <span class="txt">Thường trú</span>
        </a>
        <a
            href="/manage/absent"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/absent.*", className: "active" }}
        >
            <span class="txt">Tạm vắng</span>
        </a>
        <a
            href="/manage/temporary"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/temporary.*", className: "active" }}
        >
            <span class="txt">Tạm trú</span>
        </a>
        <a
            href="/manage/reward-report"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/reward-report.*", className: "active" }}
        >
            <span class="txt">Khen thưởng</span>
        </a>
        <a
            href="/manage/gift-report"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/gift-report.*", className: "active" }}
        >
            <span class="txt">Trao quà</span>
        </a>
    </div>
</aside>
