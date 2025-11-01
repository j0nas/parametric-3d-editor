"use client";

/**
 * Parameter Panel Component
 * Displays all parameters with controls, validation, and dimension readouts
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import type {
  ParameterSchema,
  ParameterValues,
  ValidationResult,
} from "@/types/parameters";
import {
  validateParameters,
  getParameterErrorMessage,
  calculateDynamicConstraints,
  type CustomValidation,
  type CustomConstraintsCalculator,
} from "@/lib/validation";
import type { DimensionReadout } from "@/products/registry";
import ParameterControl from "./ParameterControl";

interface ParameterPanelProps<T extends (...args: any[]) => string = (...args: any[]) => string> {
  /** Parameter schema defining all parameters */
  schema: ParameterSchema;
  /** Current parameter values */
  values: ParameterValues;
  /** Callback when parameter values change (debounced) */
  onChange: (values: ParameterValues) => void;
  /** Loading state (disables inputs during regeneration) */
  loading?: boolean;
  /** Optional custom validation function for product-specific rules */
  customValidation?: CustomValidation;
  /** Optional custom constraints calculator for product-specific dynamic ranges */
  customConstraintsCalculator?: CustomConstraintsCalculator;
  /** Translation namespace for the product (e.g., "Products.hoseAdapter") */
  translationNamespace: string;
  /** Optional dimensions calculator for displaying calculated dimensions */
  dimensionsCalculator?: (values: ParameterValues, t: T) => DimensionReadout[];
}

export default function ParameterPanel({
  schema,
  values,
  onChange,
  loading = false,
  customValidation,
  customConstraintsCalculator,
  translationNamespace,
  dimensionsCalculator,
}: ParameterPanelProps) {
  const t = useTranslations(translationNamespace as any) as any;
  const tValidation = useTranslations("Validation");

  // Local state for immediate UI updates (before debounce)
  const [localValues, setLocalValues] = useState<ParameterValues>(values);

  // Validation state
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update local values when prop values change
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // Validate whenever local values change
  useEffect(() => {
    const validationResult = validateParameters(
      schema,
      localValues,
      tValidation,
      customValidation
    );
    setValidation(validationResult);
  }, [localValues, schema, tValidation, customValidation]);

  // Handle parameter change with debouncing
  const handleParameterChange = useCallback(
    (parameterId: string, newValue: number) => {
      // Update local state immediately for responsive UI
      const newValues = {
        ...localValues,
        [parameterId]: newValue,
      };
      setLocalValues(newValues);

      // Clear existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new debounce timer (300ms)
      debounceTimer.current = setTimeout(() => {
        // Only propagate change if validation passes
        const validationResult = validateParameters(
          schema,
          newValues,
          tValidation,
          customValidation
        );
        if (validationResult.isValid) {
          onChange(newValues);
        }
      }, 300);
    },
    [localValues, onChange, schema, tValidation, customValidation]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Calculate dimension readouts (if calculator provided)
  const dimensions = dimensionsCalculator ? dimensionsCalculator(localValues, t) : [];

  // Calculate dynamic constraints for interdependent parameters
  const dynamicConstraints = calculateDynamicConstraints(
    schema,
    localValues,
    customConstraintsCalculator
  );

  return (
    <div className="space-y-6">
      {/* Parameter Controls */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {t("dimensionsHeading")}
        </h3>
        {Object.entries(schema).map(([key, definition]) => (
          <ParameterControl
            key={key}
            definition={definition}
            value={localValues[key] ?? definition.default}
            onChange={(newValue) => handleParameterChange(key, newValue)}
            error={getParameterErrorMessage(validation, key)}
            disabled={loading}
            dynamicConstraints={dynamicConstraints[key]}
          />
        ))}
      </div>

      {/* Dimension Readouts */}
      {dimensions.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            {t("calculatedDimensionsHeading")}
          </h3>
          <div className="space-y-2">
            {dimensions.map((dim, index) => {
              const precision = dim.precision ?? 1;
              const unit = dim.unit ?? "mm";
              return (
                <div
                  key={dim.label || index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">{dim.label}:</span>
                  <span className="font-medium text-gray-900">
                    {dim.value.toFixed(precision)}{unit ? ` ${unit}` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="ml-3 text-sm text-blue-700">
              {t("regenerating")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

