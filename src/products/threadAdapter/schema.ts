import type { ParameterSchema } from "@/types/parameters";

/**
 * Thread Adapter Parameter Schema
 *
 * Defines parameters for creating custom thread adapters that connect
 * two incompatible threaded containers, bottles, or fittings.
 *
 * Features:
 * - Two independent thread specifications (A and B)
 * - Each thread can be male or female
 * - Adjustable body length with optional hex grip
 * - Supports standard bottle threads, garden hose, pipe threads, etc.
 */

export const THREAD_ADAPTER_SCHEMA: ParameterSchema = {
  // Thread A (Source) parameters
  threadADiameter: {
    id: "threadADiameter",
    label: "Thread A Diameter",
    help: "Outer diameter of Thread A (source end)",
    min: 10,
    max: 80,
    default: 28,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
  threadAPitch: {
    id: "threadAPitch",
    label: "Thread A Pitch",
    help: "Distance between thread peaks on Thread A",
    min: 0.5,
    max: 5.0,
    default: 2.0,
    step: 0.1,
    unit: "mm",
    precision: 1,
  },
  threadAType: {
    id: "threadAType",
    label: "Thread A Type",
    help: "Whether Thread A has external (male) or internal (female) threads",
    min: 0,
    max: 1,
    default: 0, // 0 = male, 1 = female
    step: 1,
    unit: "",
    precision: 0,
  },
  threadALength: {
    id: "threadALength",
    label: "Thread A Length",
    help: "How deep/long the threaded section extends",
    min: 5,
    max: 30,
    default: 10,
    step: 1,
    unit: "mm",
    precision: 0,
  },

  // Thread B (Target) parameters
  threadBDiameter: {
    id: "threadBDiameter",
    label: "Thread B Diameter",
    help: "Outer diameter of Thread B (target end)",
    min: 10,
    max: 80,
    default: 38,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
  threadBPitch: {
    id: "threadBPitch",
    label: "Thread B Pitch",
    help: "Distance between thread peaks on Thread B",
    min: 0.5,
    max: 5.0,
    default: 2.5,
    step: 0.1,
    unit: "mm",
    precision: 1,
  },
  threadBType: {
    id: "threadBType",
    label: "Thread B Type",
    help: "Whether Thread B has external (male) or internal (female) threads",
    min: 0,
    max: 1,
    default: 1, // 0 = male, 1 = female
    step: 1,
    unit: "",
    precision: 0,
  },
  threadBLength: {
    id: "threadBLength",
    label: "Thread B Length",
    help: "How deep/long the threaded section extends",
    min: 5,
    max: 30,
    default: 10,
    step: 1,
    unit: "mm",
    precision: 0,
  },

  // Adapter body parameters
  bodyLength: {
    id: "bodyLength",
    label: "Body Length",
    help: "Distance between thread transitions (includes taper)",
    min: 10,
    max: 50,
    default: 20,
    step: 1,
    unit: "mm",
    precision: 0,
  },
  hexGripSize: {
    id: "hexGripSize",
    label: "Hex Grip Size",
    help: "Size of hexagonal grip section for wrench (0 = no hex, round body)",
    min: 0,
    max: 60,
    default: 0,
    step: 1,
    unit: "mm",
    precision: 0,
  },
  hollow: {
    id: "hollow",
    label: "Hollow",
    help: "Make adapter hollow for fluid/air flow (0 = solid, 1 = hollow)",
    min: 0,
    max: 1,
    default: 1, // 1 = hollow by default (more use cases)
    step: 1,
    unit: "",
    precision: 0,
  },
};

/**
 * Generate translated parameter schema for Thread Adapter
 *
 * @param t - Translation function from next-intl
 * @returns Translated parameter schema
 */
export function getTranslatedThreadAdapterSchema<T extends (...args: any[]) => string>(
  t: T
): ParameterSchema {
  return {
    threadADiameter: {
      ...THREAD_ADAPTER_SCHEMA.threadADiameter,
      label: t("threadADiameter.label"),
      help: t("threadADiameter.help"),
    },
    threadAPitch: {
      ...THREAD_ADAPTER_SCHEMA.threadAPitch,
      label: t("threadAPitch.label"),
      help: t("threadAPitch.help"),
    },
    threadAType: {
      ...THREAD_ADAPTER_SCHEMA.threadAType,
      label: t("threadAType.label"),
      help: t("threadAType.help"),
    },
    threadALength: {
      ...THREAD_ADAPTER_SCHEMA.threadALength,
      label: t("threadALength.label"),
      help: t("threadALength.help"),
    },
    threadBDiameter: {
      ...THREAD_ADAPTER_SCHEMA.threadBDiameter,
      label: t("threadBDiameter.label"),
      help: t("threadBDiameter.help"),
    },
    threadBPitch: {
      ...THREAD_ADAPTER_SCHEMA.threadBPitch,
      label: t("threadBPitch.label"),
      help: t("threadBPitch.help"),
    },
    threadBType: {
      ...THREAD_ADAPTER_SCHEMA.threadBType,
      label: t("threadBType.label"),
      help: t("threadBType.help"),
    },
    threadBLength: {
      ...THREAD_ADAPTER_SCHEMA.threadBLength,
      label: t("threadBLength.label"),
      help: t("threadBLength.help"),
    },
    bodyLength: {
      ...THREAD_ADAPTER_SCHEMA.bodyLength,
      label: t("bodyLength.label"),
      help: t("bodyLength.help"),
    },
    hexGripSize: {
      ...THREAD_ADAPTER_SCHEMA.hexGripSize,
      label: t("hexGripSize.label"),
      help: t("hexGripSize.help"),
    },
    hollow: {
      ...THREAD_ADAPTER_SCHEMA.hollow,
      label: t("hollow.label"),
      help: t("hollow.help"),
    },
  };
}
