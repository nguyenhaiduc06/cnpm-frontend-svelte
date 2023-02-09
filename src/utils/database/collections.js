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
            id: "7h5ynrt6",
            name: "change_type",
            type: "select",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                values: ["Qua đời", "Tách khẩu", "Chuyển khẩu"],
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
                values: ["Nam", "Nữ"],
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
        {
            id: "qcajxkb4",
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
            id: "3f8iio2x",
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
        {
            id: "zsr18rco",
            name: "address",
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
export const CollectionRewardReport = {
    id: "zehqtj6chuisatt",
    name: "reward_report",
    type: "base",
    system: false,
    schema: [
        {
            id: "hkuvnipg",
            name: "name",
            type: "text",
            system: false,
            required: true,
            unique: false,
            options: {
                min: 1,
                max: 10,
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
export const CollectionReward = {
    id: "2dqmad66lkgw2g6",
    name: "reward",
    type: "base",
    system: false,
    schema: [
        {
            id: "mq4vsjb3",
            name: "resident",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "gabzhpa0gwujotf",
                cascadeDelete: true,
            },
        },
        {
            id: "2xq2f1h8",
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
            id: "tdlmdv4q",
            name: "reward_report",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "zehqtj6chuisatt",
                cascadeDelete: true,
            },
        },
        {
            id: "j7vzb5tv",
            name: "school",
            type: "text",
            system: false,
            required: false,
            unique: false,
            options: {
                min: 1,
                max: 100,
                pattern: "",
            },
        },
        {
            id: "ktigvt7m",
            name: "class",
            type: "text",
            system: false,
            required: false,
            unique: false,
            options: {
                min: 1,
                max: 100,
                pattern: "",
            },
        },
        {
            id: "dan8tzfp",
            name: "education_result",
            type: "select",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                values: ["Xuất sắc", "Giỏi", "Tiên tiến", "Trung bình"],
            },
        },
        {
            id: "ckq6rc5l",
            name: "education_proof",
            type: "file",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ["image/jpg", "image/jpeg", "image/png", "image/svg+xml", "image/gif"],
                thumbs: ["720x720"],
            },
        },
        {
            id: "btt4vved",
            name: "amount",
            type: "number",
            system: false,
            required: false,
            unique: false,
            options: {
                min: null,
                max: null,
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
export const CollectionGiftReport = {
    id: "5sela3i08hhb9u8",
    name: "gift_report",
    type: "base",
    system: false,
    schema: [
        {
            id: "ovntzccu",
            name: "name",
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
export const CollectionGift = {
    id: "b2eiamk7yp7jby7",
    name: "gift",
    type: "base",
    system: false,
    schema: [
        {
            id: "qrsofuwa",
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
            id: "4udom2q3",
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
            id: "lb0fvqyl",
            name: "gift_report",
            type: "relation",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: "5sela3i08hhb9u8",
                cascadeDelete: false,
            },
        },
        {
            id: "6ceni8ek",
            name: "gift_type",
            type: "select",
            system: false,
            required: false,
            unique: false,
            options: {
                maxSelect: 1,
                values: ["Kẹo", "Bánh", "Bim Bim"],
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
