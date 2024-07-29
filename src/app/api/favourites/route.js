import { NextResponse } from 'next/server';
import { getFavouritePals, addFavouritePal, removeFavouritePal } from '@/app/services/userService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const favourites = await getFavouritePals(userId);
    return NextResponse.json(favourites);
  } catch (error) {
    console.error("Error in GET /api/favourites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId, palId } = await request.json();

  if (!userId || !palId) {
    return NextResponse.json({ error: 'User ID and Pal ID are required' }, { status: 400 });
  }

  try {
    await addFavouritePal(userId, palId);
    return NextResponse.json({ message: 'Favourite added successfully' });
  } catch (error) {
    console.error("Error in POST /api/favourites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const palId = searchParams.get('palId');

  if (!userId || !palId) {
    return NextResponse.json({ error: 'User ID and Pal ID are required' }, { status: 400 });
  }

  try {
    await removeFavouritePal(userId, palId);
    return NextResponse.json({ message: 'Favourite removed successfully' });
  } catch (error) {
    console.error("Error in DELETE /api/favourites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}