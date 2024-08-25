import { NextResponse } from "next/server";
import {
  getSavedBreedingCombosWithDetails,
  addSavedBreedingCombo,
  removeSavedBreedingCombo,
} from "@/app/services/userService";

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the saved breeding combination
 * @property {string} breeding_combo_id - The identifier of the breeding combination
 * @property {string} parent1_id - The ID of the first parent pal
 * @property {string} parent1_name - The name of the first parent pal
 * @property {string} parent1_image - The image URL of the first parent pal
 * @property {string} parent2_id - The ID of the second parent pal
 * @property {string} parent2_name - The name of the second parent pal
 * @property {string} parent2_image - The image URL of the second parent pal
 * @property {string} child_id - The ID of the child pal
 * @property {string} child_name - The name of the child pal
 * @property {string} child_image - The image URL of the child pal
 */

/**
 * Handles GET requests to retrieve a user's saved breeding combinations
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response containing the user's saved breeding combinations or an error message
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const savedCombos = await getSavedBreedingCombosWithDetails(userId);
    return NextResponse.json(savedCombos);
  } catch (error) {
    console.error("Error in GET /api/saved-combinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handles POST requests to add a breeding combination to a user's saved list
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response indicating success or failure of the operation
 */
export async function POST(request) {
  const { userId, breedingComboId } = await request.json();

  if (!userId || !breedingComboId) {
    return NextResponse.json(
      { error: "User ID and Breeding Combo ID are required" },
      { status: 400 }
    );
  }

  try {
    await addSavedBreedingCombo(userId, breedingComboId);
    return NextResponse.json({
      message: "Breeding combination saved successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/saved-combinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to remove a breeding combination from a user's saved list
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response indicating success or failure of the operation
 */
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const comboId = searchParams.get("comboId");

  if (!userId || !comboId) {
    return NextResponse.json(
      { error: "User ID and Combo ID are required" },
      { status: 400 }
    );
  }

  try {
    await removeSavedBreedingCombo(userId, comboId);
    return NextResponse.json({
      message: "Breeding combination removed successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/saved-combinations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
