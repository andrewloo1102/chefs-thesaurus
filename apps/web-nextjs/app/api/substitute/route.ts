import { NextRequest, NextResponse } from 'next/server';
import { searchSubstitutions, describeEffects, lookupStores } from '@chefs-thesaurus/core';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredient, quantity, unit, dish, lat, lon, radius_m } = body;

    // Call searchSubstitutions
    const searchResult = await searchSubstitutions({
      ingredient,
      quantity,
      unit,
      dish,
    });

    if (!searchResult.supported) {
      return NextResponse.json({
        supported: false,
        message: (searchResult as { message: string; examples: string[] }).message,
        examples: (searchResult as { message: string; examples: string[] }).examples,
      });
    }

    // Call describeEffects
    const effectsResult = await describeEffects({
      base: searchResult.base!,
      substitute: searchResult.substitute!,
      dish,
    });

    // Call lookupStores (if location provided)
    let stores: Array<{ name: string; lat: number; lon: number; distance_m: number }> = [];
    if (lat !== undefined && lon !== undefined && searchResult.substitute) {
      stores = await lookupStores({
        query: searchResult.substitute,
        lat,
        lon,
        radius_m,
      });
    }

    // Return consolidated response
    return NextResponse.json({
      supported: true,
      base: searchResult.base,
      substitute: searchResult.substitute,
      quantity: searchResult.quantity,
      unit: searchResult.unit,
      basis: searchResult.basis,
      notes: searchResult.notes,
      alternatives: searchResult.alts,
      effects: effectsResult,
      stores,
    });
  } catch (error) {
    console.error('Error in substitute API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

