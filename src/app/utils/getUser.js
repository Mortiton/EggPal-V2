import { headers } from "next/headers";

/**
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user
 * @property {string} email - The email address of the user
 */

/**
 * Retrieves the current user's information from the request headers
 * @async
 * @function getUser
 * @returns {Promise<User|null>} The user object if authenticated, or null if not authenticated
 */
export async function getUser() {
  const headersList = headers();
  const userId = headersList.get("x-user-id");
  const userEmail = headersList.get("x-user-email");

  if (!userId || !userEmail) {
    return null;
  }

  return { id: userId, email: userEmail };
}
