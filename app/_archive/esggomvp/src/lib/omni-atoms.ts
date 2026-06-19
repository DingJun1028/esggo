/**
 * OmniAtoms Design System component mappings
 * Used for StitchMCP integration and referencing Pencil UI components via UUID.
 */

export const OMNI_ATOMS = {
    // 5T Protocol Badges
    BADGE_TANGIBLE: "FfCz9",
    BADGE_TRACEABLE: "iNmUO",
    BADGE_TRACKABLE: "7gGwD",
    BADGE_TRANSPARENT: "pxB9n",
    BADGE_TRUSTWORTHY: "smm7p",

    // Core Buttons
    BUTTON_PRIMARY_DEFAULT: "dqo5D",
    BUTTON_PRIMARY_HOVER: "bVc9T",
    BUTTON_PRIMARY_DISABLED: "25IWD",
    BUTTON_OUTLINE_DEFAULT: "JbjdH",

    // Form Inputs
    INPUT_TEXT_DEFAULT: "P2ccN",
    INPUT_TEXT_FOCUSED: "pyDHt",
    INPUT_TEXT_ERROR: "BVQC4",

    // Liquid Glass Cards
    CARD_LIQUID_GLASS: "hfc3q",
    CARD_ACTION_GOLDEN: "nrFqy",

    // Navigation & Structure (Nitro Base)
    SIDEBAR: "y:k1Tgo",
    SIDEBAR_SECTION_TITLE: "y:hZwCK",
    SIDEBAR_ITEM_ACTIVE: "y:4jfFd",
    SIDEBAR_ITEM_DEFAULT: "y:cpj5L",

    // Data Display
    DATA_TABLE: "y:nitroDataTable",
    CARD_PLAIN: "y:Sprth",
    CARD_ACTION: "y:92ihz",
    CARD_IMAGE: "y:mQSLP",

    // Feedback
    ALERT_INFO: "y:vnlpI",
    ALERT_SUCCESS: "y:jWJ7T",
    ALERT_WARNING: "y:7vQ96",
    ALERT_ERROR: "y:Ebad8",

    // Modals & Overlays
    MODAL_LEFT: "y:5ee9F",
    MODAL_CENTER: "y:Ld8Zw",
    MODAL_ICON: "y:g8g59",
    DIALOG: "y:Kw3hB",
    TOOLTIP: "y:DIw3s"
} as const;

export type OmniAtomKey = keyof typeof OMNI_ATOMS;
export type OmniAtomUUID = typeof OMNI_ATOMS[OmniAtomKey];
