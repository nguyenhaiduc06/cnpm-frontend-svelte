export const CollectionHouseholds = {
    id: "f0ehmbvhv3tcp5w",
    name: "households",
    type: "base",
    system: false,
    schema: [
        {
            id: "tn5cyg0o",
            name: "number",
            type: "text",
            system: false,
            required: true,
            unique: true,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            id: "xbk9bjmy",
            name: "address",
            type: "text",
            system: false,
            required: true,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};

export const CollectionResidentSnapshots = {
    id: "s4r3ipyouaoe4eo",
    name: "resident_snapshots",
    type: "base",
    system: false,
    schema: [
        {
            id: "riujwpw5",
            name: "resident",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "gabzhpa0gwujotf",
                cascadeDelete: false,
            },
        },
        {
            id: "uxz3vdte",
            name: "household",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "f0ehmbvhv3tcp5w",
                cascadeDelete: false,
            },
        },
        {
            id: "sbms1kin",
            name: "relation_with_householder",
            type: "text",
            system: false,
            required: false,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            id: "jesc1tln",
            name: "alive",
            type: "bool",
            system: false,
            required: false,
            unique: false,
            options: {},
        },
        {
            id: "fckyyucj",
            name: "note",
            type: "text",
            system: false,
            required: false,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            id: "ogclv7ju",
            name: "active",
            type: "bool",
            system: false,
            required: false,
            unique: false,
            options: {},
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionResidentChanges = {
    id: "068k7uz924d3mlf",
    name: "resident_changes",
    type: "base",
    system: false,
    schema: [
        {
            id: "j9pxem2t",
            name: "residents",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "gabzhpa0gwujotf",
                cascadeDelete: false,
            },
        },
        {
            id: "nfbddesf",
            name: "old_household",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "f0ehmbvhv3tcp5w",
                cascadeDelete: false,
            },
        },
        {
            id: "uhjxmdai",
            name: "new_household",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "f0ehmbvhv3tcp5w",
                cascadeDelete: false,
            },
        },
        {
            id: "caazdnat",
            name: "old_snapshot",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "s4r3ipyouaoe4eo",
                cascadeDelete: false,
            },
        },
        {
            id: "tavopj6m",
            name: "new_snapshot",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "s4r3ipyouaoe4eo",
                cascadeDelete: false,
            },
        },
        {
            id: "kdtotuxc",
            name: "change_type",
            type: "select",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                values: ["dead", "change-household", "split-household"],
            },
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionResidents = {
    id: "gabzhpa0gwujotf",
    name: "residents",
    type: "base",
    system: false,
    schema: [
        {
            id: "2irdskpd",
            name: "name",
            type: "text",
            system: false,
            required: true,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            id: "9q40mpb0",
            name: "birthday",
            type: "date",
            system: false,
            required: false,
            unique: false,
            options: {
                min: "",
                max: "",
            },
        },
        {
            id: "tyeeavgs",
            name: "gender",
            type: "select",
            system: false,
            required: true,
            unique: false,
            options: {
                maxSelect: 1,
                values: ["nam", "nữ"],
            },
        },
        {
            id: "731lkoeq",
            name: "citizen_id",
            type: "text",
            system: false,
            required: true,
            unique: true,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            id: "czdzqcq2",
            name: "job",
            type: "text",
            system: false,
            required: false,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            id: "cnupnmd9",
            name: "birthplace",
            type: "text",
            system: false,
            required: false,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionAbsentResidents = {
    id: "f1q3vqhxwzpiuiv",
    name: "absent_residents",
    type: "base",
    system: false,
    schema: [
        {
            id: "ftybtokd",
            name: "resident",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "gabzhpa0gwujotf",
                cascadeDelete: false,
            },
        },
        {
            id: "mcvdlbzs",
            name: "from",
            type: "date",
            system: false,
            required: false,
            unique: false,
            options: {
                min: "",
                max: "",
            },
        },
        {
            id: "zwdc9fyn",
            name: "to",
            type: "date",
            system: false,
            required: false,
            unique: false,
            options: {
                min: "",
                max: "",
            },
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionTemporaryResidents = {
    id: "3qrdnyaqpid0mdb",
    name: "temporary_residents",
    type: "base",
    system: false,
    schema: [
        {
            id: "od0piq2q",
            name: "resident",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "gabzhpa0gwujotf",
                cascadeDelete: false,
            },
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionRewardReport = {
    id: "reward_report",
    name: "Reward Reports",
    type: "base",
    system: false,
    schema: [
        {
            name: "name",
            type: "text",
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionReward = {
    id: "reward",
    name: "Rewards",
    type: "base",
    system: false,
    schema: [
        {
            name: "resident",
            type: "relation",
            options: {
                maxSelect: 1,
                collectionId: "resident_snapshots",
                cascadeDelete: false,
            },
        },
        {
            name: "reward_report",
            type: "relation",
            options: {
                maxSelect: 1,
                collectionId: "reward_report",
                cascadeDelete: false,
            },
        },
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
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionGiftReport = {
    id: "gift_report",
    name: "Reward Reports",
    type: "base",
    system: false,
    schema: [
        {
            name: "occasion",
            type: "text",
        },
        {
            name: "year",
            type: "text",
        },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
export const CollectionGift = {
    id: "gift",
    name: "Rewards",
    type: "base",
    system: false,
    schema: [
        {
            name: "resident",
            type: "relation",
            options: {
                maxSelect: 1,
                collectionId: "resident_snapshots",
                cascadeDelete: false,
                unique: true,
                metaField: ["name", "household"],
            },
        },
        {
            name: "gift_report",
            type: "relation",
            options: {
                maxSelect: 1,
                metaField: ["occasion"],
                collectionId: "gift_report",
                cascadeDelete: false,
            },
        },
        {
            name: "num_gift",
            type: "number",
        },
        // {
        //     name: "cost",
        //     type: "number",
        // },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
};
