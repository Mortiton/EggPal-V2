import { NextResponse } from 'next/server';
import { getSavedBreedingCombosWithDetails, addSavedBreedingCombo, removeSavedBreedingCombo } from '@/app/services/userService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const savedCombos = await getSavedBreedingCombosWithDetails(userId);
    return NextResponse.json(savedCombos);
  } catch (error) {
    console.error("Error in GET /api/saved-combinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId, breedingComboId } = await request.json();

  if (!userId || !breedingComboId) {
    return NextResponse.json({ error: 'User ID and Breeding Combo ID are required' }, { status: 400 });
  }

  try {
    await addSavedBreedingCombo(userId, breedingComboId);
    return NextResponse.json({ message: 'Breeding combination saved successfully' });
  } catch (error) {
    console.error("Error in POST /api/saved-combinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const comboId = searchParams.get('comboId');

  if (!userId || !comboId) {
    return NextResponse.json({ error: 'User ID and Combo ID are required' }, { status: 400 });
  }

  try {
    await removeSavedBreedingCombo(userId, comboId);
    return NextResponse.json({ message: 'Breeding combination removed successfully' });
  } catch (error) {
    console.error("Error in DELETE /api/saved-combinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}