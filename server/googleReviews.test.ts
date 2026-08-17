import { describe, expect, it } from "vitest";
import { normalizeGoogleReviews } from "@shared/googleReviews";

describe("normalizeGoogleReviews", () => {
  it("preserves official author attribution, rating, text and review timing", () => {
    const reviews = normalizeGoogleReviews("place-123", [
      {
        rating: 5,
        text: "Atendimento excelente e acabamento impecável.",
        relativePublishTimeDescription: "há 2 semanas",
        authorAttribution: {
          displayName: "Cliente real",
          uri: "https://www.google.com/maps/contrib/123",
          photoURI: "https://lh3.googleusercontent.com/photo",
        },
      },
    ]);

    expect(reviews).toEqual([
      {
        id: "place-123-0",
        authorName: "Cliente real",
        authorUri: "https://www.google.com/maps/contrib/123",
        authorPhoto: "https://lh3.googleusercontent.com/photo",
        rating: 5,
        text: "Atendimento excelente e acabamento impecável.",
        relativeTime: "há 2 semanas",
      },
    ]);
  });

  it("limits the visible reviews without manufacturing additional entries", () => {
    const reviews = normalizeGoogleReviews("place-123", [
      { rating: 4, text: "Primeira", authorAttribution: { displayName: "A" } },
      { rating: 3, text: "Segunda", authorAttribution: { displayName: "B" } },
      { rating: 5, text: "Terceira", authorAttribution: { displayName: "C" } },
      { rating: 1, text: "Quarta", authorAttribution: { displayName: "D" } },
    ], 3);

    expect(reviews).toHaveLength(3);
    expect(reviews.map((review) => review.text)).toEqual(["Primeira", "Segunda", "Terceira"]);
  });

  it("returns safe empty text and clamped rating for incomplete provider data", () => {
    const reviews = normalizeGoogleReviews("place-123", [
      { rating: 9, text: { text: "Texto aninhado" }, authorAttribution: { displayName: "Sem foto", uri: "javascript:bad" } },
      { rating: "not-a-number", text: null, authorAttribution: null },
    ]);

    expect(reviews[0]).toMatchObject({ rating: 5, text: "Texto aninhado", authorName: "Sem foto" });
    expect(reviews[0].authorUri).toBeUndefined();
    expect(reviews[1]).toMatchObject({ rating: 0, text: "", authorName: "Cliente do Google Maps" });
  });

  it("returns no entries when the provider returns no review array", () => {
    expect(normalizeGoogleReviews("place-123", undefined)).toEqual([]);
    expect(normalizeGoogleReviews("place-123", "not-an-array")).toEqual([]);
  });
});
