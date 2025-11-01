"use client";

/**
 * Parameter Control Component
 * Reusable input control for a single parameter with increment/decrement buttons
 */

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import * as Slider from "@radix-ui/react-slider";
import type { ParameterDefinition } from "@/types/parameters";
import type { DynamicConstraints } from "@/lib/validation";
import { roundParameter } from "@/lib/rounding";

interface ParameterControlProps {
  /** Parameter definition with constraints */
  definition: ParameterDefinition;
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Validation error message (if any) */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Dynamic constraints that override schema min/max */
  dynamicConstraints?: DynamicConstraints;
}

export default function ParameterControl({
  definition,
  value,
  onChange,
  error,
  disabled = false,
  dynamicConstraints,
}: ParameterControlProps) {
  const t = useTranslations("ParameterControl");

  // Calculate effective min/max (dynamic constraints override schema)
  const effectiveMin =
    dynamicConstraints?.min !== undefined
      ? dynamicConstraints.min
      : definition.min;
  const effectiveMax =
    dynamicConstraints?.max !== undefined
      ? dynamicConstraints.max
      : definition.max;

  // Local state for the input field (allows typing intermediate values)
  const [inputValue, setInputValue] = useState(value.toString());

  // Track whether the field has been touched (blurred at least once)
  // Changed: Don't show errors on mount, only after user interaction
  const [touched, setTouched] = useState(false);

  // Track whether the user is actively typing
  const [isTyping, setIsTyping] = useState(false);

  // Debounce timer for onChange
  const changeDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounce timer for showing validation
  const validationDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update input value when prop value changes (from external source)
  useEffect(() => {
    // Only update if not actively typing
    if (!isTyping) {
      setInputValue(value.toString());
    }
  }, [value, isTyping]);

  // Auto-adjust value if it exceeds dynamic constraints
  useEffect(() => {
    if (value < effectiveMin || value > effectiveMax) {
      const clampedValue = Math.max(effectiveMin, Math.min(effectiveMax, value));
      const rounded = roundParameter(clampedValue, definition);
      if (rounded !== value) {
        onChange(rounded);
      }
    }
  }, [value, effectiveMin, effectiveMax, onChange, definition]);

  // Handle input change (allows user to type freely, including empty strings)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    setIsTyping(true);

    // Clear existing timers
    if (changeDebounceTimer.current) {
      clearTimeout(changeDebounceTimer.current);
    }
    if (validationDebounceTimer.current) {
      clearTimeout(validationDebounceTimer.current);
    }

    // Allow empty string (user is clearing the field)
    if (rawValue === "" || rawValue === "-") {
      return; // Don't update value, wait for blur
    }

    // Try to parse the value
    const parsed = parseFloat(rawValue);
    if (!isNaN(parsed)) {
      // Debounce the onChange call (500ms)
      changeDebounceTimer.current = setTimeout(() => {
        const rounded = roundParameter(parsed, definition);
        onChange(rounded);
        setIsTyping(false);
      }, 500);

      // Show validation after 1 second of inactivity
      validationDebounceTimer.current = setTimeout(() => {
        setTouched(true);
      }, 1000);
    }
  };

  // Handle slider change (immediate, always valid)
  const handleSliderChange = (values: number[]) => {
    const sliderValue = values[0];
    const rounded = roundParameter(sliderValue, definition);
    setTouched(true);
    onChange(rounded);
  };

  // Handle blur - ensure value is properly formatted and trigger validation
  const handleBlur = () => {
    setTouched(true);
    setIsTyping(false);

    // Clear any pending timers
    if (changeDebounceTimer.current) {
      clearTimeout(changeDebounceTimer.current);
    }
    if (validationDebounceTimer.current) {
      clearTimeout(validationDebounceTimer.current);
    }

    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const rounded = roundParameter(parsed, definition);
      setInputValue(rounded.toString());
      onChange(rounded);
    } else {
      // Reset to current value if invalid
      setInputValue(value.toString());
    }
  };

  // Handle keyboard shortcuts (arrow keys still work on input)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setTouched(true);
      const newValue = roundParameter(value + definition.step, definition);
      onChange(newValue);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setTouched(true);
      const newValue = roundParameter(value - definition.step, definition);
      onChange(newValue);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (changeDebounceTimer.current) {
        clearTimeout(changeDebounceTimer.current);
      }
      if (validationDebounceTimer.current) {
        clearTimeout(validationDebounceTimer.current);
      }
    };
  }, []);

  // Only show error if field has been touched or interacted with
  const shouldShowError = touched && error;

  return (
    <div className="space-y-2">
      {/* Label and Help */}
      <div>
        <label
          htmlFor={definition.id}
          className="block text-sm font-medium text-gray-700"
        >
          {definition.label}
        </label>
        {definition.help && (
          <p className="text-xs text-gray-500 mt-0.5">{definition.help}</p>
        )}
      </div>

      {/* Horizontal Slider + Input Layout */}
      <div className="space-y-1">
        {/* Slider and Input on same row */}
        <div className="flex items-center gap-3">
          {/* Range Slider Container */}
          <div className="flex-1 relative">
            <Slider.Root
              value={[value]}
              onValueChange={handleSliderChange}
              disabled={disabled}
              min={effectiveMin}
              max={effectiveMax}
              step={definition.step}
              aria-label={t("sliderAriaLabel", { label: definition.label })}
              className="relative flex items-center select-none touch-none w-full h-5"
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
              />
            </Slider.Root>
          </div>

          {/* Number Input (compact) */}
          <div className="relative w-24">
            <input
              id={definition.id}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              step={definition.step}
              min={definition.min}
              max={definition.max}
              className={`w-full px-2 py-1.5 pr-8 border rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                shouldShowError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              aria-invalid={shouldShowError ? "true" : "false"}
              aria-describedby={shouldShowError ? `${definition.id}-error` : undefined}
            />
            {definition.unit && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                {definition.unit}
              </span>
            )}
          </div>
        </div>

        {/* Min/Max labels under slider */}
        <div className="flex justify-between text-xs text-gray-400 px-0.5">
          <span>{effectiveMin}</span>
          <span>{effectiveMax}</span>
        </div>
      </div>

      {/* Error Message - only show when touched */}
      {shouldShowError && (
        <p
          id={`${definition.id}-error`}
          className="text-xs text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
