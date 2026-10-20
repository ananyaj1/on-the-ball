import assert from "node:assert/strict";
import test from "node:test";

import {
  filterFollowedPresales,
  getArtistFollowKey,
  parseFollowedArtistKeys,
  updateFollowedArtistKeys,
} from "./artist-follows.ts";

test("following an artist includes every show for that ID without matching another artist by name", () => {
  const first = {
    artistId: "K8artist1",
    artistName: "Artist",
    eventId: "show-1",
  };
  const second = { ...first, eventId: "show-2", venueName: "Another venue" };
  const unrelated = {
    artistId: "K8artist2",
    artistName: "Artist",
    eventId: "show-3",
  };
  const key = getArtistFollowKey(first);
  assert.deepEqual(filterFollowedPresales([first, second, unrelated], [key]), [
    first,
    second,
  ]);
  assert.deepEqual(filterFollowedPresales([first, second], []), []);
});

test("missing Ticketmaster IDs use a stable normalized name across venues and case changes", () => {
  assert.equal(
    getArtistFollowKey({ artistName: " The   Marías " }),
    getArtistFollowKey({ artistName: "the marías" }),
  );
  assert.notEqual(
    getArtistFollowKey({ artistName: "Clairo" }),
    getArtistFollowKey({ artistName: "The Marías" }),
  );
});

test("follow and unfollow are idempotent and removing one artist keeps other artists", () => {
  const first = "tm:K8artist1",
    second = "tm:K8artist2";
  const followed = updateFollowedArtistKeys([], first, true);
  assert.deepEqual(updateFollowedArtistKeys(followed, first, true), followed);
  const both = updateFollowedArtistKeys(followed, second, true);
  assert.deepEqual(updateFollowedArtistKeys(both, first, false), [second]);
  assert.deepEqual(updateFollowedArtistKeys([second], first, false), [second]);
  assert.deepEqual(parseFollowedArtistKeys(JSON.stringify(both)), both);
});

test("malformed saved follows cannot turn Following into an unfiltered feed", () => {
  for (const value of [
    undefined,
    "",
    "not json",
    "null",
    "{}",
    '"tm:artist"',
  ]) {
    assert.deepEqual(parseFollowedArtistKeys(value), []);
  }
  assert.deepEqual(
    parseFollowedArtistKeys(
      '["tm:K8artist1",null,42,{},"bad-key","tm:K8artist1"]',
    ),
    ["tm:K8artist1"],
  );
  assert.throws(
    () => updateFollowedArtistKeys([], "not-a-valid-key", true),
    TypeError,
  );
});

test("a full follow list can be reduced without silently losing saved artists", () => {
  const current = Array.from(
    { length: 30 },
    (_, index) => `tm:${String(index).padEnd(100, "a")}`,
  );
  const before = [...current];
  assert.throws(
    () => updateFollowedArtistKeys(current, `tm:${"b".repeat(100)}`, true),
    RangeError,
  );
  assert.deepEqual(current, before);
  assert.equal(
    updateFollowedArtistKeys(current, current[0], false).length,
    current.length - 1,
  );
});
