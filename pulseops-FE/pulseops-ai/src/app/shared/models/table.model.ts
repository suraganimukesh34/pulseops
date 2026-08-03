export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
}

export interface TableAction {
    icon: string;
    tooltip: string;
    action: string;
}

export interface TableConfig {
    title: string;
    showSearch?: boolean;
    showPagination?: boolean;
    showActions?: boolean;
}