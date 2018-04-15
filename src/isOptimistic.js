// @flow
export const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  );

/**
 * Returns true is a given string is an UUID.
 *
 * UUIDs are commonly used to mark optimistic responses.
 *
 * @type {function(string): boolean}
 */
export const isOptimistic = isUUID;
