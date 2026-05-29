interface ImportMetaEnv {
    readonly NG_APP_BACKEND_URL?: string;
    readonly VITE_BACKEND_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
