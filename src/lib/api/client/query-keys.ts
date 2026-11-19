const root = ["api"] as const;
const publicRoot = [...root, "public"] as const;
const adminRoot = [...root, "admin"] as const;
const authRoot = [...root, "auth"] as const;

type QueryParams = Readonly<Record<string, string | number | boolean | null | undefined>>;

function normalizeParams(params?: QueryParams): QueryParams | undefined {
    if (!params) {
        return undefined;
    }

    const entries = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b));

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function withParams<const TBase extends readonly unknown[]>(
    base: TBase,
    params?: QueryParams,
) {
    const normalized = normalizeParams(params);

    return normalized
        ? ([...base, { params: normalized }] as const)
        : base;
}

export const queryKeys = {
    all: root,

    public: {
        all: publicRoot,

        categories: () => [...publicRoot, "categories"] as const,

        products: () => [...publicRoot, "products"] as const,

        productList: (params?: QueryParams) =>
            withParams([...publicRoot, "products", "list"] as const, params),

        product: (id: string) => [...publicRoot, "products", "detail", id] as const,
    },

    admin: {
        all: adminRoot,

        dashboard: () => [...adminRoot, "dashboard"] as const,

        products: () => [...adminRoot, "products"] as const,

        productList: (params?: QueryParams) =>
            withParams([...adminRoot, "products", "list"] as const, params),

        product: (id: string) => [...adminRoot, "products", "detail", id] as const,

        inquiries: () => [...adminRoot, "inquiries"] as const,

        inquiryList: (params?: QueryParams) =>
            withParams([...adminRoot, "inquiries", "list"] as const, params),

        inquiry: (id: string) => [...adminRoot, "inquiries", "detail", id] as const,
    },

    auth: {
        all: authRoot,

        me: () => [...authRoot, "me"] as const,
    },
} as const;