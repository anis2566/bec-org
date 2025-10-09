import {
  higherSecondaryLevels,
  LEVELS,
  primaryLevels,
  secondaryLevels,
} from "./constant";

export const generateTransactionIdFromObjectId = (objectId: string): string => {
  const hexPart = objectId.toString().slice(-8);
  const decimal = parseInt(hexPart, 16);

  // Ensure it's 8 digits by taking modulo and padding
  const eightDigit = (decimal % 100000000).toString().padStart(8, "0");
  return eightDigit;
};

export function getLevelByClassName(className: string): LEVELS {
  if (primaryLevels.includes(className)) {
    return LEVELS.Primary;
  }

  if (higherSecondaryLevels.includes(className)) {
    return LEVELS.HigherSecondary;
  }

  if (secondaryLevels.includes(className)) {
    return LEVELS.Secondary;
  }

  return LEVELS.Primary;
}
