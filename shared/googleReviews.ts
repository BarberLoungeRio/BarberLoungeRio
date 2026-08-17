export type GoogleReviewPayload = {
  rating?: unknown;
  text?: unknown;
  relativePublishTimeDescription?: unknown;
  authorAttribution?: {
    displayName?: unknown;
    uri?: unknown;
    photoURI?: unknown;
  } | null;
};

export type NormalizedGoogleReview = {
  id: string;
  authorName: string;
  authorUri?: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime?: string;
};

function asString(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && "text" in value) {
    const nestedText = (value as { text?: unknown }).text;
    return typeof nestedText === "string" ? nestedText.trim() : "";
  }
  return "";
}

function asUrl(value: unknown) {
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined;
}

export function normalizeGoogleReviews(placeId: string, payload: unknown, limit = 3): NormalizedGoogleReview[] {
  if (!Array.isArray(payload)) return [];

  return payload.slice(0, Math.max(0, limit)).map((rawReview, index) => {
    const review = (rawReview && typeof rawReview === "object" ? rawReview : {}) as GoogleReviewPayload;
    const numericRating = Number(review.rating);
    const rating = Number.isFinite(numericRating) ? Math.max(0, Math.min(5, numericRating)) : 0;
    const authorAttribution = review.authorAttribution ?? undefined;

    return {
      id: `${placeId || "google-place"}-${index}`,
      authorName: asString(authorAttribution?.displayName) || "Cliente do Google Maps",
      authorUri: asUrl(authorAttribution?.uri),
      authorPhoto: asUrl(authorAttribution?.photoURI),
      rating,
      text: asString(review.text),
      relativeTime: asString(review.relativePublishTimeDescription) || undefined,
    };
  });
}
